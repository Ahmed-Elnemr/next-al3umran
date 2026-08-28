"use client";

import { useState } from "react";
import { postBlogComment } from "../../../../src/lib/serverActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface CommentFormProps {
  locale: string;
  blogId: string;
}

export default function CommentForm({ locale, blogId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    
    try {
      const res = await postBlogComment(locale, blogId, content);
      
      if (res && res.status_code === "1000") {
        setContent("");
        toast.success(locale === 'ar' ? 'تم إضافة التعليق بنجاح!' : 'Comment added successfully!');
        router.refresh();
      } else {
        toast.error(locale === 'ar' ? 'حدث خطأ أثناء إضافة التعليق. يرجى المحاولة مرة أخرى.' : 'An error occurred while adding the comment. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error(locale === 'ar' ? 'حدث خطأ أثناء إضافة التعليق.' : 'An error occurred while adding the comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {locale === 'ar' ? 'أضف تعليقاً' : 'Add a comment'}
      </h3>
      <textarea
        className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        rows={4}
        placeholder={locale === 'ar' ? 'اكتب تعليقك هنا...' : 'Write your comment here...'}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
      />
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting 
            ? (locale === 'ar' ? 'جاري الإرسال...' : 'Submitting...') 
            : (locale === 'ar' ? 'إرسال التعليق' : 'Submit Comment')}
        </button>
      </div>
    </form>
  );
}
