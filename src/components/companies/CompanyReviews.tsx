"use client";

import { useState, useEffect } from "react";
import { Star, MessageCircle, Send } from "lucide-react";
import Link from "next/link";

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
  locale?: string;
};

export default function CompanyReviews({ isAr, locale = "ar" }: Props) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check auth from local storage / cookies
    let foundUser = null;
    const cachedUserStr = localStorage.getItem("alomran_current_user");
    if (cachedUserStr) {
      try {
        foundUser = JSON.parse(cachedUserStr);
      } catch (e) {}
    }

    if (!foundUser) {
      const nameEQ = "userDataInfo=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          const cookieStr = c.substring(nameEQ.length, c.length);
          try {
            foundUser = JSON.parse(decodeURIComponent(cookieStr));
          } catch (e) {}
        }
      }
    }

    if (foundUser) {
      setIsAuthenticated(true);
      setUserName(foundUser.name || foundUser.company_name || (isAr ? "مستخدم" : "User"));
    }
  }, [isAr]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0 || !newComment.trim() || !isAuthenticated) return;

    const newReview: Review = {
      id: Date.now(),
      author: userName,
      rating: newRating,
      commentAr: newComment,
      commentEn: newComment,
      date: new Date().toISOString().split("T")[0],
    };

    setReviews([newReview, ...reviews]);
    setNewRating(0);
    setNewComment("");
  };

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  if (!mounted) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF6F3] text-[#0E6B58]">
          <MessageCircle size={24} />
        </div>
        <h2 className="text-2xl font-black text-[#101820]">
          {isAr ? "تقييمات العملاء" : "Customer Reviews"}
        </h2>
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

        {/* Add Review Form / Login Prompt */}
        <div className="bg-[#F7FAF8] rounded-[24px] p-6 border border-[#E2ECE8] h-fit">
          <h3 className="text-lg font-black text-[#101820] mb-4">
            {isAr ? "أضف تقييمك" : "Write a Review"}
          </h3>
          
          {isAuthenticated ? (
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
                disabled={newRating === 0 || !newComment.trim()}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#101820] text-white font-bold transition hover:bg-[#0E6B58] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isAr ? "إرسال التقييم" : "Submit Review"}</span>
                <Send size={16} className={isAr ? "rotate-180" : ""} />
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                {isAr 
                  ? "يجب عليك تسجيل الدخول أولاً لتتمكن من إضافة تقييم ومشاركة تجربتك مع الآخرين." 
                  : "You must be logged in to write a review and share your experience with others."}
              </p>
              <Link 
                href={`/${locale}/login`}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0E6B58] px-6 text-sm font-bold text-white transition hover:bg-[#095746] w-full"
              >
                {isAr ? "تسجيل الدخول" : "Login to Review"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
