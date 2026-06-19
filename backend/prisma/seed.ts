import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const demoEmail = 'demo@notlaristi.com';

  const existingUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (existingUser) {
    console.log('Demo kullanıcı zaten mevcut.');
    return;
  }

  const atelier = await prisma.atelier.create({
    data: {
      name: 'Not La Risti Parfüm Atölyesi',
      address: 'Tomtom Mah. İstiklal Cad. No:142',
      city: 'İstanbul',
      district: 'Beyoğlu',
      phone: '0212 345 67 89',
      email: 'info@notlaristi.com',
      taxNo: 'PRF-34-2024-0142',
    },
  });

  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.user.create({
    data: {
      email: demoEmail,
      passwordHash,
      firstName: 'Elif',
      lastName: 'Arıkan',
      role: 'admin',
      specialty: 'Parfümör',
      atelierId: atelier.id,
    },
  });

  const client1 = await prisma.client.create({
    data: {
      firstName: 'Zeynep',
      lastName: 'Kaya',
      phone: '0532 111 22 33',
      email: 'zeynep.kaya@email.com',
      preferences: 'Oud, gül, amber',
      address: 'Nişantaşı Mah. Teşvikiye Cad. No:45',
      city: 'İstanbul',
      atelierId: atelier.id,
    },
  });

  const client2 = await prisma.client.create({
    data: {
      firstName: 'Burak',
      lastName: 'Öztürk',
      phone: '0533 444 55 66',
      email: 'burak.ozturk@email.com',
      preferences: 'Narenciye, vetiver',
      address: 'Moda Mah. Bahariye Cad. No:78',
      city: 'İstanbul',
      atelierId: atelier.id,
    },
  });

  const client3 = await prisma.client.create({
    data: {
      firstName: 'Defne',
      lastName: 'Yılmaz',
      phone: '0535 777 88 99',
      email: 'defne.yilmaz@email.com',
      preferences: 'Yasemin, sandal ağacı',
      city: 'İstanbul',
      atelierId: atelier.id,
    },
  });

  const formula1 = await prisma.formula.create({
    data: {
      name: 'İstanbul Gecesi',
      topNotes: 'Bergamot, limon, biberiye',
      middleNotes: 'Gül, yasemin, iris',
      baseNotes: 'Oud, amber, misk',
      concentration: 'edp',
      description: 'Doğu-Batı karışımı imza koku',
      clientId: client1.id,
      atelierId: atelier.id,
    },
  });

  const formula2 = await prisma.formula.create({
    data: {
      name: 'Ege Esintisi',
      topNotes: 'Portakal çiçeği, mandalina',
      middleNotes: 'Lavanta, defne',
      baseNotes: 'Vetiver, sedir',
      concentration: 'edt',
      clientId: client2.id,
      atelierId: atelier.id,
    },
  });

  await prisma.ingredient.createMany({
    data: [
      { name: 'Bergamot Esansı', category: 'essential_oil', stockMl: 250, unitCost: 45, supplier: 'Grasse Aromatics', atelierId: atelier.id },
      { name: 'Türk Gülü Absolü', category: 'absolute', stockMl: 80, unitCost: 320, supplier: 'Isparta Gül Kooperatifi', atelierId: atelier.id },
      { name: 'Oud Yağı', category: 'essential_oil', stockMl: 50, unitCost: 580, supplier: 'Arabian Oils Co.', atelierId: atelier.id },
      { name: 'Etanol %96', category: 'alcohol', stockMl: 5000, unitCost: 2.5, supplier: 'Kimya Tedarik A.Ş.', atelierId: atelier.id },
      { name: 'Ambroxan', category: 'synthetic', stockMl: 200, unitCost: 65, supplier: 'Firmenich TR', atelierId: atelier.id },
    ],
  });

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86400000);
  const nextWeek = new Date(now.getTime() + 7 * 86400000);

  await prisma.appointment.createMany({
    data: [
      {
        date: tomorrow,
        duration: 60,
        type: 'consultation',
        status: 'scheduled',
        notes: 'Kişisel koku profili analizi',
        perfumerName: 'Elif Arıkan',
        clientId: client1.id,
        atelierId: atelier.id,
      },
      {
        date: tomorrow,
        duration: 45,
        type: 'blending',
        status: 'confirmed',
        notes: 'Formül karışım seansı',
        perfumerName: 'Elif Arıkan',
        clientId: client2.id,
        atelierId: atelier.id,
      },
      {
        date: nextWeek,
        duration: 30,
        type: 'pickup',
        status: 'scheduled',
        notes: '50ml EDP teslimi',
        perfumerName: 'Elif Arıkan',
        clientId: client3.id,
        atelierId: atelier.id,
      },
    ],
  });

  await prisma.order.createMany({
    data: [
      {
        productName: 'İstanbul Gecesi EDP',
        volumeMl: 50,
        concentration: 'edp',
        status: 'in_production',
        totalPrice: 4500,
        paidAmount: 2250,
        orderDate: new Date(now.getTime() - 7 * 86400000),
        deliveryDate: nextWeek,
        notes: 'Altın kapaklı şişe',
        clientId: client1.id,
        formulaId: formula1.id,
        atelierId: atelier.id,
      },
      {
        productName: 'Ege Esintisi EDT',
        volumeMl: 100,
        concentration: 'edt',
        status: 'ready',
        totalPrice: 2800,
        paidAmount: 2800,
        orderDate: new Date(now.getTime() - 14 * 86400000),
        deliveryDate: tomorrow,
        clientId: client2.id,
        formulaId: formula2.id,
        atelierId: atelier.id,
      },
      {
        productName: 'Özel Tasarım Parfüm',
        volumeMl: 30,
        concentration: 'extrait',
        status: 'quoted',
        totalPrice: 6500,
        paidAmount: 0,
        orderDate: now,
        clientId: client3.id,
        atelierId: atelier.id,
      },
    ],
  });

  console.log('Demo veriler başarıyla oluşturuldu.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
