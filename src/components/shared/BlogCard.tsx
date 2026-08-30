import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  id: number
  name: string
  description: string
  content: string
  main_image: string
  meta_title: string
  meta_description: string
  image_alt: string
  created_at: string
}

export default function BlogCard({ post, t, locale }: { post: BlogPost; t: any; locale: string }) {
  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
      {/* صورة المقال */}
      <Link href={`/${locale}/blogs/${post.id}`} className="relative h-56 w-full overflow-hidden block bg-gray-100 group-hover:bg-gray-200 transition-colors">
        {post.main_image && post.main_image.trim() !== "" ? (
          <Image
            src={post.main_image}
            alt={post.image_alt || post.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>

      {/* محتوى المقال */}
      <div className="p-6 flex-1 flex flex-col">
        <Link href={`/${locale}/blogs/${post.id}`} className="block group">
          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary/80 transition-colors line-clamp-2">
            {post.name}
          </h2>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.description}
        </p>

        {/* رابط قراءة المزيد */}
        <Link
          href={`/${locale}/blogs/${post.id}`}
          className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 w-full font-medium"
        >
          {t('readMore')}
        </Link>
      </div>
    </article>
  )
}
