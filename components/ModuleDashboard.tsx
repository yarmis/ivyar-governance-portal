import Link from "next/link";

export default function ModuleDashboard() {
  return (
    <div className="min-h-screen bg-[#0a0e27] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">IVYAR Module Dashboard</h1>
        <p className="text-gray-400 mb-8">13 integrated modules</p>
        <div className="grid grid-cols-3 gap-6">
          <Link href="/us/hbs" className="bg-[#1a1f3a] p-6 rounded-lg hover:border-blue-500 border border-[#2a2f4a]">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="text-xl font-bold">HBS Module</h3>
            <p className="text-gray-400 text-sm">Core governance system</p>
          </Link>
          <Link href="/modules/procurement" className="bg-[#1a1f3a] p-6 rounded-lg hover:border-blue-500 border border-[#2a2f4a]">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold">Procurement</h3>
            <p className="text-gray-400 text-sm">AI-powered procurement</p>
          </Link>
          <Link href="/freight" className="bg-[#1a1f3a] p-6 rounded-lg hover:border-blue-500 border border-[#2a2f4a]">
            <div className="text-4xl mb-4">🚛</div>
            <h3 className="text-xl font-bold">Freight</h3>
            <p className="text-gray-400 text-sm">Logistics management</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
