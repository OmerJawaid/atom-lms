"use client";

import { useRouter, usePathname } from "next/navigation";
import { GraduationCap, BookOpen, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const roles = [
  { label: "Student", icon: GraduationCap, path: "/student/dashboard" },
  { label: "Instructor", icon: BookOpen, path: "/instructor/dashboard" },
  { label: "Admin", icon: BarChart3, path: "/admin/dashboard" },
];

export function RoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const currentRole = roles.find((r) => pathname.startsWith(r.path.split("/").slice(0, 2).join("/")));

  return (
    <div className="flex items-center gap-1 bg-[#0B1F33] rounded-lg p-1">
      {roles.map((role) => {
        const Icon = role.icon;
        const isActive = pathname.startsWith("/" + role.path.split("/")[1]);
        return (
          <button
            key={role.label}
            onClick={() => router.push(role.path)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              isActive
                ? "bg-[#008F11] text-white"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            )}
          >
            <Icon className="w-4 h-4" />
            {role.label}
          </button>
        );
      })}
    </div>
  );
}
