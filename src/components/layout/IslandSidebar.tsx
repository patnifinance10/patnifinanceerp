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
    LogOut,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navGroups = [
    {
        label: "Main",
        items: [
            { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { title: "Quick Collect", href: "/", icon: CreditCard },
        ]
    },
    {
        label: "Loans",
        items: [
            { title: "Portfolio", href: "/loans", icon: PieChart },
            { title: "New Loan", href: "/loans/new", icon: CreditCard },
            { title: "Statements", href: "/statements", icon: FileText },
        ]
    },
    {
        label: "Manage",
        items: [
            { title: "Customers", href: "/clients", icon: Users },
            { title: "Settings", href: "/settings", icon: Settings },
        ]
    }
];

export function IslandSidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <aside className={cn("flex flex-col h-[calc(100vh-2rem)] my-4 ml-4 w-[240px] z-50", className)}>
            {/* The Floating Container */}
            <div className="flex-1 flex flex-col bg-sidebar/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 supports-[backdrop-filter]:bg-sidebar/60">

                {/* Brand Header */}
                <div className="h-20 flex items-center px-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg transform -rotate-3 text-white">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <div className="ml-3">
                        <h1 className="font-bold text-xl tracking-tight">FinCorp</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Island UI</p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-hide">
                    {navGroups.map((group, idx) => (
                        <div key={idx}>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-3 px-3">
                                {group.label}
                            </h3>
                            <nav className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 ease-out",
                                                isActive
                                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 translate-x-1"
                                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:translate-x-1"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className={cn("h-[18px] w-[18px]", isActive ? "animate-pulse" : "opacity-70 group-hover:opacity-100")} />
                                                <span className="text-sm font-semibold">{item.title}</span>
                                            </div>
                                            {isActive && <ChevronRight className="h-3 w-3 opacity-50" />}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>

                {/* User Profile Card */}
                <div className="p-4 bg-gradient-to-b from-transparent to-black/5">
                    <div className="bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
                                <div className="h-full w-full rounded-full bg-background border-2 border-transparent flex items-center justify-center overflow-hidden">
                                    <span className="font-bold text-xs">AD</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">Admin User</span>
                                <span className="text-[10px] text-muted-foreground">Online</span>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full text-xs h-8 rounded-xl bg-muted/50 hover:bg-destructive/10 hover:text-destructive transition-colors">
                            <LogOut className="h-3 w-3 mr-2" /> Logout
                        </Button>
                    </div>
                </div>

            </div>
        </aside>
    );
}
