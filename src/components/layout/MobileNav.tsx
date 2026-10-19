"use client";

import { NAV_ITEMS } from "@/components/layout/nav";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-2 py-2 backdrop-blur-lg lg:hidden"
    >
      <ul className="grid grid-cols-6 gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] transition-colors ${
                  active
                    ? "text-blue-600 dark:text-blue-400 font-bold bg-blue-500/[0.08] dark:bg-white/[0.08]"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="truncate">{item.label}</span>
                {active && (
                  <span className="h-1 w-1 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
