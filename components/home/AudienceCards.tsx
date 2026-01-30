export default function AudienceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Для Ветеранів - ULTRA PREMIUM */}
      <div className="
        group relative
        bg-gradient-to-br from-layer-v12/10 via-layer-v12/5 to-transparent
        border border-layer-v12/40 rounded-2xl overflow-hidden
        p-8 md:p-10
        hover:border-layer-v12/70 hover:shadow-2xl hover:shadow-layer-v12/30
        transition-all duration-400 ease-out
        transform hover:scale-[1.02] hover:-translate-y-1.5
      ">
        {/* Фоновий градієнт, що з'являється при hover */}
        <div className="
          absolute inset-0 bg-layer-v12/0 group-hover:bg-layer-v12/10
          transition-opacity duration-500
        " />
        <div className="relative z-10 flex flex-col items-start">
          <div className="
            text-8xl md:text-9xl mb-6 md:mb-8
            opacity-80 group-hover:opacity-100
            transition-opacity duration-400
          ">
            🎖️
          </div>
          <h3 className="
            text-3xl md:text-4xl font-bold
            text-layer-v12 mb-4 md:mb-5
            tracking-tight
          ">
            Для Ветеранів
          </h3>
          <p className="
            text-gray-300 text-lg md:text-xl
            leading-relaxed mb-4 md:mb-6
            max-w-md
          ">
            Подати заявку на пільги, відстежувати статус, отримати підтримку
          </p>
          <div className="
            text-success-green font-semibold text-xl md:text-2xl
            mb-8 md:mb-10
          ">
            12 847 отримувачів
          </div>
          <button className="
            inline-flex items-center gap-3
            bg-layer-v12 text-white
            px-8 py-4 md:px-10 md:py-5
            rounded-xl font-medium text-lg md:text-xl
            shadow-lg shadow-layer-v12/30
            hover:bg-layer-v12/90 hover:shadow-xl hover:shadow-layer-v12/50
            active:scale-95
            transition-all duration-300
            group-hover:translate-x-1
          ">
            Подати заявку
            <span className="text-2xl transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </button>
        </div>
      </div>

      {/* Для Держслужбовців - ULTRA PREMIUM */}
      <div className="
        group relative
        bg-gradient-to-br from-layer-gov/10 via-layer-gov/5 to-transparent
        border border-layer-gov/40 rounded-2xl overflow-hidden
        p-8 md:p-10
        hover:border-layer-gov/70 hover:shadow-2xl hover:shadow-layer-gov/30
        transition-all duration-400 ease-out
        transform hover:scale-[1.02] hover:-translate-y-1.5
      ">
        <div className="
          absolute inset-0 bg-layer-gov/0 group-hover:bg-layer-gov/10
          transition-opacity duration-500
        " />
        <div className="relative z-10 flex flex-col items-start">
          <div className="
            text-8xl md:text-9xl mb-6 md:mb-8
            opacity-80 group-hover:opacity-100
            transition-opacity duration-400
          ">
            🏛️
          </div>
          <h3 className="
            text-3xl md:text-4xl font-bold
            text-layer-gov mb-4 md:mb-5
            tracking-tight
          ">
            Для Держслужбовців
          </h3>
          <p className="
            text-gray-300 text-lg md:text-xl
            leading-relaxed mb-4 md:mb-6
            max-w-md
          ">
            Обробка заявок, AI-аналітика, прозорі звіти
          </p>
          <div className="
            text-success-green font-semibold text-xl md:text-2xl
            mb-8 md:mb-10
          ">
            247 активних користувачів
          </div>
          <button className="
            inline-flex items-center gap-3
            bg-layer-gov text-gray-900
            px-8 py-4 md:px-10 md:py-5
            rounded-xl font-medium text-lg md:text-xl
            shadow-lg shadow-layer-gov/30
            hover:bg-layer-gov/90 hover:shadow-xl hover:shadow-layer-gov/50
            active:scale-95
            transition-all duration-300
            group-hover:translate-x-1
          ">
            Адмін-панель
            <span className="text-2xl transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </button>
        </div>
      </div>

      {/* Для Громадськості - ULTRA PREMIUM */}
      <div className="
        group relative
        bg-gradient-to-br from-layer-hbs/10 via-layer-hbs/5 to-transparent
        border border-layer-hbs/40 rounded-2xl overflow-hidden
        p-8 md:p-10
        hover:border-layer-hbs/70 hover:shadow-2xl hover:shadow-layer-hbs/30
        transition-all duration-400 ease-out
        transform hover:scale-[1.02] hover:-translate-y-1.5
      ">
        <div className="
          absolute inset-0 bg-layer-hbs/0 group-hover:bg-layer-hbs/10
          transition-opacity duration-500
        " />
        <div className="relative z-10 flex flex-col items-start">
          <div className="
            text-8xl md:text-9xl mb-6 md:mb-8
            opacity-80 group-hover:opacity-100
            transition-opacity duration-400
          ">
            👁️
          </div>
          <h3 className="
            text-3xl md:text-4xl font-bold
            text-layer-hbs mb-4 md:mb-5
            tracking-tight
          ">
            Громадський Контроль
          </h3>
          <p className="
            text-gray-300 text-lg md:text-xl
            leading-relaxed mb-4 md:mb-6
            max-w-md
          ">
            Прозорість, аудит рішень, зворотний зв'язок
          </p>
          <div className="
            text-success-green font-semibold text-xl md:text-2xl
            mb-8 md:mb-10
          ">
            100% прозорість
          </div>
          <button className="
            inline-flex items-center gap-3
            bg-layer-hbs text-white
            px-8 py-4 md:px-10 md:py-5
            rounded-xl font-medium text-lg md:text-xl
            shadow-lg shadow-layer-hbs/30
            hover:bg-layer-hbs/90 hover:shadow-xl hover:shadow-layer-hbs/50
            active:scale-95
            transition-all duration-300
            group-hover:translate-x-1
          ">
            Переглянути дані
            <span className="text-2xl transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
