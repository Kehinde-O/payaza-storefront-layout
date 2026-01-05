'use client';
import { useState } from 'react';
import { initiatePayazaCheckout } from '../lib/payaza-checkout';
export function usePayazaCheckout({ publicKey, onSuccess, onError, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const checkout = async (config) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await initiatePayazaCheckout({
                ...config,
                publicKey,
                onSuccess: (response) => {
                    setIsLoading(false);
                    onSuccess?.(response);
                },
                onError: (errorMessage) => {
                    setIsLoading(false);
                    setError(errorMessage);
                    onError?.(errorMessage);
                },
                onClose: () => {
                    setIsLoading(false);
                    onClose?.();
                },
            });
            // If popup opened successfully, keep loading state until callback
            if (response.status === 'success' && response.message === 'Checkout popup opened') {
                // Loading state will be cleared by callback handlers
                return;
            }
            if (response.status === 'success') {
                setIsLoading(false);
                onSuccess?.(response);
            }
            else {
                const errorMessage = response.message || 'Checkout failed';
                setIsLoading(false);
                setError(errorMessage);
                onError?.(errorMessage);
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setIsLoading(false);
            setError(errorMessage);
            onError?.(errorMessage);
        }
    };
    return {
        checkout,
        isLoading,
        error,
    };
}
