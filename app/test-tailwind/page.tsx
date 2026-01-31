// app/test-tailwind/page.tsx
export default function TestPage() {
  return (
    <div className="min-h-screen bg-red-600 p-10">
      <div className="max-w-4xl mx-auto bg-white text-gray-900 p-12 rounded-2xl border-8 border-yellow-400 shadow-2xl">
        <h1 className="text-5xl font-bold mb-6 text-center">
          TAILWIND ПОВИНЕН ПРАЦЮВАТИ ТУТ!
        </h1>
        <p className="text-2xl text-center text-gray-700">
          Якщо бачиш червоний фон, жовту рамку, великий білий блок — Tailwind працює.
        </p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-ivyar-blue text-white p-6 rounded-lg text-center font-bold">
            IVYAR Blue
          </div>
          <div className="bg-success-green text-white p-6 rounded-lg text-center font-bold">
            Success Green
          </div>
          <div className="bg-warning-yellow text-gray-900 p-6 rounded-lg text-center font-bold">
            Warning Yellow
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-layer-v12 text-white p-6 rounded-lg text-center font-bold">
            Layer v12
          </div>
          <div className="bg-layer-gov text-gray-900 p-6 rounded-lg text-center font-bold">
            Layer Gov
          </div>
          <div className="bg-layer-hbs text-white p-6 rounded-lg text-center font-bold">
            Layer HBS
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-600">
            ✅ Якщо бачиш всі кольори вище - IVYAR colors працюють!
          </p>
        </div>
      </div>
    </div>
  );
}
