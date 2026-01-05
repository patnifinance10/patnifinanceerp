"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    PieChart,
    Settings,
    FileText,
    Building2,
    Search,
    Menu,
    Bell,
    Plus,
    Table,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";

const navTabs = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Quick Collect", href: "/", icon: CreditCard },
    { title: "Loan Manager", href: "/loans", icon: PieChart },
    { title: "Customer Database", href: "/clients", icon: Users },
    { title: "Reports & Stmts", href: "/statements", icon: FileText },
    { title: "System Config", href: "/settings", icon: Settings },
];

export function RibbonNavigation() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col w-full shadow-sm z-50">

            {/* 1. TITLE BAR (Green Excel-like or Brand Color) */}
            <div className="h-10 bg-[#107C41] dark:bg-emerald-900 flex items-center justify-between px-4 text-white">
                <div className="flex items-center gap-3">
                    <div className="p-1 bg-white/10 rounded hover:bg-white/20 cursor-pointer transition-colors">
                        <Menu className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-sm tracking-wide flex items-center gap-2">
                        <Table className="h-4 w-4 opacity-80" />
                        FinCorp_Enterprise_ERP.xlsx
                    </span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white/90">Saved</span>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="hidden md:flex items-center bg-black/20 rounded overflow-hidden w-64">
                        <div className="px-2 text-white/60"><Search className="h-3 w-3" /></div>
                        <input
                            className="bg-transparent border-none outline-none text-white placeholder:text-white/50 h-7 w-full text-xs"
                            placeholder="Search (Alt+Q)"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="opacity-80 hover:opacity-100 cursor-pointer">Admin User</span>
                        <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">AD</div>
                    </div>
                </div>
            </div>

            {/* 2. RIBBON TOOLBAR (Actions) */}
            <div className="h-14 bg-gray-50 dark:bg-zinc-900 border-b flex items-center px-4 gap-2 overflow-x-auto scrollbar-hide">
                <div className="flex items-center pr-4 border-r mr-4 gap-1">
                    <div className="flex flex-col items-center justify-center h-10 w-12 hover:bg-muted rounded cursor-pointer group">
                        <Plus className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-muted-foreground">New</span>
                    </div>
                    <div className="flex flex-col items-center justify-center h-10 w-12 hover:bg-muted rounded cursor-pointer group">
                        <Save className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-muted-foreground">Save</span>
                    </div>
                </div>

                {/* TABS AS RIBBON ITEMS */}
                <div className="flex items-center gap-1">
                    {navTabs.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center h-11 min-w-[3.5rem] px-3 rounded-sm transition-all duration-200 border-b-2",
                                    isActive
                                        ? "bg-white dark:bg-zinc-800 border-[#107C41] text-[#107C41] shadow-sm"
                                        : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4 mb-0.5", isActive ? "stroke-[2.5]" : "")} />
                                <span className={cn("text-[10px] font-medium leading-none", isActive && "font-bold")}>{item.title}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="ml-auto flex items-center gap-2 pl-4 border-l">
                    <ModeToggle />
                </div>
            </div>

            {/* 3. FORMULA BAR (Optional Cosmetic) */}
            <div className="h-8 bg-white dark:bg-zinc-950 border-b flex items-center px-2 text-sm font-mono text-muted-foreground gap-2">
                <div className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-900 border rounded text-xs w-16 text-center">A1</div>
                <div className="h-4 w-px bg-border"></div>
                <div className="flex-1 px-2 text-xs truncate">
                    {/* Dynamic 'Formula' based on page */}
                    {pathname === '/' ? '=SUM(Daily_Collection)' : `='${navTabs.find(t => t.href === pathname)?.title || 'Sheet1'}'!View`}
                </div>
            </div>
        </div>
    );
}
