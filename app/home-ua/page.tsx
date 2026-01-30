import AudienceCards from '@/components/home/AudienceCards';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          Для Кого IVYAR?
        </h2>
        <AudienceCards />
      </section>
    </div>
  );
}
