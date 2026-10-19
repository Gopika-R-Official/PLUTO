import { YOU } from "@/lib/constants";
import { uniqueId } from "@/lib/format";
import type {
  ActivityEvent,
  ContentItem,
  DiscoveryGroup,
  RoomStatus,
  TogetherMember,
} from "@/lib/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TogetherState {
  groups: DiscoveryGroup[];
  activities: ActivityEvent[];
}

const demoMembers: TogetherMember[] = [
  YOU,
  { id: "meera", name: "Meera K.", initials: "MK" },
  { id: "rohan", name: "Rohan V.", initials: "RV" },
];

function demoGroup(): DiscoveryGroup {
  return {
    id: "group-friday-desk",
    name: "Friday desk",
    description: "A small room for films, food, and one good article before the weekend.",
    inviteCode: "PLUTO-FRIDAY",
    createdAt: "2026-10-10T10:00:00.000Z",
    members: demoMembers,
    items: [],
    room: {
      title: "Friday watch & walk",
      status: "planning",
      notes: "Vote by Thursday evening. No synchronized streaming — just a shared plan.",
      scheduledFor: null,
    },
  };
}

const initialState: TogetherState = {
  groups: [demoGroup()],
  activities: [
    {
      id: "act-1",
      text: "Meera joined Friday desk.",
      createdAt: "2026-10-12T09:00:00.000Z",
    },
  ],
};

function pushActivity(state: TogetherState, text: string) {
  state.activities.unshift({
    id: uniqueId("act"),
    text,
    createdAt: new Date().toISOString(),
  });
  state.activities = state.activities.slice(0, 20);
}

const togetherSlice = createSlice({
  name: "together",
  initialState,
  reducers: {
    hydrateTogether(_state, action: PayloadAction<TogetherState>) {
      if (!action.payload.groups?.length) return initialState;
      return action.payload;
    },
    createGroup(state, action: PayloadAction<{ name: string; description: string }>) {
      const group: DiscoveryGroup = {
        id: uniqueId("group"),
        name: action.payload.name,
        description: action.payload.description,
        inviteCode: `PLUTO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        members: [YOU],
        items: [],
        room: {
          title: `${action.payload.name} room`,
          status: "planning",
          notes: "Local demo — this group lives in your browser only.",
          scheduledFor: null,
        },
      };
      state.groups.unshift(group);
      pushActivity(state, `You created ${group.name}.`);
    },
    joinByCode(state, action: PayloadAction<string>) {
      const code = action.payload.trim().toUpperCase();
      const group = state.groups.find((item) => item.inviteCode === code);
      if (!group) return;
      if (!group.members.some((member) => member.id === YOU.id)) {
        group.members.push(YOU);
        pushActivity(state, `You joined ${group.name}.`);
      }
    },
    shareToGroup(state, action: PayloadAction<{ groupId: string; item: ContentItem }>) {
      const group = state.groups.find((item) => item.id === action.payload.groupId);
      if (!group) return;
      if (group.items.some((entry) => entry.item.id === action.payload.item.id)) return;
      group.items.unshift({
        id: uniqueId("share"),
        addedBy: YOU.id,
        addedAt: new Date().toISOString(),
        votes: { [YOU.id]: 1 },
        item: action.payload.item,
      });
      pushActivity(state, `You shared “${action.payload.item.title}” with ${group.name}.`);
    },
    voteShared(
      state,
      action: PayloadAction<{ groupId: string; sharedId: string; value: 1 | -1 }>,
    ) {
      const group = state.groups.find((item) => item.id === action.payload.groupId);
      const shared = group?.items.find((item) => item.id === action.payload.sharedId);
      if (!shared) return;
      if (shared.votes[YOU.id] === action.payload.value) {
        delete shared.votes[YOU.id];
      } else {
        shared.votes[YOU.id] = action.payload.value;
      }
    },
    updateRoom(
      state,
      action: PayloadAction<{
        groupId: string;
        title?: string;
        notes?: string;
        status?: RoomStatus;
        scheduledFor?: string | null;
      }>,
    ) {
      const group = state.groups.find((item) => item.id === action.payload.groupId);
      if (!group) return;
      if (action.payload.title !== undefined) group.room.title = action.payload.title;
      if (action.payload.notes !== undefined) group.room.notes = action.payload.notes;
      if (action.payload.status) group.room.status = action.payload.status;
      if (action.payload.scheduledFor !== undefined) {
        group.room.scheduledFor = action.payload.scheduledFor;
      }
      pushActivity(state, `Room updated in ${group.name}.`);
    },
  },
});

export const { hydrateTogether, createGroup, joinByCode, shareToGroup, voteShared, updateRoom } =
  togetherSlice.actions;
export default togetherSlice.reducer;
