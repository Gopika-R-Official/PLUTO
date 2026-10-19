"use client";

import type { FeedModuleId } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { moveModule, resetLayout, setFeedOrder } from "@/store/slices/layoutSlice";
import { AnimatePresence, motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDown,
  ArrowUp,
  Disc3,
  Film,
  GripVertical,
  RotateCcw,
  Sparkles,
  Users,
  Utensils,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/Toast";
import React, { useState } from "react";

interface FeedOrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MODULE_LABELS: Record<
  FeedModuleId,
  { label: string; description: string; icon: React.ReactNode }
> = {
  featured: {
    label: "Cinematic Discovery Stage",
    description: "Immersive hero spotlight with trailer playback and deep actions",
    icon: <Sparkles className="h-4 w-4 text-blue-500" />,
  },
  topics: {
    label: "Picked for You (Bento Mix)",
    description: "Adaptive blend across your films, music, stories, and dining",
    icon: <Sparkles className="h-4 w-4 text-purple-500" />,
  },
  movies: {
    label: "Your Next Film (Cinema Radar)",
    description: "Authentic film posters, TMDB ratings, and instant trailers",
    icon: <Film className="h-4 w-4 text-amber-500" />,
  },
  news: {
    label: "Culinary & Dining Guide (Gastronomy)",
    description: "World-class dining destinations and table reservations",
    icon: <Utensils className="h-4 w-4 text-emerald-500" />,
  },
  music: {
    label: "Your Kind of Music (Sonic Radar)",
    description: "Album art, vinyl sleeve animation, and interactive audio previews",
    icon: <Disc3 className="h-4 w-4 text-pink-500" />,
  },
  together: {
    label: "Discover Together (Circles & Rooms)",
    description: "Shared group watchlists, film votes, and collaborative lounges",
    icon: <Users className="h-4 w-4 text-cyan-500" />,
  },
  myspace: {
    label: "Mood Explorer Portal (Intentions)",
    description: "Deep exploration portal connecting into Discover",
    icon: <Sparkles className="h-4 w-4 text-indigo-400" />,
  },
  social: {
    label: "Community Voices & Discussions",
    description: "Curator thoughts, discussions, and shared discoveries",
    icon: <Users className="h-4 w-4 text-violet-500" />,
  },
};

interface SortableModuleItemProps {
  id: FeedModuleId;
  meta: { label: string; description: string; icon: React.ReactNode };
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function SortableModuleItem({
  id,
  meta,
  index,
  total,
  onMoveUp,
  onMoveDown,
}: SortableModuleItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    zIndex: isDragging ? 50 : undefined,
    touchAction: "none",
  };

  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-3 p-3 rounded-2xl border ${
        isDragging
          ? "border-blue-500 bg-white/95 dark:bg-[#121626] shadow-2xl scale-[1.02] opacity-60 ring-2 ring-blue-500/20"
          : "border-black/[0.08] dark:border-white/10 bg-white/80 dark:bg-[#0c101d]/90 hover:border-blue-500/30"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Drag Handle using div role="button" to avoid browser button pointer capture bugs */}
        <div
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="grid h-8 w-8 place-items-center rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-grab active:cursor-grabbing touch-none select-none transition shrink-0"
          aria-label={`Drag handle to reorder ${meta.label}`}
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <span className="grid h-8 w-8 place-items-center rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/10 shrink-0">
          {meta.icon}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
            {meta.label}
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
            {meta.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          disabled={isFirst}
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="grid h-7 w-7 place-items-center rounded-lg border border-black/[0.08] dark:border-white/10 text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-25 transition cursor-pointer"
          aria-label={`Move ${meta.label} up`}
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={isLast}
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="grid h-7 w-7 place-items-center rounded-lg border border-black/[0.08] dark:border-white/10 text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-25 transition cursor-pointer"
          aria-label={`Move ${meta.label} down`}
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function FeedOrganizerModal({ isOpen, onClose }: FeedOrganizerModalProps) {
  const dispatch = useAppDispatch();
  const feedOrder = useAppSelector((state) => state.layout.feedOrder);
  const [activeId, setActiveId] = useState<FeedModuleId | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: { active: { id: string | number } }) => {
    setActiveId(event.active.id as FeedModuleId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = feedOrder.indexOf(active.id as FeedModuleId);
    const newIndex = feedOrder.indexOf(over.id as FeedModuleId);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(feedOrder, oldIndex, newIndex);
      dispatch(setFeedOrder(newOrder));
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="organizer-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-black/[0.08] dark:border-white/10 bg-white dark:bg-[#0c101d] p-6 sm:p-7 shadow-2xl text-neutral-900 dark:text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.08] dark:border-white/10">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                Feed Architecture
              </p>
              <h2 id="organizer-title" className="editorial mt-1 text-2xl font-bold">
                Customize Discovery Stream
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full bg-black/[0.04] dark:bg-white/10 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
              aria-label="Close layout organizer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Drag items using handles or use the arrow buttons to reorder modules. Sequence persists locally.
          </p>

          {/* DndContext & Sortable List */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={feedOrder} strategy={verticalListSortingStrategy}>
              <div className="mt-5 space-y-2">
                {feedOrder.map((moduleId, index) => {
                  const meta = MODULE_LABELS[moduleId];
                  if (!meta) return null;

                  return (
                    <SortableModuleItem
                      key={moduleId}
                      id={moduleId}
                      meta={meta}
                      index={index}
                      total={feedOrder.length}
                      onMoveUp={() => dispatch(moveModule({ id: moduleId, direction: -1 }))}
                      onMoveDown={() => dispatch(moveModule({ id: moduleId, direction: 1 }))}
                    />
                  );
                })}
              </div>
            </SortableContext>

            {/* Drag Overlay for smooth cursor tracking */}
            <DragOverlay>
              {activeId ? (
                <div className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-blue-500 bg-white dark:bg-[#121626] shadow-2xl scale-[1.03] ring-2 ring-blue-500/30 opacity-95">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="grid h-8 w-8 place-items-center rounded-lg text-blue-500">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/10">
                      {MODULE_LABELS[activeId]?.icon}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                        {MODULE_LABELS[activeId]?.label}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {MODULE_LABELS[activeId]?.description}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {/* Footer controls */}
          <div className="mt-6 flex items-center justify-between border-t border-black/[0.08] dark:border-white/10 pt-4">
            <button
              type="button"
              onClick={() => {
                dispatch(resetLayout());
                toast.info("Default layout sequence restored");
              }}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Default Sequence</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                toast.success("Feed layout updated");
              }}
              className="rounded-full bg-neutral-900 dark:bg-white px-5 py-2 text-xs font-semibold text-white dark:text-neutral-950 transition hover:opacity-90 cursor-pointer"
            >
              Apply Sequence
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
