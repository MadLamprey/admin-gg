import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    "Pretend Play & Dressup",
    "Building Sets & Construction",
    "DIY Kits & Activity Kits",
    "Vehicles & RC Toys",
    "Soft & Plush Toys",
    "Outdoor Play & Sports",
    "Art & Craft",
    "Games & Puzzles",
    "Dolls & Doll Houses",
    "Figures & Playsets",
    "Baby, Toddler & Preschool Learning Toys",
    "Bikes, Scooters & Rideons",
    "Bathing Toys",
    "Books",
  ]

  const ageGroups = [
    "0-2 years",
    "2-4 years",
    "4-6 years",
    "6-8 years",
    "8-12 years",
    "12 years+",
  ]


const brands = [
  "Lego",
  "Mattel",
  "Hasbro",
  "Funskool",
  "Playshifu",
  "Open Ended",
  "Mirada",
  "R for Rabbit",
  "Skillmatics",
  "Smartivity",
  "Winmagic",
  "Speedup",
  "Hotwheels",
  "ELC",
  "Reliance",
  "Whimsy",
  "Phinkerplace",
  "Kalakaram",
  "Imagimake",
  "Frank",
  "Mirana",
  "Innov8",
  "Electrobotic",
  "Nerf",
  "Winfun",
  "Wembly",
  "Fujifilm"
]

  await Promise.all(
    categories.map(name =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  )

  await Promise.all(
    ageGroups.map(label =>
      prisma.ageGroup.upsert({
        where: { label },
        update: {},
        create: { label },
      })
    )
  )

  await Promise.all(
    brands.map(name =>
      prisma.brand.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  )

  await prisma.user.upsert({
    where: { email: "admin@giggleglory.com", },
    update: {},
    create: {
      name: "Admin",
      email: "admin@giggleglory.com",
      password: "giggleglory",
      role: "SUPERADMIN",
    },
  })

  console.log("✅ Seeded categories, age groups, and brands.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
