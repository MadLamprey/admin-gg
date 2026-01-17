import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories)
}

export async function POST(req: Request) {
  const data = await req.json();
  await prisma.category.create({
    data: {
        name: data.name
    },
    })
            
  return NextResponse.json({ status: "success" })
}