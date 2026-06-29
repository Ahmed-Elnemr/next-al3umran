import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-xl">Page Not Found / الصفحة غير موجودة</h2>
      <p className="text-gray-500">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-[#0E6B58] px-4 py-2 text-white hover:bg-[#0B5445] transition"
      >
        Back to Home / العودة للرئيسية
      </Link>
    </div>
  );
}
