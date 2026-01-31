'use client';

import AutopilotWidget from '@/components/AutopilotWidget';


import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================
// TYPES & INTERFACES
// ============================================
type UserRole = 'shipper' | 'driver' | 'carrier' | 'admin';
type FreightView = 
  | 'landing' | 'load-board' | 'load-details' | 'create-load'
  | 'shipper-dashboard' | 'shipper-loads' | 'shipper-payments' | 'shipper-analytics'
  | 'driver-dashboard' | 'driver-loads' | 'driver-earnings' | 'driver-profile'
  | 'tracking' | 'admin' | 'insurance';

type LoadStatus = 'posted' | 'booked' | 'in_transit' | 'at_pickup' | 'picked_up' | 'at_delivery' | 'delivered' | 'completed' | 'cancelled';
type LoadType = 'ftl' | 'ltl' | 'partial' | 'expedited' | 'refrigerated' | 'flatbed' | 'hazmat';
type EquipmentType = 'dry_van' | 'reefer' | 'flatbed' | 'step_deck' | 'lowboy' | 'tanker' | 'hopper' | 'car_hauler';
type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed';

interface Location {
  city: string;
  state: string;
  zip: string;
  address?: string;
  lat?: number;
  lng?: number;
}

interface Load {
  id: string;
  loadNumber: string;
  shipperId: string;
  shipperName: string;
  shipperRating: number;
  driverId?: string;
  driverName?: string;
  carrierId?: string;
  
  origin: Location;
  destination: Location;
  distance: number;
  
  loadType: LoadType;
  equipmentType: EquipmentType;
  weight: number;
  commodity: string;
  specialInstructions?: string;
  
  pickupDate: string;
  pickupTimeWindow: string;
  deliveryDate: string;
  deliveryTimeWindow: string;
  
  // AI Rate Engine
  aiRate: number;
  marketRate: number;
  ratePerMile: number;
  rateBreakdown: {
    baseRate: number;
    fuelSurcharge: number;
    accessorials: number;
    marketAdjustment: number;
  };
  rateConfidence: number;
  rateRationale: string;
  
  status: LoadStatus;
  trackingEnabled: boolean;
  currentLocation?: { lat: number; lng: number; updatedAt: string };
  
  podUploaded: boolean;
  podUrl?: string;
  
  paymentStatus: PaymentStatus;
  paymentMethod: 'instant' | 'standard' | 'factoring';
  
  insuranceCoverage: number;
  insuranceProvider?: string;
  
  createdAt: string;
  updatedAt: string;
}

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  cdlNumber: string;
  cdlState: string;
  cdlExpiry: string;
  
  equipmentType: EquipmentType;
  truckYear: number;
  truckMake: string;
  truckModel: string;
  
  rating: number;
  totalLoads: number;
  onTimeDelivery: number;
  acceptanceRate: number;
  
  currentLocation?: Location;
  available: boolean;
  
  totalEarnings: number;
  pendingPayments: number;
  
  insuranceVerified: boolean;
  backgroundCheckPassed: boolean;
  
  joinedAt: string;
}

interface Shipper {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  
  address: Location;
  
  rating: number;
  totalLoads: number;
  onTimePayment: number;
  
  verified: boolean;
  creditLimit: number;
  
  totalSpent: number;
  
  joinedAt: string;
}

interface Payment {
  id: string;
  loadId: string;
  loadNumber: string;
  driverId: string;
  driverName: string;
  shipperId: string;
  shipperName: string;
  amount: number;
  fee: number;
  netAmount: number;
  method: 'instant' | 'standard' | 'factoring';
  status: PaymentStatus;
  initiatedAt: string;
  completedAt?: string;
}

// ============================================
// MOCK DATA
// ============================================
const EQUIPMENT_TYPES: Record<EquipmentType, { label: string; icon: string }> = {
  dry_van: { label: 'Dry Van', icon: '📦' },
  reefer: { label: 'Refrigerated', icon: '❄️' },
  flatbed: { label: 'Flatbed', icon: '🛻' },
  step_deck: { label: 'Step Deck', icon: '📐' },
  lowboy: { label: 'Lowboy', icon: '⬇️' },
  tanker: { label: 'Tanker', icon: '🛢️' },
  hopper: { label: 'Hopper', icon: '🌾' },
  car_hauler: { label: 'Car Hauler', icon: '🚗' },
};

const LOAD_STATUS_CONFIG: Record<LoadStatus, { label: string; color: string; icon: string }> = {
  posted: { label: 'Posted', color: '#00A3FF', icon: '📋' },
  booked: { label: 'Booked', color: '#A371F7', icon: '✓' },
  in_transit: { label: 'In Transit', color: '#F59E0B', icon: '🚚' },
  at_pickup: { label: 'At Pickup', color: '#F59E0B', icon: '📍' },
  picked_up: { label: 'Picked Up', color: '#F59E0B', icon: '📦' },
  at_delivery: { label: 'At Delivery', color: '#F59E0B', icon: '📍' },
  delivered: { label: 'Delivered', color: '#3CCB7F', icon: '✓' },
  completed: { label: 'Completed', color: '#3CCB7F', icon: '💰' },
  cancelled: { label: 'Cancelled', color: '#F85149', icon: '✗' },
};

const SAMPLE_LOADS: Load[] = [
  {
    id: 'load-001',
    loadNumber: 'DF-2026-00001',
    shipperId: 'ship-001',
    shipperName: 'ABC Manufacturing',
    shipperRating: 4.8,
    origin: { city: 'Los Angeles', state: 'CA', zip: '90001' },
    destination: { city: 'Phoenix', state: 'AZ', zip: '85001' },
    distance: 372,
    loadType: 'ftl',
    equipmentType: 'dry_van',
    weight: 42000,
    commodity: 'Auto Parts',
    pickupDate: '2026-01-07',
    pickupTimeWindow: '08:00 - 12:00',
    deliveryDate: '2026-01-08',
    deliveryTimeWindow: '14:00 - 18:00',
    aiRate: 1860,
    marketRate: 2100,
    ratePerMile: 5.0,
    rateBreakdown: { baseRate: 1500, fuelSurcharge: 260, accessorials: 0, marketAdjustment: 100 },
    rateConfidence: 94,
    rateRationale: 'Rate based on 372mi LA→PHX lane, current fuel $3.89/gal, high demand corridor. Direct rate saves shipper 15% vs broker.',
    status: 'posted',
    trackingEnabled: true,
    podUploaded: false,
    paymentStatus: 'pending',
    paymentMethod: 'instant',
    insuranceCoverage: 100000,
    createdAt: '2026-01-05 10:00:00',
    updatedAt: '2026-01-05 10:00:00',
  },
  {
    id: 'load-002',
    loadNumber: 'DF-2026-00002',
    shipperId: 'ship-002',
    shipperName: 'Fresh Foods Inc',
    shipperRating: 4.9,
    driverId: 'drv-001',
    driverName: 'Mike Johnson',
    origin: { city: 'Fresno', state: 'CA', zip: '93701' },
    destination: { city: 'Seattle', state: 'WA', zip: '98101' },
    distance: 892,
    loadType: 'ftl',
    equipmentType: 'reefer',
    weight: 38000,
    commodity: 'Produce - Temperature Controlled',
    specialInstructions: 'Maintain 34°F. Do not freeze.',
    pickupDate: '2026-01-06',
    pickupTimeWindow: '06:00 - 08:00',
    deliveryDate: '2026-01-07',
    deliveryTimeWindow: '06:00 - 10:00',
    aiRate: 3568,
    marketRate: 4200,
    ratePerMile: 4.0,
    rateBreakdown: { baseRate: 2800, fuelSurcharge: 568, accessorials: 100, marketAdjustment: 100 },
    rateConfidence: 92,
    rateRationale: 'Reefer premium applied. Fresno→Seattle produce lane. Time-sensitive delivery. Direct rate saves 18% vs broker.',
    status: 'in_transit',
    trackingEnabled: true,
    currentLocation: { lat: 40.7608, lng: -122.4194, updatedAt: '2026-01-06 14:30:00' },
    podUploaded: false,
    paymentStatus: 'pending',
    paymentMethod: 'instant',
    insuranceCoverage: 150000,
    insuranceProvider: 'IVYAR Insurance',
    createdAt: '2026-01-04 08:00:00',
    updatedAt: '2026-01-06 14:30:00',
  },
  {
    id: 'load-003',
    loadNumber: 'DF-2026-00003',
    shipperId: 'ship-003',
    shipperName: 'Steel Dynamics',
    shipperRating: 4.7,
    origin: { city: 'Chicago', state: 'IL', zip: '60601' },
    destination: { city: 'Dallas', state: 'TX', zip: '75201' },
    distance: 917,
    loadType: 'ftl',
    equipmentType: 'flatbed',
    weight: 45000,
    commodity: 'Steel Coils',
    specialInstructions: 'Tarps required. Chains and straps provided.',
    pickupDate: '2026-01-08',
    pickupTimeWindow: '10:00 - 14:00',
    deliveryDate: '2026-01-10',
    deliveryTimeWindow: '08:00 - 12:00',
    aiRate: 3210,
    marketRate: 3800,
    ratePerMile: 3.5,
    rateBreakdown: { baseRate: 2600, fuelSurcharge: 410, accessorials: 100, marketAdjustment: 100 },
    rateConfidence: 91,
    rateRationale: 'Flatbed with tarping. CHI→DAL heavy haul corridor. Overweight premium. Direct saves 16%.',
    status: 'posted',
    trackingEnabled: true,
    podUploaded: false,
    paymentStatus: 'pending',
    paymentMethod: 'instant',
    insuranceCoverage: 200000,
    createdAt: '2026-01-05 12:00:00',
    updatedAt: '2026-01-05 12:00:00',
  },
  {
    id: 'load-004',
    loadNumber: 'DF-2025-00892',
    shipperId: 'ship-001',
    shipperName: 'ABC Manufacturing',
    shipperRating: 4.8,
    driverId: 'drv-001',
    driverName: 'Mike Johnson',
    origin: { city: 'Atlanta', state: 'GA', zip: '30301' },
    destination: { city: 'Miami', state: 'FL', zip: '33101' },
    distance: 662,
    loadType: 'ftl',
    equipmentType: 'dry_van',
    weight: 35000,
    commodity: 'Consumer Electronics',
    pickupDate: '2026-01-03',
    pickupTimeWindow: '08:00 - 12:00',
    deliveryDate: '2026-01-04',
    deliveryTimeWindow: '10:00 - 14:00',
    aiRate: 2317,
    marketRate: 2800,
    ratePerMile: 3.5,
    rateBreakdown: { baseRate: 1900, fuelSurcharge: 317, accessorials: 0, marketAdjustment: 100 },
    rateConfidence: 96,
    rateRationale: 'Standard dry van. ATL→MIA high volume lane. Driver saved 18% with direct booking.',
    status: 'completed',
    trackingEnabled: true,
    podUploaded: true,
    podUrl: '/pods/load-004.pdf',
    paymentStatus: 'paid',
    paymentMethod: 'instant',
    insuranceCoverage: 100000,
    createdAt: '2026-01-02 09:00:00',
    updatedAt: '2026-01-04 15:30:00',
  },
];

const SAMPLE_DRIVER: Driver = {
  id: 'drv-001',
  name: 'Mike Johnson',
  email: 'mike@example.com',
  phone: '+1-555-0123',
  avatar: '🚛',
  cdlNumber: 'CDL-123456',
  cdlState: 'CA',
  cdlExpiry: '2027-06-15',
  equipmentType: 'dry_van',
  truckYear: 2022,
  truckMake: 'Freightliner',
  truckModel: 'Cascadia',
  rating: 4.9,
  totalLoads: 234,
  onTimeDelivery: 98.2,
  acceptanceRate: 85,
  currentLocation: { city: 'Redding', state: 'CA', zip: '96001' },
  available: true,
  totalEarnings: 287450,
  pendingPayments: 3568,
  insuranceVerified: true,
  backgroundCheckPassed: true,
  joinedAt: '2024-03-15',
};

const SAMPLE_SHIPPER: Shipper = {
  id: 'ship-001',
  companyName: 'ABC Manufacturing',
  contactName: 'Sarah Williams',
  email: 'sarah@abcmfg.com',
  phone: '+1-555-0456',
  address: { city: 'Los Angeles', state: 'CA', zip: '90001' },
  rating: 4.8,
  totalLoads: 456,
  onTimePayment: 99.5,
  verified: true,
  creditLimit: 100000,
  totalSpent: 1234567,
  joinedAt: '2023-08-20',
};

const PLATFORM_STATS = {
  totalLoads: 12847,
  activeLoads: 1234,
  totalDrivers: 4567,
  totalShippers: 892,
  avgRatePerMile: 3.45,
  avgSavings: 17,
  instantPayouts: 8945000,
  avgPayoutTime: '< 2 hours',
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function DirectFreightModulePage() {
  console.log("🚚 Freight page rendering");
  const [currentView, setCurrentView] = useState<FreightView>('landing');
  const [userRole, setUserRole] = useState<UserRole>('driver');
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  console.log("📍 currentView:", currentView);

  const handleViewLoad = (load: Load) => {
    setSelectedLoad(load);
    setCurrentView('load-details');
  };

  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#E6EDF3]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F59E0B] via-[#00A3FF] to-[#3CCB7F] rounded-xl flex items-center justify-center">
                <span className="text-xl">🚛</span>
              </div>
              <div>
                <div className="font-bold">Direct Freight</div>
                <div className="text-xs text-[#6E7681]">Zero Broker • Zero Fees</div>
              </div>
            </Link>
            <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded-full font-mono">v1.0</span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {userRole === 'shipper' && [
              { id: 'shipper-dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'create-load', label: 'Post Load', icon: '➕' },
              { id: 'shipper-loads', label: 'My Loads', icon: '📦' },
              { id: 'shipper-payments', label: 'Payments', icon: '💳' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as FreightView)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentView === item.id
                    ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                    : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            {userRole === 'driver' && [
              { id: 'driver-dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'load-board', label: 'Load Board', icon: '📋' },
              { id: 'driver-loads', label: 'My Loads', icon: '🚚' },
              { id: 'driver-earnings', label: 'Earnings', icon: '💰' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as FreightView)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentView === item.id
                    ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]'
                    : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            {userRole === 'admin' && [
              { id: 'admin', label: 'Admin Panel', icon: '⚙️' },
              { id: 'load-board', label: 'All Loads', icon: '📋' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as FreightView)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentView === item.id
                    ? 'bg-[#A371F7]/20 text-[#A371F7]'
                    : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Role Switcher */}
            <select
              value={userRole}
              onChange={(e) => {
                setUserRole(e.target.value as UserRole);
                setCurrentView(e.target.value === 'shipper' ? 'shipper-dashboard' : 
                               e.target.value === 'driver' ? 'driver-dashboard' : 
                               e.target.value === 'admin' ? 'admin' : 'landing');
              }}
              className="bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-2 text-sm"
            >
              <option value="driver">🚛 Driver</option>
              <option value="shipper">🏭 Shipper</option>
              <option value="carrier">🚚 Carrier</option>
              <option value="admin">👑 Admin</option>
            </select>

            {/* User Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-[#F59E0B] to-[#00A3FF] rounded-full flex items-center justify-center text-lg">
                {userRole === 'driver' ? '🚛' : userRole === 'shipper' ? '🏭' : '👤'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        {currentView === 'landing' && <LandingPage onGetStarted={() => setCurrentView('load-board')} onPostLoad={() => setCurrentView('create-load')} />}
        {currentView === 'load-board' && <LoadBoardPage loads={SAMPLE_LOADS} onViewLoad={handleViewLoad} />}
        {currentView === 'load-details' && selectedLoad && (
          <LoadDetailsPage 
            load={selectedLoad} 
            userRole={userRole}
            onBack={() => setCurrentView('load-board')}
            onBook={() => setCurrentView('driver-loads')}
          />
        )}
        {currentView === 'create-load' && <CreateLoadPage onSuccess={() => setCurrentView('shipper-loads')} />}
        {currentView === 'shipper-dashboard' && <ShipperDashboardPage shipper={SAMPLE_SHIPPER} loads={SAMPLE_LOADS} />}
        {currentView === 'shipper-loads' && <ShipperLoadsPage loads={SAMPLE_LOADS} onViewLoad={handleViewLoad} />}
        {currentView === 'shipper-payments' && <ShipperPaymentsPage />}
        {currentView === 'driver-dashboard' && <DriverDashboardPage driver={SAMPLE_DRIVER} loads={SAMPLE_LOADS} />}
        {currentView === 'driver-loads' && <DriverLoadsPage loads={SAMPLE_LOADS} onViewLoad={handleViewLoad} />}
        {currentView === 'driver-earnings' && <DriverEarningsPage driver={SAMPLE_DRIVER} />}
        {currentView === 'tracking' && selectedLoad && <TrackingPage load={selectedLoad} />}
        {currentView === 'admin' && <AdminPanelPage loads={SAMPLE_LOADS} stats={PLATFORM_STATS} />}
      </main>

      {/* Footer */}
      <footer className="bg-[#0D1117] border-t border-[#1F242C] py-6 mt-12">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between text-sm text-[#6E7681]">
            <div>© 2024-2026 IVYAR. All rights reserved.</div>
            <div className="flex gap-4">
              <span className="bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-1 rounded">Instant Pay</span>
              <span className="bg-[#00A3FF]/20 text-[#00A3FF] px-2 py-1 rounded">AI Rates</span>
              <span className="bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-1 rounded">GPS Tracking</span>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
      <AutopilotWidget module="freight" />
    </div>
  );
}

// ============================================
// LANDING PAGE
// ============================================
function LandingPage({ onGetStarted, onPostLoad }: { onGetStarted: () => void; onPostLoad?: () => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/10 via-[#00A3FF]/10 to-[#3CCB7F]/10"></div>
        <div className="max-w-[1440px] mx-auto px-6 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#F85149]/20 text-[#F85149] px-4 py-2 rounded-full text-sm mb-6">
              <span>🚫</span>
              <span>Zero Brokers • Zero Hidden Fees • Zero BS</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Ship Direct.<br/>
              <span className="text-[#3CCB7F]">Pay Fair.</span><br/>
              <span className="text-[#F59E0B]">Get Paid Instantly.</span>
            </h1>
            <p className="text-xl text-[#8B949E] mb-8">
              Connect directly with verified drivers and shippers. AI-powered fair rates.
              Instant payments. No middlemen taking your money.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-[#F59E0B] to-[#00A3FF] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg hover:shadow-[#F59E0B]/30 transition-all"
              >
                Find Loads →
              </button>
              <button onClick={onPostLoad} className="bg-[#161B22] border border-[#1F242C] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#1F242C] transition-all">
                Post a Load
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#0D1117]">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-4 gap-6">
            {[
              { value: '$8.9M+', label: 'Instant Payouts', icon: '💰' },
              { value: '17%', label: 'Average Savings', icon: '📉' },
              { value: '< 2hrs', label: 'Payment Time', icon: '⚡' },
              { value: '4,567', label: 'Active Drivers', icon: '🚛' },
            ].map((stat, i) => (
              <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 text-center">
                <span className="text-3xl">{stat.icon}</span>
                <div className="text-3xl font-bold mt-3 text-[#3CCB7F]">{stat.value}</div>
                <div className="text-sm text-[#8B949E]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How Direct Freight Works</h2>
          
          <div className="grid grid-cols-2 gap-12">
            {/* For Shippers */}
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🏭</span>
                <h3 className="text-xl font-bold">For Shippers</h3>
              </div>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Post Your Load', desc: 'Enter pickup, delivery, and cargo details' },
                  { step: '2', title: 'Get AI Rate', desc: 'Fair market rate with full transparency' },
                  { step: '3', title: 'Driver Accepts', desc: 'Verified driver books directly' },
                  { step: '4', title: 'Track & Pay', desc: 'Real-time GPS, instant payment on delivery' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-8 h-8 bg-[#F59E0B] rounded-full flex items-center justify-center text-[#0D1117] font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-sm text-[#8B949E]">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Drivers */}
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🚛</span>
                <h3 className="text-xl font-bold">For Drivers</h3>
              </div>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Browse Load Board', desc: 'See real rates, real shippers, no games' },
                  { step: '2', title: 'Book Instantly', desc: 'One click to accept, no back-and-forth' },
                  { step: '3', title: 'Haul & Track', desc: 'GPS tracking, direct shipper communication' },
                  { step: '4', title: 'Get Paid Instantly', desc: 'Instant payout to your account, 0% fees' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-8 h-8 bg-[#3CCB7F] rounded-full flex items-center justify-center text-[#0D1117] font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-sm text-[#8B949E]">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why No Brokers */}
      <section className="py-16 bg-[#0D1117]">
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Why Cut Out Brokers?</h2>
          <p className="text-center text-[#8B949E] mb-12 max-w-2xl mx-auto">
            Traditional brokers take 15-30% of every load. That money belongs to drivers and shippers.
          </p>
          
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: '💸', title: 'Keep Your Money', desc: 'No 15-30% broker cut. Direct rate = full pay.' },
              { icon: '🔍', title: 'Full Transparency', desc: 'See exactly what shipper pays, what driver gets.' },
              { icon: '⚡', title: 'Instant Payment', desc: 'No 30-day terms. Get paid within hours.' },
              { icon: '📱', title: 'Direct Contact', desc: 'Talk directly to shipper/driver. No middleman.' },
              { icon: '🧠', title: 'AI Fair Rates', desc: 'Market-based pricing, no manipulation.' },
              { icon: '🛡️', title: 'Full Insurance', desc: 'Cargo, liability, and health coverage built-in.' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 cursor-pointer transition-all"
                onClick={() => alert(`${item.title}\n\n${item.desc}\n\nClick "Learn More" for detailed information.`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3CCB7F';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1F242C';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span className="text-3xl">{item.icon}</span>
                <div className="font-semibold mt-3">{item.title}</div>
                <div className="text-sm text-[#8B949E] mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================
// LOAD BOARD PAGE
// ============================================
function LoadBoardPage({ loads, onViewLoad }: { loads: Load[]; onViewLoad: (load: Load) => void }) {
  const [filterEquipment, setFilterEquipment] = useState<EquipmentType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'available' | 'all'>('available');
  
  const filteredLoads = loads.filter(load => {
    if (filterStatus === 'available' && load.status !== 'posted') return false;
    if (filterEquipment !== 'all' && load.equipmentType !== filterEquipment) return false;
    return true;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Load Board</h1>
          <p className="text-[#8B949E]">Real rates. Real shippers. No brokers.</p>
        </div>
        <div className="flex gap-3">
          <select
            value={filterEquipment}
            onChange={(e) => setFilterEquipment(e.target.value as EquipmentType | 'all')}
            className="bg-[#161B22] border border-[#1F242C] rounded-lg px-4 py-2 text-sm"
          >
            <option value="all">All Equipment</option>
            {Object.entries(EQUIPMENT_TYPES).map(([key, val]) => (
              <option key={key} value={key}>{val.icon} {val.label}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'available' | 'all')}
            className="bg-[#161B22] border border-[#1F242C] rounded-lg px-4 py-2 text-sm"
          >
            <option value="available">Available Only</option>
            <option value="all">All Loads</option>
          </select>
        </div>
      </div>

      {/* Load Cards */}
      <div className="space-y-4">
        {filteredLoads.map((load) => (
          <LoadCard key={load.id} load={load} onClick={() => onViewLoad(load)} />
        ))}
        {filteredLoads.length === 0 && (
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-12 text-center">
            <span className="text-4xl">📭</span>
            <p className="text-[#8B949E] mt-4">No loads matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Load Card Component
function LoadCard({ load, onClick }: { load: Load; onClick: () => void }) {
  const equipment = EQUIPMENT_TYPES[load.equipmentType];
  const status = LOAD_STATUS_CONFIG[load.status];
  const savings = Math.round((1 - load.aiRate / load.marketRate) * 100);

  return (
    <div 
      onClick={onClick}
      className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden hover:border-[#F59E0B]/50 transition-all cursor-pointer"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-3xl">{equipment.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{load.origin.city}, {load.origin.state}</span>
                <span className="text-[#F59E0B]">→</span>
                <span className="font-semibold">{load.destination.city}, {load.destination.state}</span>
              </div>
              <div className="text-sm text-[#6E7681]">
                {load.distance} mi • {equipment.label} • {(load.weight / 1000).toFixed(0)}K lbs
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#3CCB7F]">${load.aiRate.toLocaleString()}</div>
            <div className="text-sm text-[#8B949E]">${load.ratePerMile.toFixed(2)}/mi</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-[#8B949E]">Pickup:</span> {load.pickupDate}
            </div>
            <div>
              <span className="text-[#8B949E]">Delivery:</span> {load.deliveryDate}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#F59E0B]">★</span>
              <span>{load.shipperRating}</span>
              <span className="text-[#6E7681]">{load.shipperName}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-1 rounded">
              Save {savings}% vs broker
            </span>
            <span 
              className="text-xs px-2 py-1 rounded inline-flex items-center gap-1"
              style={{ backgroundColor: `${status.color}20`, color: status.color }}
            >
              {status.icon} {status.label}
            </span>
            {load.paymentMethod === 'instant' && (
              <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-1 rounded">
                ⚡ Instant Pay
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// LOAD DETAILS PAGE
// ============================================
function LoadDetailsPage({ 
  load, 
  userRole,
  onBack,
  onBook,
}: { 
  load: Load;
  userRole: UserRole;
  onBack: () => void;
  onBook: () => void;
}) {
  const equipment = EQUIPMENT_TYPES[load.equipmentType];
  const status = LOAD_STATUS_CONFIG[load.status];
  const savings = Math.round((1 - load.aiRate / load.marketRate) * 100);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8B949E] hover:text-white mb-6">
        ← Back to Load Board
      </button>

      <div className="grid grid-cols-[1fr_400px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-[#6E7681] font-mono mb-1">{load.loadNumber}</div>
                <div className="flex items-center gap-3 text-2xl font-bold">
                  <span>{load.origin.city}, {load.origin.state}</span>
                  <span className="text-[#F59E0B]">→</span>
                  <span>{load.destination.city}, {load.destination.state}</span>
                </div>
              </div>
              <span 
                className="px-3 py-1 rounded-lg text-sm font-medium inline-flex items-center gap-1"
                style={{ backgroundColor: `${status.color}20`, color: status.color }}
              >
                {status.icon} {status.label}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-xs text-[#6E7681]">Distance</div>
                <div className="font-bold">{load.distance} mi</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-xs text-[#6E7681]">Equipment</div>
                <div className="font-bold">{equipment.icon} {equipment.label}</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-xs text-[#6E7681]">Weight</div>
                <div className="font-bold">{(load.weight / 1000).toFixed(0)}K lbs</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-xs text-[#6E7681]">Commodity</div>
                <div className="font-bold">{load.commodity}</div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h3 className="font-semibold mb-4">Schedule</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#0D1117] rounded-lg p-4">
                <div className="flex items-center gap-2 text-[#3CCB7F] mb-2">
                  <span>📍</span>
                  <span className="font-semibold">Pickup</span>
                </div>
                <div className="font-bold">{load.origin.city}, {load.origin.state} {load.origin.zip}</div>
                <div className="text-sm text-[#8B949E] mt-1">{load.pickupDate} • {load.pickupTimeWindow}</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-4">
                <div className="flex items-center gap-2 text-[#F59E0B] mb-2">
                  <span>🏁</span>
                  <span className="font-semibold">Delivery</span>
                </div>
                <div className="font-bold">{load.destination.city}, {load.destination.state} {load.destination.zip}</div>
                <div className="text-sm text-[#8B949E] mt-1">{load.deliveryDate} • {load.deliveryTimeWindow}</div>
              </div>
            </div>
            {load.specialInstructions && (
              <div className="mt-4 p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
                <div className="text-xs text-[#F59E0B] mb-1">Special Instructions</div>
                <div className="text-sm">{load.specialInstructions}</div>
              </div>
            )}
          </div>

          {/* AI Rate Breakdown */}
          <div className="bg-gradient-to-r from-[#00A3FF]/10 to-[#3CCB7F]/10 border border-[#00A3FF]/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧠</span>
              <h3 className="font-semibold">AI Rate Engine — Full Transparency</h3>
              <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-0.5 rounded">
                {load.rateConfidence}% confidence
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-[#8B949E]">Rate Breakdown</div>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Rate</span>
                    <span className="font-mono">${load.rateBreakdown.baseRate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Fuel Surcharge</span>
                    <span className="font-mono">${load.rateBreakdown.fuelSurcharge}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Accessorials</span>
                    <span className="font-mono">${load.rateBreakdown.accessorials}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Market Adjustment</span>
                    <span className="font-mono">${load.rateBreakdown.marketAdjustment}</span>
                  </div>
                  <div className="border-t border-[#1F242C] pt-2 flex justify-between font-bold">
                    <span>Total Rate</span>
                    <span className="text-[#3CCB7F]">${load.aiRate}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-[#8B949E]">Broker Comparison</div>
                <div className="bg-[#0D1117] rounded-lg p-4 mt-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-[#8B949E]">Typical Broker Rate</span>
                    <span className="font-mono line-through text-[#8B949E]">${load.marketRate}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[#3CCB7F]">Direct Rate (You Pay)</span>
                    <span className="font-mono font-bold text-[#3CCB7F]">${load.aiRate}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#1F242C]">
                    <span className="text-[#F59E0B]">You Save</span>
                    <span className="font-bold text-[#F59E0B]">${load.marketRate - load.aiRate} ({savings}%)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-[#8B949E] bg-[#0D1117] rounded-lg p-3">
              <span className="text-[#00A3FF]">AI:</span> {load.rateRationale}
            </div>
          </div>

          {/* Shipper Info */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h3 className="font-semibold mb-4">Shipper Information</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F59E0B]/20 rounded-full flex items-center justify-center text-2xl">
                  🏭
                </div>
                <div>
                  <div className="font-semibold">{load.shipperName}</div>
                  <div className="flex items-center gap-2 text-sm text-[#8B949E]">
                    <span className="text-[#F59E0B]">★ {load.shipperRating}</span>
                    <span>•</span>
                    <span>Verified Shipper</span>
                  </div>
                </div>
              </div>
              <button className="bg-[#1F242C] px-4 py-2 rounded-lg text-sm">
                💬 Contact Shipper
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Price Card */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 sticky top-24">
            <div className="text-center mb-6">
              <div className="text-sm text-[#8B949E]">Direct Rate</div>
              <div className="text-4xl font-bold text-[#3CCB7F]">${load.aiRate.toLocaleString()}</div>
              <div className="text-sm text-[#8B949E]">${load.ratePerMile.toFixed(2)}/mile</div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#3CCB7F]">✓</span>
                <span>Instant Pay Available</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#3CCB7F]">✓</span>
                <span>$100K Cargo Insurance</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#3CCB7F]">✓</span>
                <span>GPS Tracking Enabled</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#3CCB7F]">✓</span>
                <span>Direct Shipper Contract</span>
              </div>
            </div>

            {userRole === 'driver' && load.status === 'posted' && (
              <button
                onClick={onBook}
                className="w-full bg-gradient-to-r from-[#3CCB7F] to-[#00A3FF] text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#3CCB7F]/30 transition-all"
              >
                🚛 Book This Load
              </button>
            )}

            {load.status !== 'posted' && (
              <div className="text-center text-sm text-[#8B949E]">
                This load is no longer available
              </div>
            )}

            <div className="mt-4 text-center text-xs text-[#6E7681]">
              0% platform fee • Pay only what you see
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-[#0D1117] rounded-lg p-3 text-center">
                <div className="text-xs text-[#6E7681]">Est. Drive Time</div>
                <div className="font-bold">{Math.round(load.distance / 50)} hrs</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3 text-center">
                <div className="text-xs text-[#6E7681]">Hourly Rate</div>
                <div className="font-bold text-[#3CCB7F]">${Math.round(load.aiRate / (load.distance / 50))}/hr</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DRIVER DASHBOARD PAGE
// ============================================
function DriverDashboardPage({ driver, loads }: { driver: Driver; loads: Load[] }) {
  const myLoads = loads.filter(l => l.driverId === driver.id);
  const activeLoad = myLoads.find(l => ['booked', 'in_transit', 'at_pickup', 'picked_up', 'at_delivery'].includes(l.status));

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#3CCB7F] to-[#00A3FF] rounded-full flex items-center justify-center text-3xl">
            {driver.avatar}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {driver.name.split(' ')[0]}!</h1>
            <div className="flex items-center gap-2 text-sm text-[#8B949E]">
              <span className="text-[#F59E0B]">★ {driver.rating}</span>
              <span>•</span>
              <span>{driver.totalLoads} loads completed</span>
              <span>•</span>
              <span className="text-[#3CCB7F]">{driver.onTimeDelivery}% on-time</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl px-6 py-3 text-center">
            <div className="text-sm text-[#8B949E]">Pending Pay</div>
            <div className="text-xl font-bold text-[#F59E0B]">${driver.pendingPayments.toLocaleString()}</div>
          </div>
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl px-6 py-3 text-center">
            <div className="text-sm text-[#8B949E]">Total Earnings</div>
            <div className="text-xl font-bold text-[#3CCB7F]">${(driver.totalEarnings / 1000).toFixed(0)}K</div>
          </div>
        </div>
      </div>

      {/* Active Load */}
      {activeLoad && (
        <div className="bg-gradient-to-r from-[#F59E0B]/10 to-[#3CCB7F]/10 border border-[#F59E0B]/30 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚚</span>
              <h2 className="text-xl font-bold">Active Load</h2>
            </div>
            <span className="bg-[#F59E0B] text-[#0D1117] px-3 py-1 rounded-full text-sm font-bold">
              {LOAD_STATUS_CONFIG[activeLoad.status].label}
            </span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="font-semibold">{activeLoad.origin.city}, {activeLoad.origin.state}</span>
            <span className="text-[#F59E0B]">→</span>
            <span className="font-semibold">{activeLoad.destination.city}, {activeLoad.destination.state}</span>
            <span className="text-[#8B949E]">•</span>
            <span className="text-[#8B949E]">{activeLoad.distance} mi</span>
          </div>
          <div className="flex gap-3">
            <button className="bg-[#3CCB7F] text-[#0D1117] px-4 py-2 rounded-lg font-semibold">
              📍 Update Status
            </button>
            <button className="bg-[#1F242C] px-4 py-2 rounded-lg">
              📸 Upload POD
            </button>
            <button className="bg-[#1F242C] px-4 py-2 rounded-lg">
              💬 Contact Shipper
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'This Week', value: `$${(4567).toLocaleString()}`, icon: '📊', color: '#3CCB7F' },
          { label: 'This Month', value: `$${(18450).toLocaleString()}`, icon: '📈', color: '#00A3FF' },
          { label: 'Loads Available', value: '23', icon: '📋', color: '#F59E0B' },
          { label: 'Acceptance Rate', value: `${driver.acceptanceRate}%`, icon: '✓', color: '#A371F7' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <span className="text-2xl">{stat.icon}</span>
            <div className="text-2xl font-bold mt-2" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-[#8B949E]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Available Loads Preview */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
          <h3 className="font-semibold">Recommended Loads</h3>
          <button className="text-[#00A3FF] text-sm hover:underline">View All →</button>
        </div>
        <div className="divide-y divide-[#1F242C]">
          {loads.filter(l => l.status === 'posted').slice(0, 3).map((load) => (
            <div key={load.id} className="p-4 flex items-center justify-between hover:bg-[#1F242C]/30">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{EQUIPMENT_TYPES[load.equipmentType].icon}</span>
                <div>
                  <div className="font-medium">{load.origin.city} → {load.destination.city}</div>
                  <div className="text-sm text-[#6E7681]">{load.distance} mi • {load.pickupDate}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#3CCB7F]">${load.aiRate}</div>
                <div className="text-xs text-[#8B949E]">${load.ratePerMile.toFixed(2)}/mi</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// DRIVER EARNINGS PAGE
// ============================================
function DriverEarningsPage({ driver }: { driver: Driver }) {
  const payments = [
    { id: 'pay-001', loadNumber: 'DF-2025-00892', amount: 2317, status: 'paid', method: 'instant', date: '2026-01-04' },
    { id: 'pay-002', loadNumber: 'DF-2026-00002', amount: 3568, status: 'pending', method: 'instant', date: '2026-01-07' },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Earnings & Payments</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Earnings', value: `$${(driver.totalEarnings / 1000).toFixed(0)}K`, icon: '💰', color: '#3CCB7F' },
          { label: 'Pending Payout', value: `$${driver.pendingPayments.toLocaleString()}`, icon: '⏳', color: '#F59E0B' },
          { label: 'This Month', value: '$18,450', icon: '📊', color: '#00A3FF' },
          { label: 'Avg Per Load', value: '$1,228', icon: '🚛', color: '#A371F7' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <span className="text-2xl">{stat.icon}</span>
            <div className="text-2xl font-bold mt-2" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-[#8B949E]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Instant Pay Banner */}
      <div className="bg-gradient-to-r from-[#F59E0B]/20 to-[#3CCB7F]/20 border border-[#F59E0B]/30 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">⚡</span>
            <div>
              <h3 className="text-xl font-bold">Instant Pay Available</h3>
              <p className="text-[#8B949E]">Get paid within 2 hours of delivery confirmation. 0% fees.</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#F59E0B]">${driver.pendingPayments.toLocaleString()}</div>
            <button className="bg-[#F59E0B] text-[#0D1117] px-6 py-2 rounded-lg font-bold mt-2">
              Cash Out Now
            </button>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1F242C]">
          <h3 className="font-semibold">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-4">Load</th>
                <th className="text-right p-4">Amount</th>
                <th className="text-center p-4">Method</th>
                <th className="text-center p-4">Status</th>
                <th className="text-left p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-[#1F242C]">
                  <td className="p-4 font-mono">{payment.loadNumber}</td>
                  <td className="p-4 text-right font-bold text-[#3CCB7F]">${payment.amount.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-1 rounded">
                      ⚡ {payment.method}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      payment.status === 'paid' ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#8B949E]">{payment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DRIVER LOADS PAGE
// ============================================
function DriverLoadsPage({ loads, onViewLoad }: { loads: Load[]; onViewLoad: (load: Load) => void }) {
  const myLoads = loads.filter(l => l.driverId === 'drv-001');

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">My Loads</h1>

      <div className="space-y-4">
        {myLoads.map((load) => (
          <LoadCard key={load.id} load={load} onClick={() => onViewLoad(load)} />
        ))}
        {myLoads.length === 0 && (
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-12 text-center">
            <span className="text-4xl">📭</span>
            <p className="text-[#8B949E] mt-4">No loads yet. Browse the load board to find your next haul!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// SHIPPER DASHBOARD PAGE
// ============================================
function ShipperDashboardPage({ shipper, loads }: { shipper: Shipper; loads: Load[] }) {
  const myLoads = loads.filter(l => l.shipperId === shipper.id);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{shipper.companyName}</h1>
          <div className="flex items-center gap-2 text-sm text-[#8B949E]">
            <span className="text-[#F59E0B]">★ {shipper.rating}</span>
            <span>•</span>
            <span>{shipper.totalLoads} loads shipped</span>
            <span>•</span>
            <span className="text-[#3CCB7F]">Verified Shipper</span>
          </div>
        </div>
        <button className="bg-gradient-to-r from-[#F59E0B] to-[#00A3FF] text-white px-6 py-3 rounded-xl font-semibold">
          + Post New Load
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Loads', value: myLoads.filter(l => !['completed', 'cancelled'].includes(l.status)).length, icon: '📦', color: '#00A3FF' },
          { label: 'In Transit', value: myLoads.filter(l => l.status === 'in_transit').length, icon: '🚚', color: '#F59E0B' },
          { label: 'Completed', value: myLoads.filter(l => l.status === 'completed').length, icon: '✓', color: '#3CCB7F' },
          { label: 'Total Saved', value: '$45,230', icon: '💰', color: '#A371F7' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <span className="text-2xl">{stat.icon}</span>
            <div className="text-2xl font-bold mt-2" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-[#8B949E]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Loads */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1F242C]">
          <h3 className="font-semibold">Recent Loads</h3>
        </div>
        <div className="divide-y divide-[#1F242C]">
          {myLoads.slice(0, 5).map((load) => {
            const status = LOAD_STATUS_CONFIG[load.status];
            return (
              <div key={load.id} className="p-4 flex items-center justify-between hover:bg-[#1F242C]/30">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{EQUIPMENT_TYPES[load.equipmentType].icon}</span>
                  <div>
                    <div className="font-medium">{load.origin.city} → {load.destination.city}</div>
                    <div className="text-sm text-[#6E7681]">{load.loadNumber} • {load.pickupDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{ backgroundColor: `${status.color}20`, color: status.color }}
                  >
                    {status.label}
                  </span>
                  <div className="text-right">
                    <div className="font-bold">${load.aiRate}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================
// SHIPPER LOADS PAGE
// ============================================
function ShipperLoadsPage({ loads, onViewLoad }: { loads: Load[]; onViewLoad: (load: Load) => void }) {
  const myLoads = loads.filter(l => ['ship-001', 'ship-002', 'ship-003'].includes(l.shipperId));

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Loads</h1>
        <button className="bg-[#F59E0B] text-[#0D1117] px-4 py-2 rounded-lg font-semibold">
          + Post New Load
        </button>
      </div>

      <div className="space-y-4">
        {myLoads.map((load) => (
          <LoadCard key={load.id} load={load} onClick={() => onViewLoad(load)} />
        ))}
      </div>
    </div>
  );
}

// ============================================
// SHIPPER PAYMENTS PAGE
// ============================================
function ShipperPaymentsPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Payments</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Spent', value: '$1.23M', icon: '💳', color: '#00A3FF' },
          { label: 'Pending', value: '$4,177', icon: '⏳', color: '#F59E0B' },
          { label: 'Saved vs Brokers', value: '$185,400', icon: '💰', color: '#3CCB7F' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <span className="text-2xl">{stat.icon}</span>
            <div className="text-2xl font-bold mt-2" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-[#8B949E]">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 text-center">
        <span className="text-4xl">📋</span>
        <p className="text-[#8B949E] mt-4">Payment history and invoices</p>
      </div>
    </div>
  );
}

// ============================================
// CREATE LOAD PAGE
// ============================================
function CreateLoadPage({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Post a New Load</h1>

      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        {/* Stepper */}
        <div className="px-6 py-4 bg-[#0D1117] border-b border-[#1F242C]">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Route' },
              { num: 2, label: 'Cargo' },
              { num: 3, label: 'Schedule' },
              { num: 4, label: 'Review' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= s.num ? 'bg-[#F59E0B] text-[#0D1117]' : 'bg-[#1F242C] text-[#8B949E]'
                  }`}>
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className={step >= s.num ? 'text-white' : 'text-[#8B949E]'}>{s.label}</span>
                </div>
                {i < 3 && <div className={`w-16 h-0.5 ${step > s.num ? 'bg-[#F59E0B]' : 'bg-[#1F242C]'}`}></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-[#8B949E] mb-2">Pickup Location</label>
                <input 
                  type="text" 
                  placeholder="City, State or ZIP"
                  className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm text-[#8B949E] mb-2">Delivery Location</label>
                <input 
                  type="text" 
                  placeholder="City, State or ZIP"
                  className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3"
                />
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#F59E0B] text-[#0D1117] py-3 rounded-lg font-semibold"
              >
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-[#8B949E] mb-2">Equipment Type</label>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(EQUIPMENT_TYPES).slice(0, 4).map(([key, val]) => (
                    <button key={key} className="p-4 bg-[#0D1117] border border-[#1F242C] rounded-lg text-center hover:border-[#F59E0B]">
                      <span className="text-2xl">{val.icon}</span>
                      <div className="text-sm mt-1">{val.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#8B949E] mb-2">Weight (lbs)</label>
                  <input type="number" className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm text-[#8B949E] mb-2">Commodity</label>
                  <input type="text" className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 bg-[#1F242C] py-3 rounded-lg">← Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-[#F59E0B] text-[#0D1117] py-3 rounded-lg font-semibold">Continue →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#8B949E] mb-2">Pickup Date</label>
                  <input type="date" className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm text-[#8B949E] mb-2">Pickup Time</label>
                  <select className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3">
                    <option>08:00 - 12:00</option>
                    <option>12:00 - 16:00</option>
                    <option>16:00 - 20:00</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#8B949E] mb-2">Delivery Date</label>
                  <input type="date" className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm text-[#8B949E] mb-2">Delivery Time</label>
                  <select className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3">
                    <option>08:00 - 12:00</option>
                    <option>12:00 - 16:00</option>
                    <option>16:00 - 20:00</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 bg-[#1F242C] py-3 rounded-lg">← Back</button>
                <button onClick={() => setStep(4)} className="flex-1 bg-[#F59E0B] text-[#0D1117] py-3 rounded-lg font-semibold">Get AI Rate →</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              {/* AI Rate */}
              <div className="bg-gradient-to-r from-[#00A3FF]/10 to-[#3CCB7F]/10 border border-[#00A3FF]/30 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">🧠</span>
                  <span className="font-semibold">AI Recommended Rate</span>
                </div>
                <div className="text-4xl font-bold text-[#3CCB7F]">$1,860</div>
                <div className="text-sm text-[#8B949E]">$5.00/mile • 372 miles</div>
                <div className="text-xs text-[#3CCB7F] mt-2">Save 15% vs typical broker rate</div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 bg-[#1F242C] py-3 rounded-lg">← Back</button>
                <button 
                  onClick={onSuccess}
                  className="flex-1 bg-gradient-to-r from-[#3CCB7F] to-[#00A3FF] text-white py-3 rounded-lg font-semibold"
                >
                  Post Load ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// TRACKING PAGE (Placeholder)
// ============================================
function TrackingPage({ load }: { load: Load }) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Live Tracking</h1>
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-12 text-center">
        <span className="text-6xl">🗺️</span>
        <p className="text-[#8B949E] mt-4">Real-time GPS tracking for {load.loadNumber}</p>
      </div>

    </div>

  );
}

// ============================================
// ADMIN PANEL PAGE
// ============================================
function AdminPanelPage({ loads, stats }: { loads: Load[]; stats: typeof PLATFORM_STATS }) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {/* Platform Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Loads', value: stats.totalLoads.toLocaleString(), icon: '📦', color: '#00A3FF' },
          { label: 'Active Drivers', value: stats.totalDrivers.toLocaleString(), icon: '🚛', color: '#3CCB7F' },
          { label: 'Shippers', value: stats.totalShippers.toLocaleString(), icon: '🏭', color: '#F59E0B' },
          { label: 'Instant Payouts', value: `$${(stats.instantPayouts / 1000000).toFixed(1)}M`, icon: '💰', color: '#A371F7' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <span className="text-2xl">{stat.icon}</span>
            <div className="text-2xl font-bold mt-2" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-[#8B949E]">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Loads */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C]">
            <h3 className="font-semibold">Recent Loads</h3>
          </div>
          <div className="divide-y divide-[#1F242C]">
            {loads.slice(0, 5).map((load) => {
              const status = LOAD_STATUS_CONFIG[load.status];
              return (
                <div key={load.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-sm">{load.loadNumber}</div>
                    <div className="text-sm text-[#6E7681]">{load.origin.city} → {load.destination.city}</div>
                  </div>
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{ backgroundColor: `${status.color}20`, color: status.color }}
                  >
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4">Platform Health</h3>
          <div className="space-y-4">
            {[
              { label: 'Avg Rate/Mile', value: `$${stats.avgRatePerMile}`, status: 'good' },
              { label: 'Avg Savings vs Brokers', value: `${stats.avgSavings}%`, status: 'good' },
              { label: 'Avg Payout Time', value: stats.avgPayoutTime, status: 'good' },
              { label: 'Active Loads', value: stats.activeLoads, status: 'good' },
            ].map((metric, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#0D1117] rounded-lg">
                <span>{metric.label}</span>
                <span className="font-bold text-[#3CCB7F]">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>



      <div style={{position: 'fixed', top: '100px', right: '20px', background: 'red', color: 'white', padding: '20px', zIndex: 9999}}>
      </div>

    </div>
  );
}
