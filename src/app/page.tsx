import Link from "next/link";
export default function Home() {
  return (
    <div style={{ padding: 40, background: '#0D1B2A', color: 'white', minHeight: '100vh' }}>
      <h1>IVYAR Portal</h1>
      <Link href="/client" style={{ color: '#10B9B9' }}>Go to Client Portal</Link>
    </div>
  );
}