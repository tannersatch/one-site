import portrait from "~/assets/portfolio/portfolio-tanner.png";

export interface SiteEntry {
  id: string;
  title: string;
  navigationLabel?: string;
  category: string;
  description: string;
  to: string;
  icon: string;
  image?: string;
  imageAlt?: string;
}

export const sites: SiteEntry[] = [
  {
    id: "portfolio",
    title: "Portfolio",
    category: "THE DEVELOPER",
    description: "My work, experience, and experiments in software.",
    to: "/portfolio",
    icon: "i-lucide-code-xml",
    image: portrait,
    imageAlt: "Tanner Satchwell",
  },
  {
    id: "big-foot-forward",
    title: "Big Foot Forward LLC",
    category: "THE BUSINESS",
    description: "The business behind the ideas. A little about Big Foot Forward.",
    to: "/bff",
    icon: "i-lucide-footprints",
  },
  {
    id: "developer-tools",
    title: "Developer tools",
    navigationLabel: "Dev Tools",
    category: "THE WORKBENCH",
    description: "Small, useful utilities for everyday development.",
    to: "/tools",
    icon: "i-lucide-terminal",
  },
];
