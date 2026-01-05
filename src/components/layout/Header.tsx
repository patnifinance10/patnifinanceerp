"use client";

import { Menu, Search, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "./AppSidebar";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Input } from "@/components/ui/input";

export function Header() {
    const pathname = usePathname();

    // Get current page title based on path
    const getTitle = () => {
        if (pathname === "/") return "Counter";
        if (pathname.startsWith("/clients")) return "Customers";
        if (pathname.startsWith("/loans")) return "Loan Portfolio";
        if (pathname.startsWith("/settings")) return "Settings";
        return "Dashboard";
    };

    return (
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b bg-white dark:bg-zinc-950 px-4 shadow-sm">
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64 border-none">
                        <AppSidebar className="flex w-full h-full" />
                    </SheetContent>
                </Sheet>
                <div className="flex flex-col">
                    <h1 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 md:hidden">{getTitle()}</h1>
                    {/* On Desktop, we can show Breadcrumbs or just a clean search bar area */}
                    <div className="hidden md:flex items-center text-sm text-uted-foreground font-medium text-gray-500">
                        <span className="text-primary font-bold">FinCorp</span>
                        <span className="mx-2">/</span>
                        <span className="text-foreground">{getTitle()}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Global Search concept for ERP */}
                <div className="hidden md:flex relative mr-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Global Search (Ctrl+K)..."
                        className="w-64 h-9 pl-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-md"
                    />
                </div>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <Settings className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1"></div>
                <ModeToggle />
            </div>
        </header>
    );
}
