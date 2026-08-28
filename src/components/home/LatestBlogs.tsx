import React from 'react';
import Link from 'next/link';
import BlogCard from '../shared/BlogCard';

export default function LatestBlogs({ posts, t, locale }: { posts: any[]; t: any; locale: string }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-16 bg-white" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.has('title') ? t('title') : 'المدونة'}</h2>
            <p className="text-gray-600">
              {t.has('subtitle') ? t('subtitle') : 'اكتشف أحدث المقالات والنصائح'}
            </p>
          </div>
          <Link
            href={`/${locale}/blogs`}
            className="hidden md:inline-flex items-center justify-center px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors font-medium"
          >
            {t.has('viewAll') ? t('viewAll') : (locale === 'ar' ? 'عرض الكل' : 'View All')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} t={t} locale={locale} />
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link
            href={`/${locale}/blogs`}
            className="inline-flex items-center justify-center px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors font-medium w-full"
          >
            {t.has('viewAll') ? t('viewAll') : (locale === 'ar' ? 'عرض الكل' : 'View All')}
          </Link>
        </div>
      </div>
    </section>
  );
}
