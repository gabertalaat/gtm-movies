export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto animate-pulse">

        {/* زرار الرجوع Skeleton */}
        <div className="h-6 w-32 bg-gray-800 rounded mb-8"></div>

        {/* صورة + تفاصيل الممثل Skeleton */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* صورة الممثل */}
          <div className="bg-gray-800 rounded-lg w-full h-[500px]"></div>

          {/* التفاصيل */}
          <div className="md:col-span-2 space-y-4">
            <div className="h-12 w-3/4 bg-gray-800 rounded"></div> {/* الاسم */}
            <div className="h-6 w-1/2 bg-gray-800 rounded"></div> {/* تاريخ الميلاد */}
            <div className="h-8 w-1/4 bg-gray-800 rounded mt-6"></div> {/* كلمة نبذة */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>

        {/* عنوان الأفلام Skeleton */}
        <div className="h-10 w-64 bg-gray-800 rounded mb-6"></div>

        {/* شبكة الأفلام Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="w-full h-[300px] bg-gray-700"></div> {/* بوستر */}
              <div className="p-4 space-y-2">
                <div className="h-5 bg-gray-700 rounded"></div> {/* اسم الفيلم */}
                <div className="h-4 w-3/4 bg-gray-700 rounded"></div> {/* الشخصية */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}