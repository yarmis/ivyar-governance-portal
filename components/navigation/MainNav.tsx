'use client';

export default function MainNav() {
  return (
    <nav className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-layer-v12">IVYAR</div>
            <div className="hidden md:block text-sm text-gray-400">
              Governance Platform
            </div>
          </div>

          {/* Основне меню - ПРОСТЕ! */}
          <div className="flex items-center gap-8">
            <a href="/dashboard" className="text-gray-300 hover:text-white transition">
              🏠 Головна
            </a>
            <a href="/my-cases" className="text-gray-300 hover:text-white transition">
              📋 Мої справи
            </a>
            <a href="/new-application" className="bg-layer-v12 text-white px-6 py-2 rounded-lg hover:bg-layer-v12/90 transition font-medium">
              ➕ Нова заявка
            </a>
          </div>

          {/* Профіль */}
          <div className="flex items-center gap-4">
            <button className="text-gray-300 hover:text-white">
              🔔 <span className="text-xs bg-error-red rounded-full px-1.5">3</span>
            </button>
            <button className="flex items-center gap-2 text-gray-300 hover:text-white">
              👤 Іван П.
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
