import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding HBS Autopilot v8...');

  // Feature flag
  await prisma.featureFlag.upsert({
    where: { key: 'HBS_AUTOPILOT_V8' },
    update: {},
    create: {
      key: 'HBS_AUTOPILOT_V8',
      enabled: false,
      rolloutStrategy: { type: 'PERCENTAGE', percentage: 0 },
      createdBy: 'system',
    },
  });

  // Circuit breaker
  const existing = await prisma.circuitBreakerState.findFirst();
  if (!existing) {
    await prisma.circuitBreakerState.create({
      data: {
        state: 'CLOSED',
        failureCount: 0,
        successCount: 0,
      },
    });
  }

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
