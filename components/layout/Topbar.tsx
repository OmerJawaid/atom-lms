"use client";

import { RoleSwitcher } from "./RoleSwitcher";
import { Bell, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

function getPageTitle(pathname: string): string {
  const map: Record<string, string> = {
    "/student/dashboard": "Student Dashboard",
    "/student/onboarding": "AI Onboarding",
    "/student/roadmap": "Learning Roadmap",
    "/student/quiz": "Adaptive Quiz",
    "/student/mentor": "AI Mentor",
    "/instructor/dashboard": "Instructor Dashboard",
    "/admin/dashboard": "Admin Analytics",
    "/": "Home",
  };
  return map[pathname] || "Atom AI Hub";
}

export function Topbar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="text-gray-400">atomcamp</span>
        <ChevronRight className="w-4 h-4 text-gray-300" />
        <span className="font-semibold text-gray-800">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <RoleSwitcher />
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#008F11] rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#008F11] flex items-center justify-center text-white text-sm font-bold">
          A
        </div>
      </div>
    </header>
  );
}
