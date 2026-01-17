import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = req.nextUrl.pathname.split("/").pop();
    const brand = await prisma.brand.findUnique({
        where: { id },
    })
    return NextResponse.json(brand)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = req.nextUrl.pathname.split("/").pop();
  const data = await req.json()
  await prisma.brand.update({
    where: { id },
    data,
    })
  return NextResponse.json({ status: "success" })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = req.nextUrl.pathname.split("/").pop();
    await prisma.brand.update({
        where: { id },
        data: { isActive: false },
    })
    return NextResponse.json({ status: "success" })
}