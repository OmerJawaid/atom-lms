"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, User, Map, Brain, MessageSquare,
  Users, TrendingUp, Settings, Zap
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const studentNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/student/dashboard" },
  { label: "Onboarding", icon: User, href: "/student/onboarding" },
  { label: "My Roadmap", icon: Map, href: "/student/roadmap" },
  { label: "Adaptive Quiz", icon: Brain, href: "/student/quiz" },
  { label: "AI Mentor", icon: MessageSquare, href: "/student/mentor" },
];

const instructorNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/instructor/dashboard" },
];

const adminNav = [
  { label: "Analytics", icon: TrendingUp, href: "/admin/dashboard" },
];

export function Sidebar() {
  const pathname = usePathname();

  let navItems = studentNav;
  let roleLabel = "Student";
  let roleColor = "bg-[#008F11]";

  if (pathname.startsWith("/instructor")) {
    navItems = instructorNav;
    roleLabel = "Instructor";
    roleColor = "bg-blue-600";
  } else if (pathname.startsWith("/admin")) {
    navItems = adminNav;
    roleLabel = "Admin";
    roleColor = "bg-purple-600";
  }

  return (
    <aside className="w-64 min-h-screen bg-[#0B1F33] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#008F11] flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Atom AI Hub</p>
            <p className="text-gray-400 text-xs">atomcamp LMS</p>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-6 py-3">
        <span className={cn("text-xs font-semibold px-2 py-1 rounded-full text-white", roleColor)}>
          {roleLabel} View
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-all",
                isActive
                  ? "bg-[#008F11] text-white font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white text-xs transition-colors"
        >
          <Settings className="w-4 h-4" />
          Home / Switch Role
        </Link>
      </div>
    </aside>
  );
}
