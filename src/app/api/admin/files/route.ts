import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

const FILES_CACHE_KEY = "admin:files";
const CACHE_TTL = 300; // 5 minutes

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (user?.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden - Admin access required" },
      { status: 403 }
    );
  }

  try {
    // 1. Try Cache
    let cached = null;
    try {
      cached = await redis.get(FILES_CACHE_KEY);
    } catch (e) {
      console.warn("Redis unavailable, skipping cache read:", e);
    }

    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // 2. Fetch DB
    const files = await prisma.files.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    // 3. Set Cache
    try {
      await redis.set(FILES_CACHE_KEY, JSON.stringify(files), "EX", CACHE_TTL);
    } catch (e) {
      console.warn("Redis unavailable, skipping cache write:", e);
    }

    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (user?.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden - Admin access required" },
      { status: 403 }
    );
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    let name, type, bpsVarId, bpsYear, bpsSubject;

    if (contentType.includes("application/json")) {
      const json = await req.json();
      name = json.name;
      type = json.type || "bps";
      bpsVarId = json.bpsVarId;
      bpsYear = json.bpsYear;
      bpsSubject = json.bpsSubject;
    } else {
      const formData = await req.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json(
          { error: "No file uploaded" },
          { status: 400 }
        );
      }
      name = file.name;
      type = "upload";
    }

    // In a real app, you would upload this file to S3/Supabase Storage
    // and trigger an embedding job (RAG).
    // For this demo, we'll just save the metadata to the DB.

    const newFile = await prisma.files.create({
      data: {
        name,
        type,
        bpsVarId: bpsVarId ? parseInt(String(bpsVarId)) : null,
        bpsYear: bpsYear ? parseInt(String(bpsYear)) : null,
        bpsSubject,
      },
    });

    // Invalidate Cache
    try {
      await redis.del(FILES_CACHE_KEY);
    } catch (e) {
      console.warn("Redis unavailable, skipping cache invalidation:", e);
    }

    return NextResponse.json(newFile);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (user?.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden - Admin access required" },
      { status: 403 }
    );
  }

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  try {
    await prisma.files.delete({
      where: { id },
    });

    // Invalidate Cache
    // Invalidate Cache
    try {
      await redis.del(FILES_CACHE_KEY);
    } catch (e) {
      console.warn("Redis unavailable, skipping cache invalidation:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
