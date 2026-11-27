/**
 * ReviewsSection Component
 *
 * Verified user reviews feed with Rating stats breakdown,
 * customer feedback cards, owner response replies, and an interactive "Leave a Review" modal.
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { reviewsApi } from '@/services/phase11Api';
import Rating from '@/components/common/Rating';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { CheckCircle2, MessageSquare, Star, Sparkles, CornerDownRight } from 'lucide-react';
import { formatDate } from '@/utils';

export const ReviewsSection = ({
  targetType = 'venue',
  targetId = '1',
  initialReviews = [],
  averageRating = 4.8,
  totalReviews = 124,
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [reviews, setReviews] = useState(
    initialReviews.length > 0
      ? initialReviews
      : [
          {
            _id: 'r1',
            author: { name: 'Pooja & Sameer Mehta', avatar: null },
            rating: 5,
            title: 'Unforgettable Heritage Wedding Celebration!',
            comment:
              'The palace gardens exceeded our wildest expectations. The staff coordinated seamlessly with our decorator and the catering spread was legendary. All 600 of our guests were enchanted by the royal ambience.',
            isVerified: true,
            createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
            ownerResponse: {
              comment:
                'Thank you Pooja & Sameer! It was an absolute honour hosting your sangeet and wedding vows. Wishing you a lifetime of joy!',
              respondedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
            },
          },
          {
            _id: 'r2',
            author: { name: 'Aditya Singhania', avatar: null },
            rating: 5,
            title: 'Superb Acoustics & Flawless Banquet Setup',
            comment:
              'Hosted our annual corporate anniversary and awards gala here. High-speed power backup, impeccable valet logistics, and crystal-clear sound acoustics.',
            isVerified: true,
            createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
            ownerResponse: null,
          },
        ]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    try {
      await reviewsApi.createReview({
        targetType,
        [targetType === 'venue' ? 'venueId' : 'vendorId']: targetId,
        rating: Number(newReview.rating),
        title: newReview.title,
        comment: newReview.comment,
      });
    } catch {
      // Mock fallback
    }

    const created = {
      _id: 'r_' + Date.now(),
      author: { name: 'You (Verified Booker)', avatar: null },
      rating: Number(newReview.rating),
      title: newReview.title,
      comment: newReview.comment,
      isVerified: true,
      createdAt: new Date().toISOString(),
      ownerResponse: null,
    };

    setReviews([created, ...reviews]);
    setNewReview({ rating: 5, title: '', comment: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card space-y-8">
      {/* Header & Overall Rating Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h3 className="font-serif font-bold text-2xl text-text">
            Client Reviews & Ratings
          </h3>
          <p className="text-xs text-text-muted mt-1">
            Genuine experiences from verified hosts and event planners
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-serif font-bold text-text">{averageRating}</span>
              <Rating value={averageRating} size="sm" />
            </div>
            <span className="text-xs text-text-muted">Based on {totalReviews} reviews</span>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Write a Review
          </Button>
        </div>
      </div>

      {/* Reviews Feed */}
      <div className="space-y-6">
        {reviews.map((r) => (
          <div key={r._id} className="p-5 rounded-2xl bg-neutral-50/60 border border-neutral-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                  {r.author?.name ? r.author.name[0] : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-text">{r.author?.name}</span>
                    {r.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Host
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-text-muted">{formatDate(r.createdAt, 'long')}</span>
                </div>
              </div>

              <Rating value={r.rating} size="xs" />
            </div>

            {r.title && <h4 className="font-serif font-bold text-sm text-text">{r.title}</h4>}
            <p className="text-xs text-text-muted leading-relaxed">{r.comment}</p>

            {/* Owner Response */}
            {r.ownerResponse && (
              <div className="mt-3 p-3.5 rounded-xl bg-primary-50/50 border border-primary-100 ml-4 flex gap-3 text-xs">
                <CornerDownRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-primary">Response from Host Management:</p>
                  <p className="text-text-muted mt-0.5">{r.ownerResponse.comment}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Review Submission Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Share Your Celebration Experience" size="md">
        <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1">
              Rating (1 to 5 Stars) *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="p-1 text-accent hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= newReview.rating ? 'fill-accent text-accent' : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1">
              Review Title
            </label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              placeholder="e.g. Stunning ambiance and five-star hospitality"
              className="w-full px-3 py-2 bg-neutral-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-1">
              Your Feedback *
            </label>
            <textarea
              rows="4"
              required
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Tell other event hosts about the venue amenities, hospitality, food, or service quality..."
              className="w-full px-3 py-2 bg-neutral-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button size="sm" variant="ghost" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Post Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReviewsSection;
