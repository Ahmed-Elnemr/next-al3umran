import { getSingleBlogPost } from "../../../../src/lib/serverActions";
import Image from "next/image";
import CommentForm from "./CommentForm";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function BlogDetailsPage({ params }: PageProps) {
  const { locale, slug } = await params;

  const response = await getSingleBlogPost(locale, slug);
  const blog = response?.data;

  if (!blog) return <div>Not Found</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      
     
      <div className="relative w-full h-80 mb-6 bg-gray-100 rounded-lg overflow-hidden">
        {blog.main_image && blog.main_image.trim() !== "" ? (
          <Image
            src={blog.main_image}
            alt={blog.image_alt || blog.name}
            fill
            className="object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200/50">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
 <h1 className="text-xl font-bold mb-6">
        {blog.name}
      </h1>
      <div
        className="prose max-w-none text-base text-gray-400 mb-12"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* قسم التعليقات */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {locale === 'ar' ? 'التعليقات' : 'Comments'}
        </h2>
        
        <CommentForm locale={locale} blogId={blog.id.toString()} />
        
        {blog.comments && blog.comments.length > 0 ? (
          <div className="space-y-6">
            {blog.comments.map((comment: any) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">{comment.user_name}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-gray-600">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            {locale === 'ar' ? 'لا توجد تعليقات حتى الآن.' : 'No comments yet.'}
          </p>
        )}
      </div>

    </div>
  );
}