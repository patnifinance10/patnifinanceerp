"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Settings,
    FileText,
    PlusCircle,
    Landmark,
    LogOut,
    CreditCard,
    PieChart,
    ShieldCheck,
    ChevronRight,
    Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navGroups = [
    {
        label: "Main",
        items: [
            { title: "Home", href: "/dashboard", icon: LayoutDashboard },
            { title: "Quick Collect", href: "/", icon: CreditCard },
        ]
    },
    {
        label: "Loans",
        items: [
            { title: "Create Loan", href: "/loans/new", icon: PlusCircle },
            { title: "Loan List", href: "/loans", icon: PieChart },
            { title: "Statements", href: "/statements", icon: FileText },
        ]
    },
    {
        label: "People",
        items: [
            { title: "Customers", href: "/clients", icon: Users },
        ]
    },
    {
        label: "System",
        items: [
            { title: "Settings", href: "/settings", icon: Settings },
        ]
    }
];

export function AppSidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "flex h-full w-[250px] flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border z-50 transition-all duration-300 font-sans tracking-wide shadow-xl",
                className
            )}
        >
            {/* 1. BRAND HEADER - Robust ERP Style */}
            <div className="flex h-16 shrink-0 items-center px-5 border-b border-sidebar-border bg-sidebar/95">
                <div className="h-8 w-8 rounded bg-primary flex items-center justify-center mr-3 shadow-md">
                    <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] items-center flex gap-1 font-medium text-sidebar-foreground/60 tracking-wider mt-1">
                        ERP v2.4
                    </span>
                </div>
            </div>

            {/* 2. NAVIGATION - Dense & Professional */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-hide">
                {navGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                        <h4 className="mb-2 px-3 text-[10px] font-bold text-sidebar-foreground/50 uppercase tracking-widest flex items-center gap-2">
                            {group.label}
                            <div className="h-px bg-sidebar-border flex-1"></div>
                        </h4>
                        <nav className="grid gap-1">
                            {group.items.map((item, index) => {
                                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className={cn(
                                            "group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className={cn("h-4 w-4", isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground")} />
                                            <span>{item.title}</span>
                                        </div>
                                        {isActive && <ChevronRight className="h-3 w-3 opacity-50" />}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </div>

            {/* 3. USER PROFILE - Compact Footer */}
            <div className="p-4 border-t border-sidebar-border bg-sidebar/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-foreground border border-sidebar-border">
                        AD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-sidebar-foreground">Administrator</span>
                        <span className="text-[10px] text-sidebar-foreground/60">Head Office • Online</span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 h-8 px-2 text-xs font-medium tracking-wide transition-colors rounded-sm"
                >
                    <LogOut className="mr-2 h-3.5 w-3.5" />
                    Sign Out
                </Button>
            </div>
        </aside>
    );
}
