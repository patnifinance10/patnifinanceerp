
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function AccessDenied({
    message = "You do not have permission to view this page.",
    returnTo = "/",
    returnLabel = "Return to Dashboard"
}: {
    message?: string;
    returnTo?: string;
    returnLabel?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6 dark:bg-red-900/20">
                <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                {message}
            </p>
            <Link href={returnTo}>
                <Button variant="default">
                    {returnLabel}
                </Button>
            </Link>
        </div>
    );
}
