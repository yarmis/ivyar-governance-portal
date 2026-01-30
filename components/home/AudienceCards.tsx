export default function AudienceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Для Ветеранів */}
      <div className="
        bg-layer-v12/10 
        border border-layer-v12/30 
        rounded-xl 
        p-8 
        hover:bg-layer-v12/20 
        hover:shadow-xl 
        hover:shadow-layer-v12/30 
        transition-all duration-300 
        transform hover:-translate-y-2
      ">
        <div className="text-6xl mb-6 opacity-90">🎖️</div>
        <h3 className="text-2xl font-bold text-layer-v12 mb-3">
          Для Ветеранів
        </h3>
        <p className="text-gray-300 mb-4 text-lg">
          Подати заявку на пільги, відстежувати статус, отримати підтримку
        </p>
        <p className="text-success-green font-semibold text-xl mb-6">
          12,847 отримувачів
        </p>
        <button className="
          bg-layer-v12 
          text-white 
          px-8 py-4 
          rounded-lg 
          font-medium 
          text-lg 
          hover:bg-layer-v12/90 
          transition-colors duration-200
          w-full md:w-auto
        ">
          Подати заявку →
        </button>
      </div>

      {/* Для Держслужбовців */}
      <div className="
        bg-layer-gov/10 
        border border-layer-gov/30 
        rounded-xl 
        p-8 
        hover:bg-layer-gov/20 
        hover:shadow-xl 
        hover:shadow-layer-gov/30 
        transition-all duration-300 
        transform hover:-translate-y-2
      ">
        <div className="text-6xl mb-6 opacity-90">🏛️</div>
        <h3 className="text-2xl font-bold text-layer-gov mb-3">
          Для Держслужбовців
        </h3>
        <p className="text-gray-300 mb-4 text-lg">
          Обробка заявок, AI-аналітика, прозорі звіти
        </p>
        <p className="text-success-green font-semibold text-xl mb-6">
          247 активних користувачів
        </p>
        <button className="
          bg-layer-gov 
          text-gray-900 
          px-8 py-4 
          rounded-lg 
          font-medium 
          text-lg 
          hover:bg-layer-gov/90 
          transition-colors duration-200
          w-full md:w-auto
        ">
          Адмін-панель →
        </button>
      </div>

      {/* Для Громадськості */}
      <div className="
        bg-layer-hbs/10 
        border border-layer-hbs/30 
        rounded-xl 
        p-8 
        hover:bg-layer-hbs/20 
        hover:shadow-xl 
        hover:shadow-layer-hbs/30 
        transition-all duration-300 
        transform hover:-translate-y-2
      ">
        <div className="text-6xl mb-6 opacity-90">👁️</div>
        <h3 className="text-2xl font-bold text-layer-hbs mb-3">
          Громадський Контроль
        </h3>
        <p className="text-gray-300 mb-4 text-lg">
          Прозорість, аудит рішень, зворотний зв'язок
        </p>
        <p className="text-success-green font-semibold text-xl mb-6">
          100% прозорість
        </p>
        <button className="
          bg-layer-hbs 
          text-white 
          px-8 py-4 
          rounded-lg 
          font-medium 
          text-lg 
          hover:bg-layer-hbs/90 
          transition-colors duration-200
          w-full md:w-auto
        ">
          Переглянути дані →
        </button>
      </div>
    </div>
  );
}
