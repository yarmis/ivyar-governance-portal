export default function TargetAudienceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Для ветеранів */}
      <div className="bg-layer-v12/20 border border-layer-v12/30 rounded-xl p-6 hover:shadow-lg hover:shadow-layer-v12/20 transition-all">
        <div className="text-4xl mb-4">🎖️</div>
        <h3 className="text-xl font-bold text-layer-v12 mb-2">Для Ветеранів</h3>
        <p className="text-gray-300 mb-4">Подати заявку на пільги, відстежувати статус</p>
        <p className="text-success-green font-medium mb-4">12,847 отримувачів</p>
        <button className="bg-layer-v12 text-white px-6 py-3 rounded-lg font-medium hover:bg-layer-v12/90 transition">
          Подати заявку →
        </button>
      </div>

      {/* Для держслужбовців */}
      <div className="bg-layer-gov/20 border border-layer-gov/30 rounded-xl p-6 hover:shadow-lg hover:shadow-layer-gov/20 transition-all">
        <div className="text-4xl mb-4">🏛️</div>
        <h3 className="text-xl font-bold text-layer-gov mb-2">Для Держслужбовців</h3>
        <p className="text-gray-300 mb-4">Обробка заявок, AI-аналітика, звіти</p>
        <p className="text-success-green font-medium mb-4">247 активних користувачів</p>
        <button className="bg-layer-gov text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-layer-gov/90 transition">
          Адмін-панель →
        </button>
      </div>

      {/* Для громадськості */}
      <div className="bg-layer-hbs/20 border border-layer-hbs/30 rounded-xl p-6 hover:shadow-lg hover:shadow-layer-hbs/20 transition-all">
        <div className="text-4xl mb-4">👁️</div>
        <h3 className="text-xl font-bold text-layer-hbs mb-2">Громадський Контроль</h3>
        <p className="text-gray-300 mb-4">Прозорість, аудит рішень, зворотний зв'язок</p>
        <p className="text-success-green font-medium mb-4">100% прозорість</p>
        <button className="bg-layer-hbs text-white px-6 py-3 rounded-lg font-medium hover:bg-layer-hbs/90 transition">
          Переглянути дані →
        </button>
      </div>
    </div>
  );
}
