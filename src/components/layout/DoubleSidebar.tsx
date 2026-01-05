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
    Bell,
    Plus,
    ChevronRight,
    Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Primary Modules (Left Rail)
const modules = [
    { id: "main", icon: LayoutDashboard, label: "Home" },
    { id: "loans", icon: PieChart, label: "Loans" },
    { id: "payments", icon: CreditCard, label: "Pay" },
    { id: "users", icon: Users, label: "Users" },
    { id: "config", icon: Settings, label: "Config" },
];

// Sub-menus mapping
const subMenus: Record<string, { title: string; href: string }[]> = {
    main: [
        { title: "Dashboard Overview", href: "/dashboard" },
        { title: "Activity Log", href: "/activity" },
        { title: "Notifications", href: "/notifications" },
    ],
    loans: [
        { title: "Loan Portfolio", href: "/loans" },
        { title: "Create New Loan", href: "/loans/new" },
        { title: "Loan Statements", href: "/statements" },
        { title: "Pending Approvals", href: "/loans/pending" },
    ],
    payments: [
        { title: "Quick Collect", href: "/" },
        { title: "Transaction History", href: "/transactions" },
        { title: "Due Today", href: "/due" },
    ],
    users: [
        { title: "Customer Database", href: "/clients" },
        { title: "Guarantors", href: "/guarantors" },
        { title: "Staff Members", href: "/staff" },
    ],
    config: [
        { title: "General Settings", href: "/settings" },
        { title: "Company Profile", href: "/settings/company" },
        { title: "Security", href: "/settings/security" },
    ]
};

export function DoubleSidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    // Determine active module based on path
    const getActiveModule = () => {
        if (pathname === "/") return "payments";
        if (pathname.startsWith("/loans") || pathname.startsWith("/statements")) return "loans";
        if (pathname.startsWith("/clients")) return "users";
        if (pathname.startsWith("/settings")) return "config";
        return "main";
    };

    const activeModuleId = getActiveModule();
    const activeSubItems = subMenus[activeModuleId] || subMenus["main"];
    const ActiveIcon = modules.find(m => m.id === activeModuleId)?.icon || LayoutDashboard;

    return (
        <aside className={cn("flex h-screen shadow-2xl z-50", className)}>

            {/* 1. PRIMARY RAIL (Dark Accent) */}
            <div className="w-[70px] bg-[#1e1e2e] flex flex-col items-center py-6 gap-6 text-white shrink-0">
                <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg mb-4">
                    <Building2 className="h-6 w-6 text-white" />
                </div>

                <div className="flex flex-col gap-4 w-full px-2">
                    {modules.map((mod) => {
                        const isActive = activeModuleId === mod.id;
                        return (
                            <button
                                key={mod.id}
                                className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group",
                                    isActive
                                        ? "bg-white/10 text-white shadow-inner"
                                        : "text-white/40 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <mod.icon className="h-6 w-6" />
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-full"></div>
                                )}
                                <span className="absolute left-14 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                    {mod.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-auto mb-4">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                        <span className="text-xs font-bold">AD</span>
                    </div>
                </div>
            </div>

            {/* 2. SECONDARY PANEL (Light Context Menu) */}
            <div className="w-[240px] bg-white dark:bg-zinc-900 border-r flex flex-col relative">

                {/* Header of Panel */}
                <div className="h-20 border-b flex items-center px-6">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Module</span>
                        <h2 className="text-xl font-bold flex items-center gap-2 capitalize">
                            <ActiveIcon className="h-5 w-5 text-orange-500" />
                            {modules.find(m => m.id === activeModuleId)?.label}
                        </h2>
                    </div>
                </div>

                {/* Sub-menu Items */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <div className="mb-6 px-2">
                        <p className="text-xs text-muted-foreground mb-4">Quick Actions</p>
                        <Button className="w-full justify-start gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 shadow-sm" variant="outline">
                            <Plus className="h-4 w-4" /> New Entry
                        </Button>
                    </div>

                    <Separator className="my-4 mx-2 w-auto opacity-50" />

                    <p className="text-xs text-muted-foreground px-2 mb-2 uppercase tracking-wider font-semibold">Navigation</p>
                    {activeSubItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-gray-100 dark:bg-zinc-800 text-foreground font-semibold"
                                        : "text-muted-foreground hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-foreground"
                                )}
                            >
                                <span>{item.title}</span>
                                {isActive && <ChevronRight className="h-3 w-3 text-orange-500" />}
                            </Link>
                        );
                    })}
                </div>

                {/* Footer Quote/Info */}
                <div className="p-4 bg-gray-50 dark:bg-zinc-950/50 mt-auto border-t text-center">
                    <p className="text-[10px] text-muted-foreground">
                        "Financial clarity is power."
                    </p>
                </div>
            </div>
        </aside>
    );
}
