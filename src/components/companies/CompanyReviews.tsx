"use client";

import { useState } from "react";
import { Star, MessageCircle, Send } from "lucide-react";

type Review = {
  id: number;
  author: string;
  rating: number;
  commentAr: string;
  commentEn: string;
  date: string;
};

const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: "أحمد بن محمد",
    rating: 5,
    commentAr: "شركة ممتازة وتعاملهم احترافي جداً، ساعدوني في العثور على العقار المناسب في وقت قياسي.",
    commentEn: "Excellent company with very professional service. They helped me find the right property in record time.",
    date: "2024-03-15",
  },
  {
    id: 2,
    author: "سارة عبدالله",
    rating: 4,
    commentAr: "تجربة جيدة بشكل عام، الموظفين متعاونين والأسعار كانت منطقية.",
    commentEn: "Good overall experience, the staff were cooperative and the prices were reasonable.",
    date: "2024-02-28",
  },
  {
    id: 3,
    author: "John Smith",
    rating: 5,
    commentAr: "خدمة عملاء رائعة وشفافية عالية في التعامل المادي. أنصح بالتعامل معهم.",
    commentEn: "Great customer service and high transparency in financial dealings. Highly recommended.",
    date: "2024-01-10",
  }
];

type Props = {
  isAr: boolean;
};

export default function CompanyReviews({ isAr }: Props) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0 || !newComment.trim() || !name.trim()) return;

    const newReview: Review = {
      id: Date.now(),
      author: name,
      rating: newRating,
      commentAr: newComment,
      commentEn: newComment,
      date: new Date().toISOString().split('T')[0],
    };

    setReviews([newReview, ...reviews]);
    setNewRating(0);
    setNewComment("");
    setName("");
  };

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="mt-12 rounded-[32px] bg-white p-8 shadow-[0_20px_70px_rgba(16,24,32,0.06)] border border-[#E2ECE8]">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF9E6] text-[#C89B3C]">
          <Star size={24} className="fill-[#C89B3C]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#101820]">
            {isAr ? "تقييمات العملاء" : "Customer Reviews"}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-0.5 text-[#C89B3C]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(averageRating) ? "fill-[#C89B3C]" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-500">
              ({averageRating.toFixed(1)} / 5.0) - {reviews.length} {isAr ? "تقييمات" : "Reviews"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-12 md:grid-cols-[1fr_350px]">
        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#101820]">{review.author}</span>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
              <div className="flex items-center gap-1 mb-3 text-[#C89B3C]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < review.rating ? "fill-[#C89B3C]" : "text-gray-200"}
                  />
                ))}
              </div>
              <p className="text-sm leading-6 text-gray-600">
                {isAr ? review.commentAr : review.commentEn}
              </p>
            </div>
          ))}
        </div>

        {/* Add Review Form */}
        <div className="bg-[#F7FAF8] rounded-[24px] p-6 border border-[#E2ECE8] h-fit">
          <h3 className="text-lg font-black text-[#101820] mb-4">
            {isAr ? "أضف تقييمك" : "Write a Review"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">
                {isAr ? "التقييم العام" : "Overall Rating"}
              </label>
              <div className="flex items-center gap-1 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    onClick={() => setNewRating(star)}
                    className={
                      star <= newRating
                        ? "fill-[#C89B3C] text-[#C89B3C] transition-all hover:scale-110"
                        : "text-gray-300 transition-all hover:scale-110 hover:text-[#C89B3C]"
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder={isAr ? "اسمك الكامل" : "Your Full Name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-[#E2ECE8] bg-white text-sm focus:border-[#0E6B58] focus:outline-none"
                required
              />
            </div>

            <div>
              <textarea
                placeholder={isAr ? "شاركنا تجربتك مع هذه الشركة..." : "Share your experience..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full h-24 p-4 rounded-xl border border-[#E2ECE8] bg-white text-sm focus:border-[#0E6B58] focus:outline-none resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={newRating === 0 || !newComment.trim() || !name.trim()}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#101820] text-white font-bold transition hover:bg-[#0E6B58] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isAr ? "إرسال التقييم" : "Submit Review"}</span>
              <Send size={16} className={isAr ? "rotate-180" : ""} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
