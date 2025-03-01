import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Sample industries
  const industries = [
    { name: 'Healthcare', order: 1 },
    { name: 'Technology', order: 2 },
    { name: 'Finance', order: 3 },
    { name: 'Education', order: 4 },
    { name: 'Manufacturing', order: 5 },
    { name: 'Retail', order: 6 },
    { name: 'Real Estate', order: 7 },
    { name: 'Hospitality', order: 8 },
    { name: 'Entertainment', order: 9 },
    { name: 'Construction', order: 10 },
    { name: 'Transportation', order: 11 },
    { name: 'Agriculture', order: 12 },
    { name: 'Energy', order: 13 },
    { name: 'Telecommunications', order: 14 },
    { name: 'Life Insurance', order: 15 },
    { name: 'SaaS', order: 16 },
    { name: 'Consulting', order: 17 },
    { name: 'Legal Services', order: 18 },
    { name: 'Marketing', order: 19 },
    { name: 'Automotive', order: 20 },
  ];

  for (const industry of industries) {
    await prisma.industry.upsert({
      where: { name: industry.name },
      update: {},
      create: industry,
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });