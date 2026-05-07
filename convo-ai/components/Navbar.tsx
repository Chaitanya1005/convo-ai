"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, Bell, Settings, User } from "lucide-react";

const NAV_ITEMS = [
  { label: "Lead Console", href: "/workspace" },
  { label: "Dashboard", href: "/dashboard/" },
  { label: "Try Convo-AI", href: "/test-agent" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
      <div className="flex items-center gap-6">
        <Link href="/workspace" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <TrendingUp size={14} className="text-white" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-slate-800 text-sm">Convo-AI</span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-slate-500 text-xs">Rupeezy RM Workspace</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ label, href }) => {
            const active = pathname === href || (href !== "/workspace" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  active ? "bg-brand-50 text-brand-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell size={15} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <Settings size={15} />
        </button>
        <div className="flex items-center gap-2 pl-2 ml-1 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
            <User size={13} className="text-brand-600" />
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold text-slate-700 leading-none">Arjun RM</div>
            <div className="text-[10px] text-slate-400 mt-0.5">rm@rupeezy.in</div>
          </div>
        </div>
      </div>
    </header>
  );
}
