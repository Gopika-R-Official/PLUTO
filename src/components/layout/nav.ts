import {
  Compass,
  Flame,
  Heart,
  Settings,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Discover", icon: Compass },
  { href: "/trending", label: "Trending", icon: Flame },
  { href: "/my-space", label: "My Space", icon: Sparkles },
  { href: "/together", label: "Together", icon: Users },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/settings", label: "Settings", icon: Settings },
];
