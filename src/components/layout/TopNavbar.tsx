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
    Menu,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "./AppSidebar";
import { Input } from "@/components/ui/input";

const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Quick Collect", href: "/", icon: CreditCard },
    { title: "Loans", href: "/loans", icon: PieChart },
    { title: "Customers", href: "/clients", icon: Users },
    { title: "Statements", href: "/statements", icon: FileText },
    { title: "Settings", href: "/settings", icon: Settings },
];

export function TopNavbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-6 gap-6">

                {/* 1. Mobile Menu Trigger */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-r w-72">
                        <AppSidebar className="flex w-full h-full border-none" />
                    </SheetContent>
                </Sheet>

                {/* 2. Brand Identity */}
                <div className="flex items-center gap-2 mr-4">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                        <Building2 className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="hidden md:flex flex-col">
                        <span className="font-bold text-lg leading-none tracking-tight">FinCorp</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Enterprise</span>
                    </div>
                </div>

                {/* 3. Main Horizontal Navigation (Desktop) */}
                <div className="hidden md:flex items-center gap-1 flex-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 border border-transparent",
                                    isActive
                                        ? "bg-primary/10 text-primary border-primary/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* 4. Global Search & Tools */}
                <div className="flex items-center gap-2 ml-auto">
                    <div className="hidden lg:flex relative mr-2">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-56 h-9 pl-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-full transition-all focus:w-72"
                        />
                    </div>

                    <div className="w-px h-6 bg-border mx-2 hidden sm:block"></div>

                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Bell className="h-4 w-4" />
                    </Button>

                    <ModeToggle />

                    <div className="ml-2 pl-2 border-l border-border hidden sm:flex items-center gap-3">
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-semibold">Admin</span>
                            <span className="text-[10px] text-muted-foreground">Manager</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted">
                            <span className="font-bold text-xs">AD</span>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
