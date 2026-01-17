import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as XLSX from "xlsx"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || ""
    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content-type" }, { status: 400 })
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(Buffer.from(buffer), { type: "buffer" })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet)

    const entity = request.nextUrl.pathname.split("/").pop();
    console.log(entity);

    switch (entity) {
      case "brands":
        await Promise.all(rows.map(async (row: any) => {
          await prisma.brand.upsert({
            where: { name: row.name },
            update: { discount: row.discount || 0, isActive: true },
            create: { name: row.name, discount: row.discount || 0 },
          })
        }))
        break

      case "categories":
        await Promise.all(rows.map(async (row: any) => {
          await prisma.category.upsert({
            where: { name: row.name },
            update: { isActive: true },
            create: { name: row.name },
          })
        }))
        break

      case "ageGroups":
        await Promise.all(rows.map(async (row: any) => {
          await prisma.ageGroup.upsert({
            where: { label: row.label },
            update: { isActive: true },
            create: { label: row.label },
          })
        }))
        break

      case "products":
        await Promise.all(rows.map(async (row: any) => {
            const brand = await prisma.brand.findUnique({ where: { name: row.brand } });
            if (!brand) {
                throw new Error(`Brand not found: ${row.brand}`);
            }
            const category = await prisma.category.findUnique({ where: { name: row.category } });
            if (!category) {
                throw new Error(`Category not found: ${row.category}`);
            }
            const ageGroup = await prisma.ageGroup.findUnique({ where: { label: row.ageGroup } });
            if (!ageGroup) {
                throw new Error(`Age Group not found: ${row.ageGroup}`);
            }

          await prisma.product.upsert({
            where: { sku: row.sku },
            update: {
              name: row.name,
              price: row.price,
              discount: row.discount || 0,
              description: row.description || "",
              keywords: row.keywords?.split(",").map((k: string) => k.trim()) || [],
              brandId: brand.id,
              categoryId: category.id,
              ageGroupId: ageGroup.id,
            },
            create: {
              name: row.name,
              sku: row.sku,
              price: row.price,
              discount: row.discount || 0,
              description: row.description || "",
              keywords: row.keywords?.split(",").map((k: string) => k.trim()) || [],
              brandId: brand.id,
              categoryId: category.id,
              ageGroupId: ageGroup.id,
            },
          })
        }))
        break

      default:
        return NextResponse.json({ error: "Unsupported entity" }, { status: 400 })
    }

    return NextResponse.json({ status: "success", count: rows.length })
  } catch (err) {
    console.error("Upload failed:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
