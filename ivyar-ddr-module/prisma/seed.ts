import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

function hashString(str: string): string {
  return createHash('sha256').update(str).digest('hex');
}

async function main() {
  console.log('🌱 Starting seed...');

  // 1. CREATE TENANT (UKRAINE)
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Ukraine Ministry of Veterans Affairs',
      countryCode: 'UKR',
      active: true,
      settings: { language: 'uk', currency: 'UAH' }
    }
  });
  console.log('✅ Tenant created');

  // 2. CREATE 5 VETERANS
  const veteranData = [
    { name: 'Олександр Петренко', combat: 450, service: 3, disability: 0, awards: ['Order of Courage'] },
    { name: 'Дмитро Коваленко', combat: 380, service: 2, disability: 2, awards: ['Medal For Courage'] },
    { name: 'Андрій Шевченко', combat: 520, service: 4, disability: 3, awards: ['Hero of Ukraine'] },
    { name: 'Володимир Мельник', combat: 200, service: 1, disability: 0, awards: [] },
    { name: 'Сергій Іваненко', combat: 600, service: 5, disability: 4, awards: ['Order of Bohdan Khmelnytsky'] }
  ];

  const participants = [];
  for (const vet of veteranData) {
    const p = await prisma.participant.create({
      data: {
        tenantId: tenant.id,
        nameHash: hashString(vet.name),
        status: 'ACTIVE',
        registrationDate: new Date(),
        createdBy: 'seed'
      }
    });
    participants.push({ id: p.id, ...vet });
    console.log(`✅ Veteran: ${vet.name}`);
  }

  // 3. CREATE 5 LAND PARCELS
  for (let i = 0; i < 5; i++) {
    await prisma.landParcel.create({
      data: {
        tenantId: tenant.id,
        cadastralNumber: `UA-CHE-2024-${String(i + 1).padStart(5, '0')}`,
        oblast: 'Chernihiv',
        raion: 'Nizhyn',
        hromada: 'Nizhyn Hromada',
        coordinates: { type: 'Polygon', coordinates: [[[30.5, 50.4], [30.6, 50.4], [30.6, 50.5], [30.5, 50.5], [30.5, 50.4]]] },
        area: 8 + i,
        landUseType: 'AGRICULTURAL',
        status: 'AVAILABLE',
        ownershipType: 'STATE',
        marketValue: (8 + i) * 500000
      }
    });
  }
  console.log('✅ 5 Land Parcels created');

  // 4. CREATE VETERAN GRANTS
  for (let i = 0; i < 3; i++) {
    const vet = participants[i];
    let score = vet.combat > 0 ? 100 : 0;
    if (vet.disability > 0) score += 50 + vet.disability * 10;
    score += vet.awards.length * 15;

    await prisma.veteranLandGrant.create({
      data: {
        tenantId: tenant.id,
        participantId: vet.id,
        priorityLevel: 'COMBAT_VETERAN',
        priorityScore: score,
        combatDays: vet.combat,
        serviceYears: vet.service,
        disabilityLevel: vet.disability,
        awards: vet.awards,
        status: 'APPROVED',
        conditions: { mustFarmYears: 5, noResaleYears: 10 }
      }
    });
  }
  console.log('✅ 3 Veteran Grants created');

  console.log('🎉 SEED COMPLETE!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
