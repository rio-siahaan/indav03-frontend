import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!conversationId) {
    return NextResponse.json(
      { error: "Conversation ID required" },
      { status: 400 }
    );
  }

  try {
    // Verify ownership of conversation
    const conversation = await prisma.conversations.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const messages = await prisma.messages.findMany({
      where: {
        conversationId: conversationId,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { conversationId, role, message, inputToken, outputToken } = body;

    // Verify ownership
    const conversation = await prisma.conversations.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const newMessage = await prisma.messages.create({
      data: {
        conversationId,
        role,
        message,
        inputToken: inputToken || 0,
        outputToken: outputToken || 0,
      },
    });

    // --- LOG USAGE SEPARATELY ---
    // This ensures stats are kept even if chat is deleted
    if ((inputToken && inputToken > 0) || (outputToken && outputToken > 0)) {
      try {
        await prisma.usages.create({
          data: {
            user: { connect: { id: session.user.id } },
            selectedModel: "gemini-2.5-flash", // Hardcoded for now, can be dynamic later
            responseTime: 0, // We can track this later if needed
            inputToken: inputToken || 0,
            outputToken: outputToken || 0,
          },
        });
      } catch (usageError) {
        console.error("Failed to log usage:", usageError);
        // Don't fail the request if usage logging fails
      }
    }

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
