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
    Command,
    Search,
    ChevronRight,
    ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Quick Collect", href: "/", icon: CreditCard },
    { title: "Loan Portfolio", href: "/loans", icon: PieChart },
    { title: "Statements", href: "/statements", icon: FileText },
    { title: "Customers", href: "/clients", icon: Users },
    { title: "Settings", href: "/settings", icon: Settings },
];

export function BlendedSidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <aside className={cn("flex flex-col w-[260px] h-full text-muted-foreground py-6 px-4 z-50", className)}>

            {/* 1. Brand / Workspace Switcher */}
            <div className="mb-8 px-2 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary shadow-lg shadow-primary/25 flex items-center justify-center text-primary-foreground ring-2 ring-white/10">
                    <Building2 className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                    <span className="text-foreground font-bold tracking-tight text-lg leading-tight">FinCorp</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Enterprise</span>
                </div>
            </div>

            

            {/* 3. Navigation Links */}
            <div className="space-y-1.5 flex-1 px-2">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/50 mb-4 pl-3">Menu</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary-foreground" : "text-muted-foreground/70 group-hover:text-foreground")} />
                                <span>{item.title}</span>
                            </div>
                            {/* {isActive && <div className="h-1.5 w-1.5 rounded-full bg-white/40"></div>} */}
                        </Link>
                    );
                })}
            </div>

            {/* 4. Favorites / Quick Links */}
            <div className="mt-8 px-4">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/50 mb-4">Favorites</p>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs font-medium group cursor-pointer hover:bg-muted/40 p-2 rounded-lg -mx-2 transition-colors">
                        <div className="h-2 w-2 rounded-full bg-orange-500 ring-2 ring-orange-500/20"></div>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">Pending Loans</span>
                        <ArrowUpRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-3 text-xs font-medium group cursor-pointer hover:bg-muted/40 p-2 rounded-lg -mx-2 transition-colors">
                        <div className="h-2 w-2 rounded-full bg-blue-500 ring-2 ring-blue-500/20"></div>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">Today's Collections</span>
                        <ArrowUpRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
            </div>

            {/* 5. User Profile */}
            <div className="mt-auto px-2 pt-6 border-t border-border/40">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-border transition-all cursor-pointer group">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                        AD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">Admin User</span>
                        <span className="text-[10px] text-muted-foreground">admin@fincorp.com</span>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
            </div>

        </aside>
    );
}
