export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>🚀 IVYAR DDR Module</h1>
      <p>Database Status: Checking...</p>
      <p>Next steps:</p>
      <ol>
        <li>Run migrations: npm run db:migrate</li>
        <li>Open Prisma Studio: npm run db:studio</li>
        <li>Start building APIs in src/app/api/</li>
      </ol>
    </main>
  )
}
