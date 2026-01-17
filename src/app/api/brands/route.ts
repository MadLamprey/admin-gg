import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
    const brands = await prisma.brand.findMany()
    return NextResponse.json(brands)
}

export async function POST(req: Request) {
  const data = await req.json();
  await prisma.brand.create({
    data: {
        name: data.name,
        discount: data.discount,
    },
    })
            
  return NextResponse.json({ status: "success" })
}