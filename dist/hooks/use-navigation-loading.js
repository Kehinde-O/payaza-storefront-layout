'use client';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '../lib/loading-context';
export function useNavigationLoading() {
    const router = useRouter();
    const { startPageLoading, stopPageLoading } = useLoading();
    const navigateWithLoading = useCallback((href) => {
        startPageLoading();
        router.push(href);
        // Stop loading will be handled by the route change detection in LoadingProvider
    }, [router, startPageLoading]);
    return { navigateWithLoading };
}
