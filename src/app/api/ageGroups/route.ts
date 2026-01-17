import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
    const ageGroups = await prisma.ageGroup.findMany()
    return NextResponse.json(ageGroups)
}