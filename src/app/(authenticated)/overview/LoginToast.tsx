"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginToast() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (searchParams.get('login') === 'success') {
            toast({
                title: "Welcome back!",
                description: "You've successfully signed in.",
            });

            router.replace('/overview');
        }
    }, [searchParams, router, toast]);

    return null;
}
