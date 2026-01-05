'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
export function ReviewForm({ storeConfig, onClose, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [title, setTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0)
            return;
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            onSubmit({ rating, title, review });
            setIsSubmitting(false);
        }, 1500);
    };
    const primaryColor = storeConfig.branding.primaryColor;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-scale-in", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b border-gray-100", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Write a Review" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-900 transition-colors", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-bold text-gray-700", children: "Rating" }), _jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4, 5].map((star) => (_jsx("button", { type: "button", onClick: () => setRating(star), onMouseEnter: () => setHoverRating(star), onMouseLeave: () => setHoverRating(0), className: "focus:outline-none transition-transform hover:scale-110", children: _jsx(Star, { className: cn("w-8 h-8 transition-colors", (hoverRating || rating) >= star
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300") }) }, star))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "title", className: "text-sm font-bold text-gray-700", children: "Review Title" }), _jsx("input", { id: "title", type: "text", required: true, value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Summary of your experience", className: "w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-black focus:ring-0 outline-none transition-all" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "review", className: "text-sm font-bold text-gray-700", children: "Review" }), _jsx("textarea", { id: "review", required: true, rows: 4, value: review, onChange: (e) => setReview(e.target.value), placeholder: "Tell us what you liked or didn't like", className: "w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-black focus:ring-0 outline-none transition-all resize-none" })] }), _jsxs("div", { className: "pt-2 flex gap-3", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onClose, className: "flex-1 h-12 rounded-xl", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: isSubmitting || rating === 0, className: "flex-1 h-12 rounded-xl font-bold", style: { backgroundColor: primaryColor }, children: isSubmitting ? 'Submitting...' : 'Submit Review' })] })] })] }) }));
}
