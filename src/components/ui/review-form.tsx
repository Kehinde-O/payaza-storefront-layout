'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { StoreConfig } from '@/lib/store-types';

interface ReviewFormProps {
  storeConfig: StoreConfig;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function ReviewForm({ storeConfig, onClose, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onSubmit({ rating, title, review });
      setIsSubmitting(false);
    }, 1500);
  };

  const primaryColor = storeConfig.branding.primaryColor;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-scale-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-colors",
                      (hoverRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-bold text-gray-700">Review Title</label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summary of your experience"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-black focus:ring-0 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="review" className="text-sm font-bold text-gray-700">Review</label>
            <textarea
              id="review"
              required
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us what you liked or didn't like"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-black focus:ring-0 outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 rounded-xl">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || rating === 0}
              className="flex-1 h-12 rounded-xl font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

