'use client';

import { useState } from 'react';
import Link from 'next/link';
import AutopilotWidget from '@/components/AutopilotWidget';

// ============================================================================
// TYPES
// ============================================================================

type TripType = 'one-way' | 'round-trip' | 'multi-city';
type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first';
type SortBy = 'price' | 'duration' | 'departure' | 'airline';

interface Airport {
  code: string;
  city: string;
  country: string;
  name: string;
}

interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  from: Airport;
  to: Airport;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  cabinClass: CabinClass;
  seatsLeft: number;
  baggage: string;
}

interface Deal {
  id: string;
  route: string;
  fromCode: string;
  toCode: string;
  price: number;
  discount: number;
  validUntil: string;
  airline: string;
}

// ============================================================================
// SAMPLE DATA
// ============================================================================

const POPULAR_ROUTES: Airport[] = [
  { code: 'JFK', city: 'New York', country: 'USA', name: 'John F. Kennedy' },
  { code: 'LAX', city: 'Los Angeles', country: 'USA', name: 'Los Angeles Intl' },
  { code: 'LHR', city: 'London', country: 'UK', name: 'Heathrow' },
  { code: 'CDG', city: 'Paris', country: 'France', name: 'Charles de Gaulle' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', name: 'Frankfurt' },
  { code: 'KBP', city: 'Kyiv', country: 'Ukraine', name: 'Boryspil' },
  { code: 'WAW', city: 'Warsaw', country: 'Poland', name: 'Chopin' },
  { code: 'DXB', city: 'Dubai', country: 'UAE', name: 'Dubai Intl' },
];

const SAMPLE_FLIGHTS: Flight[] = [
  {
    id: 'FL001',
    airline: 'United Airlines',
    airlineCode: 'UA',
    flightNumber: 'UA 123',
    from: POPULAR_ROUTES[0], // JFK
    to: POPULAR_ROUTES[2], // LHR
    departure: '2026-05-15T10:00',
    arrival: '2026-05-15T22:00',
    duration: '7h 0m',
    stops: 0,
    price: 650,
    currency: 'USD',
    cabinClass: 'economy',
    seatsLeft: 12,
    baggage: '1 checked bag',
  },
  {
    id: 'FL002',
    airline: 'Air France',
    airlineCode: 'AF',
    flightNumber: 'AF 456',
    from: POPULAR_ROUTES[0],
    to: POPULAR_ROUTES[3], // CDG
    departure: '2026-05-15T14:30',
    arrival: '2026-05-16T03:45',
    duration: '8h 15m',
    stops: 0,
    price: 580,
    currency: 'USD',
    cabinClass: 'economy',
    seatsLeft: 8,
    baggage: '2 checked bags',
  },
  {
    id: 'FL003',
    airline: 'Lufthansa',
    airlineCode: 'LH',
    flightNumber: 'LH 789',
    from: POPULAR_ROUTES[1], // LAX
    to: POPULAR_ROUTES[4], // FRA
    departure: '2026-05-15T16:00',
    arrival: '2026-05-16T11:30',
    duration: '11h 30m',
    stops: 0,
    price: 720,
    currency: 'USD',
    cabinClass: 'economy',
    seatsLeft: 5,
    baggage: '1 checked bag',
  },
];

const BEST_DEALS: Deal[] = [
  {
    id: 'D001',
    route: 'New York → London',
    fromCode: 'JFK',
    toCode: 'LHR',
    price: 399,
    discount: 35,
    validUntil: '2026-01-20',
    airline: 'Multiple airlines',
  },
  {
    id: 'D002',
    route: 'Los Angeles → Paris',
    fromCode: 'LAX',
    toCode: 'CDG',
    price: 449,
    discount: 40,
    validUntil: '2026-01-18',
    airline: 'Air France',
  },
  {
    id: 'D003',
    route: 'Warsaw → Kyiv',
    fromCode: 'WAW',
    toCode: 'KBP',
    price: 89,
    discount: 25,
    validUntil: '2026-01-25',
    airline: 'LOT Polish',
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AviationTicketsPage() {
  const [tripType, setTripType] = useState<TripType>('round-trip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState<CabinClass>('economy');
  const [showResults, setShowResults] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('price');

  const handleSearch = () => {
    setShowResults(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0E1A', color: '#E2E8F0' }}>
      {/* Header */}
      <header style={{ background: '#1E293B', borderBottom: '1px solid #334155', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#E2E8F0' }}>
              <div style={{ width: '32px', height: '32px', background: '#3B82F6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '16px' }}>IV</div>
              <span style={{ fontWeight: 600, fontSize: '18px' }}>IVYAR</span>
            </Link>
            <span style={{ color: '#64748B' }}>•</span>
            <span style={{ fontWeight: 600, fontSize: '18px' }}>✈️ Aviation Tickets</span>
          </div>
          <Link href="/" style={{ padding: '8px 16px', background: '#334155', borderRadius: '6px', textDecoration: 'none', color: '#E2E8F0', fontSize: '14px' }}>
            ← Back to Portal
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', padding: '60px 24px', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px', marginBottom: '24px' }}>
            <span style={{ fontSize: '20px' }}>✈️</span>
            <span style={{ color: '#60A5FA', fontSize: '14px', fontWeight: 500 }}>AI-Powered Flight Search</span>
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 700, margin: '0 0 16px 0', background: 'linear-gradient(to right, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Find Your Perfect Flight
          </h1>
          <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '600px', margin: '0 auto' }}>
            Compare prices, find the best deals, and book with confidence using AI assistance
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ background: '#1E293B', borderRadius: '12px', padding: '32px', border: '1px solid #334155' }}>
            {/* Trip Type */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              {(['one-way', 'round-trip', 'multi-city'] as TripType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setTripType(type)}
                  style={{
                    padding: '10px 20px',
                    background: tripType === type ? '#3B82F6' : '#334155',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#E2E8F0',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    textTransform: 'capitalize',
                  }}
                >
                  {type.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Main Search Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94A3B8' }}>From</label>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="City or airport"
                  style={{ width: '100%', padding: '12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94A3B8' }}>To</label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="City or airport"
                  style={{ width: '100%', padding: '12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94A3B8' }}>Depart</label>
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px' }}
                />
              </div>

              {tripType === 'round-trip' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94A3B8' }}>Return</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    style={{ width: '100%', padding: '12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px' }}
                  />
                </div>
              )}
            </div>

            {/* Additional Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94A3B8' }}>Passengers</label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  style={{ width: '100%', padding: '12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px' }}
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94A3B8' }}>Cabin Class</label>
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value as CabinClass)}
                  style={{ width: '100%', padding: '12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px', textTransform: 'capitalize' }}
                >
                  <option value="economy">Economy</option>
                  <option value="premium-economy">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}
            >
              🔍 Search Flights
            </button>
          </div>
        </div>
      </section>

      {/* Best Deals */}
      <section style={{ padding: '40px 24px', borderTop: '1px solid #334155' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>🔥 Best Deals This Week</h2>
            <p style={{ color: '#94A3B8', margin: 0 }}>Limited time offers - book now and save up to 40%</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {BEST_DEALS.map((deal) => (
              <div key={deal.id} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#DC2626', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                  -{deal.discount}%
                </div>

                <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{deal.route}</div>
                <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '16px' }}>{deal.airline}</div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 700, color: '#3B82F6' }}>${deal.price}</span>
                  <span style={{ fontSize: '14px', color: '#64748B' }}>per person</span>
                </div>

                <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px' }}>
                  ⏰ Valid until {new Date(deal.validUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>

                <button style={{ width: '100%', padding: '12px', background: '#3B82F6', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  View Deal
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Results */}
      {showResults && (
        <section style={{ padding: '40px 24px', borderTop: '1px solid #334155' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Found {SAMPLE_FLIGHTS.length} Flights</h2>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#94A3B8' }}>Sort by:</span>
                {(['price', 'duration', 'departure', 'airline'] as SortBy[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    style={{
                      padding: '8px 16px',
                      background: sortBy === option ? '#3B82F6' : '#334155',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#E2E8F0',
                      fontSize: '13px',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {SAMPLE_FLIGHTS.map((flight) => (
                <div key={flight.id} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', gap: '24px', alignItems: 'center', marginBottom: '16px' }}>
                    {/* Departure */}
                    <div>
                      <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
                        {new Date(flight.departure).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '2px' }}>{flight.from.code}</div>
                      <div style={{ fontSize: '13px', color: '#94A3B8' }}>{flight.from.city}</div>
                    </div>

                    {/* Duration */}
                    <div style={{ textAlign: 'center', padding: '0 20px' }}>
                      <div style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>{flight.duration}</div>
                      <div style={{ height: '2px', background: '#334155', width: '100px', position: 'relative', margin: '0 auto' }}>
                        <div style={{ position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)', width: '10px', height: '10px', background: '#3B82F6', borderRadius: '50%' }}></div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '8px' }}>
                        {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                      </div>
                    </div>

                    {/* Arrival */}
                    <div>
                      <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
                        {new Date(flight.arrival).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '2px' }}>{flight.to.code}</div>
                      <div style={{ fontSize: '13px', color: '#94A3B8' }}>{flight.to.city}</div>
                    </div>

                    {/* Price & Book */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: '#3B82F6', marginBottom: '8px' }}>
                        ${flight.price}
                      </div>
                      <button style={{ padding: '12px 24px', background: '#3B82F6', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                        Select →
                      </button>
                    </div>
                  </div>

                  {/* Flight Details */}
                  <div style={{ display: 'flex', gap: '24px', paddingTop: '16px', borderTop: '1px solid #334155', fontSize: '13px', color: '#94A3B8' }}>
                    <div><strong style={{ color: '#E2E8F0' }}>{flight.airline}</strong> {flight.flightNumber}</div>
                    <div>• {flight.cabinClass.replace('-', ' ')}</div>
                    <div>• {flight.baggage}</div>
                    <div>• {flight.seatsLeft} seats left</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ background: '#1E293B', borderTop: '1px solid #334155', padding: '16px 24px', marginTop: '48px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748B' }}>
          <span>IVYAR Aviation Tickets v1.0</span>
          <span>AI-Powered Flight Search • Compare & Book</span>
        </div>
      </footer>

      {/* AI Assistant */}
      <AutopilotWidget />
    </div>
  );
}