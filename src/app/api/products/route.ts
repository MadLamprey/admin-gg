import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const products = await prisma.product.findMany({
    include: {
      brand: true,
      category: true,
      ageGroup: true,
    },
  });

  return NextResponse.json(
    products.map((p: any) => ({
      ...p,
      brand: p.brand?.name || null,
      category: p.category?.name || null,
      ageGroup: p.ageGroup?.label || null,
    }))
  );
}

export async function POST(req: Request) {
  const data = await req.json();
  let brand = await prisma.brand.findUnique({ where: { name: data.brand } });
  let category = await prisma.category.findUnique({ where: { name: data.category } });
  let ageGroup = await prisma.ageGroup.findUnique({ where: { label: data.ageGroup } });

  if (!brand) {
    brand = await prisma.brand.create({ data: { name: data.brand } })
  }

  if (!category) {
    category = await prisma.category.create({ data: { name: data.category } })
  }

  if (!ageGroup) {
    ageGroup = await prisma.ageGroup.create({ data: { label: data.ageGroup } })
  }

  await prisma.product.create({
    data: {
        name: data.name,
        sku: data.sku,
        price: data.price,
        discount: data.discount,
        isActive: true,
        keywords: data.keywords.split(",").map((k: string) => k.trim()),
        metaTitle: data.metaTitle,
        metaDesc: data.metaDesc,
        brand: {
        connect: { id: brand.id },
        },
        category: {
        connect: { id: category.id },
        },
        ageGroup: {
        connect: { id: ageGroup.id },
        }
    },
    })
            
  return NextResponse.json({ status: "success" })
}