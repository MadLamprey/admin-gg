import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = req.nextUrl.pathname.split("/").pop();
    const category = await prisma.category.findUnique({
        where: { id },
    })
    return NextResponse.json(category)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = req.nextUrl.pathname.split("/").pop();
  const data = await req.json()
  await prisma.category.update({
    where: { id },
    data,
    })
  return NextResponse.json({ status: "success" })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = req.nextUrl.pathname.split("/").pop();
    await prisma.category.update({
        where: { id },
        data: { isActive: false },
    })
    return NextResponse.json({ status: "success" })
}