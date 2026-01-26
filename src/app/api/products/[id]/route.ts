import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function extractIdFromUrl(req: NextRequest): string | null {
  const id = req.nextUrl.pathname.split("/").pop()
  return id || null
}

export async function GET(req: NextRequest) {
  const id = extractIdFromUrl(req)
  if (!id) {
    return NextResponse.json({ error: "Missing ID param" }, { status: 400 })
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        ageGroup: true,
        images: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const productImages = product.images.map(img => img.url);

    return NextResponse.json({
      ...product,
      brand: product.brand?.name || null,
      category: product.category?.name || null,
      ageGroup: product.ageGroup?.label || null,
      imageUrls: productImages,
    })
  } catch (error) {
    console.error("GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const id = extractIdFromUrl(req)
  if (!id) {
    return NextResponse.json({ error: "Missing ID param" }, { status: 400 })
  }

  const data = await req.json()

  try {
    let brand = await prisma.brand.findUnique({ where: { name: data.brand } })
    let category = await prisma.category.findUnique({ where: { name: data.category } })
    let ageGroup = await prisma.ageGroup.findUnique({ where: { label: data.ageGroup } })

    if (!brand) {
      brand = await prisma.brand.create({ data: { name: data.brand } })
    }

    if (!category) {
      category = await prisma.category.create({ data: { name: data.category } })
    }

    if (!ageGroup) {
      ageGroup = await prisma.ageGroup.create({ data: { label: data.ageGroup } })
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        sku: data.sku,
        price: data.price,
        discount: data.discount,
        description: data.description,
        keywords: Array.isArray(data.keywords)
          ? data.keywords
          : data.keywords.split(",").map((k: string) => k.trim()),
        isActive: true,
        metaTitle: data.metaTitle,
        metaDesc: data.metaDesc,
        brand: { connect: { id: brand.id } },
        category: { connect: { id: category.id } },
        ageGroup: { connect: { id: ageGroup.id } },
      },
    })

    if (Array.isArray(data.imageUrls)) {
      await prisma.productImage.deleteMany({ where: { productId: id } })

      await prisma.productImage.createMany({
        data: data.imageUrls.map((url: string, index: number) => ({
          productId: id,
          url,
          isPrimary: index === 0,
        })),
      })
    }

    return NextResponse.json({ status: "success", updated })
  } catch (err) {
    console.error("PUT error:", err)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const id = extractIdFromUrl(req)
  if (!id) {
    return NextResponse.json({ error: "Missing ID param" }, { status: 400 })
  }

  try {
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    })
    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
