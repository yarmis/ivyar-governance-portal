'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Wheat, Tractor, Users, TrendingUp, Package, MapPin, DollarSign, Calendar, Search, Filter, Download, Send, MessageSquare, FileText, Code, Book, AlertCircle, CheckCircle, XCircle, Clock, Calculator, Shield, X, Globe } from 'lucide-react';

const TRANSLATIONS = {
  en: {
    backToModules: '← BACK TO MODULES',
    title: 'AGRICULTURAL AID MODULE',
    subtitle: 'Food Security & Veteran Farmer Support',
    usLeadership: 'US-LED GLOBAL INITIATIVE',
    status: 'PILOT READY',
    version: 'VERSION',
    apiEndpoints: 'API ENDPOINTS',
    updated: 'UPDATED',
    beneficiaries: 'BENEFICIARIES',
    farmers: 'farmers',
    hectaresCultivated: 'Hectares Cultivated',
    farmersSupported: 'Farmers Supported',
    subsidiesDistributed: 'Subsidies Distributed',
    veteranFarmers: 'Veteran Farmers',
    tabs: {
      demo: 'DEMO',
      calculator: 'CALCULATOR',
      actions: 'ACTIONS',
      content: 'CONTENT',
      api: 'API'
    },
    activeDistributions: 'Active Aid Distributions',
    veteranSubsidies: 'Veteran Farmer Subsidies',
    seedDistribution: 'Seed & Fertilizer Distribution',
    automatedSubsidies: 'Automated Subsidies',
    equipmentRegistry: 'Equipment Registry',
    fraudPrevention: 'Fraud Prevention',
    seedTracking: 'Seed Distribution Tracking',
    blockchainVerified: 'Blockchain-verified agricultural inputs tracking',
    subsidyCalc: 'Subsidy Calculator',
    calculateSubsidy: 'Calculate Subsidy',
    landArea: 'Land Area (hectares)',
    cropType: 'Crop Type',
    veteranStatus: 'Veteran Status',
    veteranBonus: '+25% priority bonus',
    totalSubsidy: 'TOTAL SUBSIDY AMOUNT',
    perHectare: 'per hectare',
    fraudScan: 'AI Fraud Detection Scan',
    fraudCases: 'Fraud Cases Detected',
    farmersScanned: 'Farmers Scanned',
    subsidiesVerified: 'Subsidies Verified',
    accuracyRate: 'Accuracy Rate',
    globalMessage: 'Built in America • Proven in Ukraine • Ready for the World',
    usaidLed: 'US-led agricultural aid infrastructure with World Bank, NATO, and international partners',
    keyFeatures: 'Key Features',
    clickToView: 'Click to view tracking →',
    clickToCalculate: 'Click to calculate →',
    clickToRegistry: 'Click to view registry →',
    clickToScan: 'Click to run scan →'
  },
  uk: {
    backToModules: '← НАЗАД ДО МОДУЛІВ',
    title: 'МОДУЛЬ СІЛЬСЬКОГОСПОДАРСЬКОЇ ДОПОМОГИ',
    subtitle: 'Продовольча безпека та підтримка фермерів-ветеранів',
    usLeadership: 'ГЛОБАЛЬНА ІНІЦІАТИВА ПІД КЕРІВНИЦТВОМ США',
    status: 'ГОТОВО ДО ПІЛОТУ',
    version: 'ВЕРСІЯ',
    apiEndpoints: 'API ТОЧКИ',
    updated: 'ОНОВЛЕНО',
    beneficiaries: 'БЕНЕФІЦІАРИ',
    farmers: 'фермерів',
    hectaresCultivated: 'Гектарів оброблено',
    farmersSupported: 'Фермерів підтримано',
    subsidiesDistributed: 'Субсидій розподілено',
    veteranFarmers: 'Фермерів-ветеранів',
    tabs: {
      demo: 'ДЕМО',
      calculator: 'КАЛЬКУЛЯТОР',
      actions: 'ДІЇ',
      content: 'КОНТЕНТ',
      api: 'API'
    },
    activeDistributions: 'Активні програми допомоги',
    veteranSubsidies: 'Субсидії фермерам-ветеранам',
    seedDistribution: 'Розподіл насіння та добрив',
    automatedSubsidies: 'Автоматичні субсидії',
    equipmentRegistry: 'Реєстр обладнання',
    fraudPrevention: 'Запобігання корупції',
    seedTracking: 'Відстеження розподілу насіння',
    blockchainVerified: 'Блокчейн-верифіковане відстеження сільгоспресурсів',
    subsidyCalc: 'Калькулятор субсидій',
    calculateSubsidy: 'Розрахувати субсидію',
    landArea: 'Площа землі (гектари)',
    cropType: 'Тип культури',
    veteranStatus: 'Статус ветерана',
    veteranBonus: '+25% пріоритетний бонус',
    totalSubsidy: 'ЗАГАЛЬНА СУМА СУБСИДІЇ',
    perHectare: 'за гектар',
    fraudScan: 'AI сканування на корупцію',
    fraudCases: 'Випадків корупції виявлено',
    farmersScanned: 'Фермерів перевірено',
    subsidiesVerified: 'Субсидій верифіковано',
    accuracyRate: 'Точність',
    globalMessage: 'Створено в Америці • Перевірено в Україні • Готово для світу',
    usaidLed: 'Інфраструктура сільгосп допомоги під керівництвом США з Світовим банком, NATO та міжнародними партнерами',
    keyFeatures: 'Ключові функції',
    clickToView: 'Натисніть для перегляду →',
    clickToCalculate: 'Натисніть для розрахунку →',
    clickToRegistry: 'Натисніть для реєстру →',
    clickToScan: 'Натисніть для сканування →'
  },
  es: {
    backToModules: '← VOLVER A MÓDULOS',
    title: 'MÓDULO DE AYUDA AGRÍCOLA',
    subtitle: 'Seguridad alimentaria y apoyo a agricultores veteranos',
    usLeadership: 'INICIATIVA GLOBAL LIDERADA POR EE.UU.',
    status: 'LISTO PARA PILOTO',
    version: 'VERSIÓN',
    apiEndpoints: 'ENDPOINTS API',
    updated: 'ACTUALIZADO',
    beneficiaries: 'BENEFICIARIOS',
    farmers: 'agricultores',
    hectaresCultivated: 'Hectáreas cultivadas',
    farmersSupported: 'Agricultores apoyados',
    subsidiesDistributed: 'Subsidios distribuidos',
    veteranFarmers: 'Agricultores veteranos',
    tabs: {
      demo: 'DEMO',
      calculator: 'CALCULADORA',
      actions: 'ACCIONES',
      content: 'CONTENIDO',
      api: 'API'
    },
    activeDistributions: 'Distribuciones de ayuda activas',
    veteranSubsidies: 'Subsidios para agricultores veteranos',
    seedDistribution: 'Distribución de semillas y fertilizantes',
    automatedSubsidies: 'Subsidios automatizados',
    equipmentRegistry: 'Registro de equipos',
    fraudPrevention: 'Prevención de fraude',
    seedTracking: 'Seguimiento de distribución de semillas',
    blockchainVerified: 'Seguimiento verificado por blockchain de insumos agrícolas',
    subsidyCalc: 'Calculadora de subsidios',
    calculateSubsidy: 'Calcular subsidio',
    landArea: 'Área de tierra (hectáreas)',
    cropType: 'Tipo de cultivo',
    veteranStatus: 'Estado de veterano',
    veteranBonus: '+25% bono prioritario',
    totalSubsidy: 'MONTO TOTAL DEL SUBSIDIO',
    perHectare: 'por hectárea',
    fraudScan: 'Escaneo de fraude con IA',
    fraudCases: 'Casos de fraude detectados',
    farmersScanned: 'Agricultores escaneados',
    subsidiesVerified: 'Subsidios verificados',
    accuracyRate: 'Tasa de precisión',
    globalMessage: 'Construido en América • Probado en Ucrania • Listo para el mundo',
    usaidLed: 'Infraestructura de ayuda agrícola liderada por EE.UU. con Banco Mundial, OTAN y socios internacionales',
    keyFeatures: 'Características clave',
    clickToView: 'Clic para ver seguimiento →',
    clickToCalculate: 'Clic para calcular →',
    clickToRegistry: 'Clic para ver registro →',
    clickToScan: 'Clic para escanear →'
  },
  fr: {
    backToModules: '← RETOUR AUX MODULES',
    title: 'MODULE D\'AIDE AGRICOLE',
    subtitle: 'Sécurité alimentaire et soutien aux agriculteurs vétérans',
    usLeadership: 'INITIATIVE MONDIALE DIRIGÉE PAR LES ÉTATS-UNIS',
    status: 'PRÊT POUR PILOTE',
    version: 'VERSION',
    apiEndpoints: 'POINTS DE TERMINAISON API',
    updated: 'MIS À JOUR',
    beneficiaries: 'BÉNÉFICIAIRES',
    farmers: 'agriculteurs',
    hectaresCultivated: 'Hectares cultivés',
    farmersSupported: 'Agriculteurs soutenus',
    subsidiesDistributed: 'Subventions distribuées',
    veteranFarmers: 'Agriculteurs vétérans',
    tabs: {
      demo: 'DÉMO',
      calculator: 'CALCULATRICE',
      actions: 'ACTIONS',
      content: 'CONTENU',
      api: 'API'
    },
    activeDistributions: 'Distributions d\'aide actives',
    veteranSubsidies: 'Subventions pour agriculteurs vétérans',
    seedDistribution: 'Distribution de semences et d\'engrais',
    automatedSubsidies: 'Subventions automatisées',
    equipmentRegistry: 'Registre d\'équipement',
    fraudPrevention: 'Prévention de la fraude',
    seedTracking: 'Suivi de distribution de semences',
    blockchainVerified: 'Suivi vérifié par blockchain des intrants agricoles',
    subsidyCalc: 'Calculatrice de subventions',
    calculateSubsidy: 'Calculer la subvention',
    landArea: 'Surface de terre (hectares)',
    cropType: 'Type de culture',
    veteranStatus: 'Statut de vétéran',
    veteranBonus: '+25% bonus prioritaire',
    totalSubsidy: 'MONTANT TOTAL DE LA SUBVENTION',
    perHectare: 'par hectare',
    fraudScan: 'Analyse de fraude par IA',
    fraudCases: 'Cas de fraude détectés',
    farmersScanned: 'Agriculteurs analysés',
    subsidiesVerified: 'Subventions vérifiées',
    accuracyRate: 'Taux de précision',
    globalMessage: 'Construit en Amérique • Prouvé en Ukraine • Prêt pour le monde',
    usaidLed: 'Infrastructure d\'aide agricole dirigée par les États-Unis avec la Banque mondiale, l\'OTAN et des partenaires internationaux',
    keyFeatures: 'Caractéristiques clés',
    clickToView: 'Cliquez pour voir le suivi →',
    clickToCalculate: 'Cliquez pour calculer →',
    clickToRegistry: 'Cliquez pour voir le registre →',
    clickToScan: 'Cliquez pour analyser →'
  },
  ar: {
    backToModules: '→ العودة إلى الوحدات',
    title: 'وحدة المساعدة الزراعية',
    subtitle: 'الأمن الغذائي ودعم المزارعين المحاربين القدامى',
    usLeadership: 'مبادرة عالمية بقيادة الولايات المتحدة',
    status: 'جاهز للتجريب',
    version: 'الإصدار',
    apiEndpoints: 'نقاط API',
    updated: 'محدث',
    beneficiaries: 'المستفيدون',
    farmers: 'مزارعون',
    hectaresCultivated: 'الهكتارات المزروعة',
    farmersSupported: 'المزارعون المدعومون',
    subsidiesDistributed: 'الإعانات الموزعة',
    veteranFarmers: 'المزارعون المحاربون القدامى',
    tabs: {
      demo: 'عرض توضيحي',
      calculator: 'حاسبة',
      actions: 'إجراءات',
      content: 'المحتوى',
      api: 'API'
    },
    activeDistributions: 'توزيعات المساعدة النشطة',
    veteranSubsidies: 'إعانات للمزارعين المحاربين القدامى',
    seedDistribution: 'توزيع البذور والأسمدة',
    automatedSubsidies: 'إعانات تلقائية',
    equipmentRegistry: 'سجل المعدات',
    fraudPrevention: 'منع الاحتيال',
    seedTracking: 'تتبع توزيع البذور',
    blockchainVerified: 'تتبع المدخلات الزراعية المصادق عليها بالبلوكشين',
    subsidyCalc: 'حاسبة الإعانات',
    calculateSubsidy: 'حساب الإعانة',
    landArea: 'مساحة الأرض (هكتار)',
    cropType: 'نوع المحصول',
    veteranStatus: 'حالة المحارب القديم',
    veteranBonus: '+25% مكافأة أولوية',
    totalSubsidy: 'إجمالي مبلغ الإعانة',
    perHectare: 'لكل هكتار',
    fraudScan: 'مسح الاحتيال بالذكاء الاصطناعي',
    fraudCases: 'حالات الاحتيال المكتشفة',
    farmersScanned: 'المزارعون الممسوحون',
    subsidiesVerified: 'الإعانات المصادق عليها',
    accuracyRate: 'معدل الدقة',
    globalMessage: 'بني في أمريكا • أثبت في أوكرانيا • جاهز للعالم',
    usaidLed: 'بنية تحتية للمساعدة الزراعية بقيادة الولايات المتحدة مع البنك الدولي والناتو والشركاء الدوليين',
    keyFeatures: 'الميزات الرئيسية',
    clickToView: 'انقر لعرض التتبع ←',
    clickToCalculate: 'انقر للحساب ←',
    clickToRegistry: 'انقر لعرض السجل ←',
    clickToScan: 'انقر للمسح ←'
  }
};

export default function AgricultureModulePage() {
  const [lang, setLang] = useState<'en' | 'uk' | 'es' | 'fr' | 'ar'>('en');
  const t = TRANSLATIONS[lang];
  
  const [activeTab, setActiveTab] = useState('demo');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I can help you with agricultural aid queries.' }
  ]);

  const [showSeedModal, setShowSeedModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showFraudModal, setShowFraudModal] = useState(false);

  const [calcHectares, setCalcHectares] = useState('');
  const [calcCrop, setCalcCrop] = useState('wheat');
  const [calcVeteran, setCalcVeteran] = useState(false);
  const [calcResult, setCalcResult] = useState<any>(null);

  const distributions = [
    {
      id: 'AG-001',
      type: 'Seeds & Fertilizer',
      beneficiaries: 450,
      region: 'Kharkiv Oblast',
      value: '$2.1M',
      status: 'active',
      completion: '65%',
      items: ['Winter wheat seeds (120 tons)', 'NPK fertilizer (85 tons)']
    },
    {
      id: 'AG-002',
      type: 'Farm Equipment',
      beneficiaries: 120,
      region: 'Mykolaiv Oblast',
      value: '$3.8M',
      status: 'in-transit',
      completion: '30%',
      items: ['Tractors (15 units)', 'Harvesters (8 units)']
    }
  ];

  const veteranFarmers = [
    { 
      id: 'VF-001',
      name: 'Veteran Cooperative #12', 
      land: '450 hectares', 
      crop: 'Wheat', 
      subsidy: '$125,000', 
      status: 'approved'
    }
  ];

  const equipmentRegistry = [
    { id: 'EQ-001', type: 'Tractor', model: 'John Deere 8345R', serial: 'JD-2025-4582', cooperative: 'Veteran Coop #12', status: 'active', location: 'Kharkiv Oblast', gps: '49.9935°N, 36.2304°E' }
  ];

  const seedShipments = [
    { id: 'SEED-001', type: 'Winter Wheat', quantity: '120 tons', origin: 'USAID Warehouse, Poland', destination: 'Kharkiv Oblast', status: 'delivered', blockchain: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' }
  ];

  const handleFormSubmit = (formType: string) => {
    setSuccessMessage(`✓ ${formType} submitted successfully`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const calculateSubsidy = () => {
    const hectares = parseFloat(calcHectares);
    if (!hectares || hectares <= 0) {
      alert('Please enter valid hectares');
      return;
    }

    const cropRates: any = { wheat: 285, sunflower: 310, corn: 295, barley: 265 };
    const baseRate = cropRates[calcCrop] || 285;
    const veteranBonus = calcVeteran ? 1.25 : 1.0;
    const baseSubsidy = hectares * baseRate;
    const veteranBonusAmount = calcVeteran ? baseSubsidy * 0.25 : 0;
    const totalSubsidy = baseSubsidy * veteranBonus;

    setCalcResult({
      hectares,
      crop: calcCrop,
      baseRate,
      baseSubsidy,
      veteranBonus: calcVeteran,
      veteranBonusAmount,
      totalSubsidy,
      perHectare: totalSubsidy / hectares
    });

    setSuccessMessage('✓ Subsidy calculation complete!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isRTL = lang === 'ar';

  return (
    <div className={`min-h-screen bg-[#0D1117] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Success Message */}
      {showSuccess && (
        <div className={`fixed top-4 ${isRTL ? 'left-4' : 'right-4'} z-50 bg-green-900/90 border border-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3`}>
          <CheckCircle className="w-6 h-6 text-green-400" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Language Selector */}
      <div className="fixed top-4 left-4 z-40 flex items-center gap-2 bg-[#161B22] border border-[#1F242C] rounded-lg p-2">
        <Globe className="w-5 h-5 text-[#8B949E]" />
        {(['en', 'uk', 'es', 'fr', 'ar'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1 rounded text-sm font-semibold transition ${
              lang === l ? 'bg-[#3CCB7F] text-black' : 'text-[#8B949E] hover:text-white'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* SEED MODAL */}
      {showSeedModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setShowSeedModal(false)}>
          <div className="bg-[#161B22] border border-[#1F242C] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[#1F242C] flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Wheat className="w-8 h-8 text-emerald-500" />
                {t.seedTracking}
              </h2>
              <button onClick={() => setShowSeedModal(false)} className="text-[#8B949E] hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {seedShipments.map((shipment) => (
                <div key={shipment.id} className="bg-[#0D1117] border border-[#1F242C] p-5 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-semibold text-lg">{shipment.type}</div>
                      <div className="text-sm text-[#8B949E]">ID: {shipment.id} • {shipment.quantity}</div>
                    </div>
                    <div className="text-xs px-3 py-1 rounded bg-green-900/30 text-green-400">
                      {shipment.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-800/30 rounded p-3">
                    <div className="text-xs text-[#8B949E] mb-1">BLOCKCHAIN:</div>
                    <code className="text-xs text-blue-400 break-all">{shipment.blockchain}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EQUIPMENT MODAL */}
      {showEquipmentModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setShowEquipmentModal(false)}>
          <div className="bg-[#161B22] border border-[#1F242C] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[#1F242C] flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Tractor className="w-8 h-8 text-purple-500" />
                {t.equipmentRegistry}
              </h2>
              <button onClick={() => setShowEquipmentModal(false)} className="text-[#8B949E] hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {equipmentRegistry.map((equipment) => (
                <div key={equipment.id} className="bg-[#0D1117] border border-[#1F242C] p-5 rounded-lg">
                  <div className="font-semibold text-lg mb-2">{equipment.type} - {equipment.model}</div>
                  <div className="text-sm text-[#8B949E]">GPS: {equipment.gps}</div>
                  <div className="text-sm text-purple-400 mt-2">IoT tracking active</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FRAUD MODAL */}
      {showFraudModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={() => setShowFraudModal(false)}>
          <div className="bg-[#161B22] border border-[#1F242C] rounded-lg max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[#1F242C] flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Shield className="w-8 h-8 text-emerald-500" />
                {t.fraudScan}
              </h2>
              <button onClick={() => setShowFraudModal(false)} className="text-[#8B949E] hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="text-7xl font-bold text-emerald-400 mb-2">0</div>
                <div className="text-xl text-[#8B949E]">{t.fraudCases}</div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-400">2,847</div>
                  <div className="text-sm text-[#8B949E]">{t.farmersScanned}</div>
                </div>
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-400">$8.9M</div>
                  <div className="text-sm text-[#8B949E]">{t.subsidiesVerified}</div>
                </div>
                <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-400">100%</div>
                  <div className="text-sm text-[#8B949E]">{t.accuracyRate}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="border-b border-[#1F242C] bg-[#161B22]">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <Link href="/" className="text-[#8B949E] hover:text-white flex items-center gap-2">
            {t.backToModules}
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="border-b border-[#1F242C] bg-[#161B22]">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="bg-gradient-to-r from-blue-900/20 to-red-900/20 border border-blue-800/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <div className="text-3xl">🇺🇸</div>
              <div>
                <div className="font-semibold text-blue-400">{t.usLeadership}</div>
                <div className="text-[#8B949E] text-xs mt-1">{t.usaidLed}</div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-6 mb-8">
            <div className="text-6xl">🌾</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
              <p className="text-lg text-[#8B949E]">{t.subtitle}</p>
              <div className="text-sm text-blue-400 mt-2">{t.globalMessage}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div>
              <div className="text-xs text-[#8B949E] mb-1">{t.status.split(' ')[0]}</div>
              <div className="text-sm font-medium text-[#3CCB7F]">✓ {t.status.split(' ').slice(1).join(' ')}</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">{t.version}</div>
              <div className="text-sm font-medium">1.2</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">{t.apiEndpoints}</div>
              <div className="text-sm font-medium">20</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">{t.updated}</div>
              <div className="text-sm font-medium">2026-01-23</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">{t.beneficiaries}</div>
              <div className="text-sm font-medium">2,847 {t.farmers}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-[#0D1117] border border-[#1F242C] p-6 rounded-lg">
              <Wheat className="w-8 h-8 text-emerald-500 mb-4" />
              <div className="text-3xl font-bold mb-1">12,450</div>
              <div className="text-sm text-[#8B949E]">{t.hectaresCultivated}</div>
            </div>
            <div className="bg-[#0D1117] border border-[#1F242C] p-6 rounded-lg">
              <Users className="w-8 h-8 text-blue-500 mb-4" />
              <div className="text-3xl font-bold mb-1">2,847</div>
              <div className="text-sm text-[#8B949E]">{t.farmersSupported}</div>
            </div>
            <div className="bg-[#0D1117] border border-[#1F242C] p-6 rounded-lg">
              <DollarSign className="w-8 h-8 text-amber-500 mb-4" />
              <div className="text-3xl font-bold mb-1">$8.9M</div>
              <div className="text-sm text-[#8B949E]">{t.subsidiesDistributed}</div>
            </div>
            <div className="bg-[#0D1117] border border-[#1F242C] p-6 rounded-lg">
              <Tractor className="w-8 h-8 text-purple-500 mb-4" />
              <div className="text-3xl font-bold mb-1">340</div>
              <div className="text-sm text-[#8B949E]">{t.veteranFarmers}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#1F242C] bg-[#161B22]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex gap-8">
            {(['demo', 'calculator', 'actions', 'content', 'api'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 transition ${
                  activeTab === tab
                    ? 'border-[#3CCB7F] text-white'
                    : 'border-transparent text-[#8B949E] hover:text-white'
                }`}
              >
                {t.tabs[tab]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        
        {activeTab === 'demo' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">{t.activeDistributions}</h2>
            <div className="space-y-4">
              {distributions.map((dist) => (
                <div key={dist.id} className="bg-[#161B22] border border-[#1F242C] p-6 rounded-lg">
                  <div className="flex justify-between mb-4">
                    <div>
                      <div className="font-semibold text-lg">{dist.type}</div>
                      <div className="text-sm text-[#8B949E]">{dist.region}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl">{dist.value}</div>
                    </div>
                  </div>
                  <div className="w-full bg-[#1F242C] rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: dist.completion }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 border border-emerald-800/30 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6">{t.subsidyCalc}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">{t.landArea}</label>
                  <input
                    type="number"
                    value={calcHectares}
                    onChange={(e) => setCalcHectares(e.target.value)}
                    placeholder="450"
                    className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">{t.cropType}</label>
                  <select
                    value={calcCrop}
                    onChange={(e) => setCalcCrop(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="wheat">Wheat ($285/ha)</option>
                    <option value="sunflower">Sunflower ($310/ha)</option>
                    <option value="corn">Corn ($295/ha)</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
                  <input
                    type="checkbox"
                    id="vet"
                    checked={calcVeteran}
                    onChange={(e) => setCalcVeteran(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <label htmlFor="vet" className="text-sm">
                    <span className="font-semibold">{t.veteranStatus}</span>
                    <div className="text-xs text-blue-400">{t.veteranBonus}</div>
                  </label>
                </div>
                <button
                  onClick={calculateSubsidy}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-4 rounded-lg transition"
                >
                  {t.calculateSubsidy}
                </button>
              </div>
              <div>
                {calcResult && (
                  <div className="bg-[#0D1117] border border-emerald-800/30 rounded-lg p-6">
                    <div className="text-center mb-4">
                      <div className="text-sm text-[#8B949E] mb-2">{t.totalSubsidy}</div>
                      <div className="text-5xl font-bold text-emerald-400">
                        ${calcResult.totalSubsidy.toLocaleString()}
                      </div>
                      <div className="text-sm text-[#8B949E] mt-2">
                        ${calcResult.perHectare.toFixed(2)} {t.perHectare}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">{t.keyFeatures}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowSeedModal(true)}
                className="bg-[#161B22] border border-[#1F242C] hover:border-emerald-500 p-5 rounded-lg text-left transition"
              >
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Wheat className="w-5 h-5 text-emerald-500" />
                  {t.seedDistribution}
                </h3>
                <p className="text-sm text-[#8B949E]">{t.blockchainVerified}</p>
                <div className="text-xs text-emerald-400 mt-2">{t.clickToView}</div>
              </button>

              <button
                onClick={() => setActiveTab('calculator')}
                className="bg-[#161B22] border border-[#1F242C] hover:border-amber-500 p-5 rounded-lg text-left transition"
              >
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-500" />
                  {t.automatedSubsidies}
                </h3>
                <p className="text-sm text-[#8B949E]">Real-time calculations</p>
                <div className="text-xs text-amber-400 mt-2">{t.clickToCalculate}</div>
              </button>

              <button
                onClick={() => setShowEquipmentModal(true)}
                className="bg-[#161B22] border border-[#1F242C] hover:border-purple-500 p-5 rounded-lg text-left transition"
              >
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Tractor className="w-5 h-5 text-purple-500" />
                  {t.equipmentRegistry}
                </h3>
                <p className="text-sm text-[#8B949E]">IoT tracking</p>
                <div className="text-xs text-purple-400 mt-2">{t.clickToRegistry}</div>
              </button>

              <button
                onClick={() => setShowFraudModal(true)}
                className="bg-[#161B22] border border-[#1F242C] hover:border-red-500 p-5 rounded-lg text-left transition"
              >
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  {t.fraudPrevention}
                </h3>
                <p className="text-sm text-[#8B949E]">Zero fraud detected</p>
                <div className="text-xs text-red-400 mt-2">{t.clickToScan}</div>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">{t.apiEndpoints} (20)</h2>
            <div className="bg-[#161B22] border border-[#1F242C] rounded-lg p-6">
              <div className="text-[#8B949E]">API documentation available</div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#161B22] border border-[#1F242C] p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Register Farmer</h3>
              <button onClick={() => handleFormSubmit('Registration')} className="w-full bg-[#3CCB7F] text-black font-semibold py-2 rounded">
                Submit
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
