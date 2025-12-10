import { Martini, Terminal, Utensils, Music } from "lucide-react";

export const VIBE_PRESETS = [
  {
    id: "casual",
    label: "Social Mixer",
    icon: Martini,
    description: "Relaxed, informal, fun",
    color: "from-orange-400 to-pink-500",
  },
  {
    id: "tech",
    label: "Tech Meetup",
    icon: Terminal,
    description: "Hackers, demos, pizza",
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: "dinner",
    label: "Private Dinner",
    icon: Utensils,
    description: "Intimate, curated, classy",
    color: "from-emerald-400 to-teal-500",
  },
  {
    id: "party",
    label: "After Party",
    icon: Music,
    description: "Loud, dark, energetic",
    color: "from-purple-500 to-indigo-600",
  },
];
