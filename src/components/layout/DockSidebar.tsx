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
    Plus,
    Search
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const mainNav = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Day Book", href: "/", icon: CreditCard },
    { title: "Loans", href: "/loans", icon: PieChart },
    { title: "Customers", href: "/clients", icon: Users },
    { title: "Statements", href: "/statements", icon: FileText },
];

const bottomNav = [
    { title: "Settings", href: "/settings", icon: Settings },
];

export function DockSidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    const NavItem = ({ item }: { item: typeof mainNav[0] }) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Link
                        href={item.href}
                        className={cn(
                            "flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group relative",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <item.icon className="w-5 h-5 stroke-[1.5]" />
                        {isActive && (
                            <span className="absolute -right-1 top-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
                            </span>
                        )}
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-semibold text-xs px-3 py-1.5 ml-2 bg-foreground text-background">
                    {item.title}
                </TooltipContent>
            </Tooltip>
        );
    };

    return (
        <TooltipProvider>
            <aside className={cn("flex flex-col items-center w-20 h-screen py-6 bg-background/50 backdrop-blur-md border-r border-border/40 z-50", className)}>

                {/* Brand Icon */}
                <div className="mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white cursor-pointer hover:scale-105 transition-transform">
                        <Building2 className="w-6 h-6" />
                    </div>
                </div>

                {/* Main Action - Quick Create */}
                <div className="mb-6">
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Button size="icon" className="h-10 w-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md">
                                <Plus className="w-6 h-6" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="ml-2 font-bold">New Entry</TooltipContent>
                    </Tooltip>
                </div>

                {/* Primary Navigation */}
                <nav className="flex-1 flex flex-col gap-4 w-full items-center">
                    {mainNav.map((item) => (
                        <NavItem key={item.href} item={item} />
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="flex flex-col gap-4 mt-auto items-center">
                    {/* Search Trigger */}
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-muted-foreground hover:bg-muted">
                        <Search className="w-5 h-5" />
                    </Button>

                    <div className="w-8 h-px bg-border/50 rounded-full my-2"></div>

                    {bottomNav.map((item) => (
                        <NavItem key={item.href} item={item} />
                    ))}

                    <div className="mt-2">
                        <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold border-2 border-transparent hover:border-primary transition-colors cursor-pointer text-muted-foreground">
                            AD
                        </div>
                    </div>
                </div>

            </aside>
        </TooltipProvider>
    );
}
