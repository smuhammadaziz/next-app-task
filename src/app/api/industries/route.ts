import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Create a single PrismaClient instance
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export async function GET() {
  try {
    // Basic query to test database connection
    await prisma.$queryRaw`SELECT 1`;

    // Fetch industries
    const industries = await prisma.industry.findMany({
      select: {
        id: true,
        name: true,
        order: true
      },
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json({ industries });
  } catch (error: any) {
    // Log the error for debugging
    console.error('Database error:', {
      message: error.message,
      name: error.name,
      code: error.code
    });

    // Check for specific error types
    if (error.code === 'P1001') {
      return NextResponse.json(
        { error: 'Unable to connect to the database' },
        { status: 500 }
      );
    }

    if (error.code === 'P2021') {
      return NextResponse.json(
        { error: 'The Industry table does not exist. Please run database migrations.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while fetching industries' },
      { status: 500 }
    );
  }
}