"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { MOCK_LOANS } from "@/lib/mock-data";
import {
    ArrowRight,
    IndianRupee,
    Search,
    Plus,
    Calendar,
    Percent,
    Briefcase,
    User,
    Car,
    AlertCircle,
    LayoutGrid,
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { PERMISSIONS } from "@/lib/constants/permissions";
import AccessDenied from "@/components/auth/access-denied";

export default function LoansPage() {
    const { user, checkPermission, isLoading } = useAuth();
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    if (isLoading) return null; // Or a spinner
    if (!checkPermission(PERMISSIONS.VIEW_LOANS)) return <AccessDenied message="You do not have permission to view loans." />;

    const filteredLoans = MOCK_LOANS.filter((loan) => {
        const matchesStatus = filter === "all" ? true : loan.status.toLowerCase() === filter;
        const matchesSearch =
            loan.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    const getLoanIcon = (type: string) => {
        switch (type) {
            case "Business": return Briefcase;
            case "Vehicle": return Car;
            default: return User;
        }
    }

    return (
        <div className="-m-6 md:-m-8 w-[calc(100%+3rem)] md:w-[calc(100%+4rem)] h-[calc(100vh-5rem)] bg-muted/10 flex flex-col overflow-hidden">

            {/* === 1. STICKY HEADER === */}
            <div className="h-13 md:h-14 border-b border-border/50 flex items-center justify-between px-4 bg-white/95 backdrop-blur-xl shrink-0 dark:bg-zinc-950/95 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center text-primary shadow-sm">
                        <LayoutGrid className="h-4 w-4" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold leading-none tracking-tight">Loan Portfolio</h1>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Manage {MOCK_LOANS.length} active accounts</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Compact Search */}
                    <div className="relative w-32 md:w-64 hidden sm:block">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Search accounts..."
                            className="pl-8 h-8 text-xs bg-muted/20 border-border/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Tabs as a Filter dropdown or simple Segmented Control on Desktop */}
                    <Tabs defaultValue="all" className="hidden md:flex" onValueChange={setFilter}>
                        <TabsList className="h-8 p-0.5 bg-muted/20">
                            <TabsTrigger value="all" className="h-7 text-[10px] px-3">All</TabsTrigger>
                            <TabsTrigger value="active" className="h-7 text-[10px] px-3">Active</TabsTrigger>
                            <TabsTrigger value="closed" className="h-7 text-[10px] px-3">Closed</TabsTrigger>
                            <TabsTrigger value="npa" className="h-7 text-[10px] px-3">NPA</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {checkPermission(PERMISSIONS.CREATE_LOAN) && (
                        <Link href="/loans/new">
                            <Button size="sm" className="h-8 gap-2 text-xs font-bold shadow-md shadow-primary/20">
                                <Plus className="h-3.5 w-3.5" /> <span className="hidden md:inline">New Loan</span>
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* === 2. SCROLLABLE CONTENT === */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Mobile Search & Filter Row */}
                <div className="flex flex-col gap-2 sm:hidden pb-2">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-8 h-8 text-xs bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
                        <TabsList className="h-8 w-full bg-muted/20 p-0.5">
                            <TabsTrigger value="all" className="flex-1 h-7 text-[10px]">All</TabsTrigger>
                            <TabsTrigger value="active" className="flex-1 h-7 text-[10px]">Active</TabsTrigger>
                            <TabsTrigger value="npa" className="flex-1 h-7 text-[10px]">NPA</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {filteredLoans.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredLoans.map((loan) => {
                            const Icon = getLoanIcon(loan.loanType);
                            const progress = (loan.emisPaid / loan.tenureMonths) * 100;

                            return (
                                <Card key={loan.loanNumber} className="group hover:shadow-md transition-all duration-300 border-border/50 overflow-hidden rounded-xl">
                                    <CardHeader className="p-4 pb-2 bg-muted/5 border-b border-border/50">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-3 items-center">
                                                <div className="h-8 w-8 rounded-lg bg-white border flex items-center justify-center text-primary shadow-sm shrink-0">
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <CardTitle className="text-sm font-bold truncate">{loan.customerName}</CardTitle>
                                                    <p className="text-[10px] font-mono text-muted-foreground truncate">{loan.loanNumber}</p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={loan.status === 'Active' ? 'default' : loan.status === 'Closed' ? 'secondary' : 'destructive'}
                                                className="uppercase text-[9px] h-5 px-1.5 tracking-wider font-bold"
                                            >
                                                {loan.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-4 space-y-3 bg-white dark:bg-zinc-900">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Principal</p>
                                                <p className="font-bold flex items-center gap-0.5 text-sm">
                                                    <IndianRupee className="h-3 w-3 text-muted-foreground" />
                                                    {loan.totalLoanAmount.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="space-y-0.5 text-right">
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Monthly EMI</p>
                                                <p className="font-bold flex items-center justify-end gap-0.5 text-sm text-emerald-600">
                                                    <IndianRupee className="h-3 w-3" />
                                                    {loan.emiAmount.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress Bar Compact */}
                                        <div className="space-y-1 pt-1">
                                            <div className="flex justify-between text-[10px] font-medium">
                                                <span className="text-muted-foreground">Progress</span>
                                                <span>{loan.emisPaid}/{loan.tenureMonths} ({Math.round(progress)}%)</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full transition-all duration-1000 ease-out rounded-full",
                                                        progress >= 100 ? "bg-emerald-500" : "bg-primary"
                                                    )}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="p-2 bg-muted/5 border-t border-border/50">
                                        <Button variant="ghost" size="sm" className="w-full h-8 text-xs font-semibold group/btn hover:bg-white hover:shadow-sm border border-transparent hover:border-border/50 justify-between px-3" asChild>
                                            <Link href={`/loans/${loan.loanNumber}`}>
                                                <span>View Ledger</span>
                                                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center h-[50vh]">
                        <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center mb-3">
                            <AlertCircle className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-sm font-bold tracking-tight">No loans found</h3>
                        <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
                            Try adjusting your search criteria.
                        </p>
                        <Button variant="outline" size="sm" className="mt-4 h-7 text-xs" onClick={() => { setFilter("all"); setSearchTerm(""); }}>
                            Clear Filters
                        </Button>
                    </div>
                )}
                {/* Bottom Spacer */}
                <div className="h-12 md:hidden"></div>
            </div>
        </div>
    );
}
