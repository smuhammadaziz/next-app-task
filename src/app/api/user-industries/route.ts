import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get user selected industries
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      
      const userIndustries = await prisma.userIndustry.findMany({
        where: { userId: decoded.id },
        include: { industry: true }
      });

      return NextResponse.json({ 
        userIndustries: userIndustries.map(ui => ui.industry)
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error fetching user industries:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user industries" },
      { status: 500 }
    );
  }
}

// Save user selected industries
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { industryIds } = body;

    if (!industryIds || !Array.isArray(industryIds)) {
      return NextResponse.json(
        { error: "industryIds array is required" },
        { status: 400 }
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      
      // Delete existing relations
      await prisma.userIndustry.deleteMany({
        where: { userId: decoded.id }
      });

      // Create new relations
      await Promise.all(
        industryIds.map(industryId =>
          prisma.userIndustry.create({
            data: {
              userId: decoded.id,
              industryId,
            },
          })
        )
      );

      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error saving user industries:", error);
    return NextResponse.json(
      { error: "An error occurred while saving user industries" },
      { status: 500 }
    );
  }
}