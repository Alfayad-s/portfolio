"use client";

import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBriefcase2,
  IconFolder,
  IconHome,
  IconMail,
  IconUser,
} from "@tabler/icons-react";

const iconClass = "h-full w-full text-neutral-500 dark:text-neutral-300";

/** Site pages + home sections (matches Footer / ChatWidget routes). */
const NAV_LINKS = [
  {
    title: "Home",
    icon: <IconHome className={iconClass} />,
    href: "/",
  },
  {
    title: "About",
    icon: <IconUser className={iconClass} />,
    href: "/#about",
  },
  {
    title: "Work",
    icon: <IconFolder className={iconClass} />,
    href: "/work",
  },
  {
    title: "Services",
    icon: <IconBriefcase2 className={iconClass} />,
    href: "/services",
  },
  {
    title: "Contact",
    icon: <IconMail className={iconClass} />,
    href: "/contact",
  },
];

export default function FloatingDockNav() {
  const links = NAV_LINKS;

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto">
        <FloatingDock items={links} mobileClassName="relative" />
      </div>
    </div>
  );
}
