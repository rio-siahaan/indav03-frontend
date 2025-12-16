import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

const STATS_CACHE_KEY = "admin:stats";
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
      cached = await redis.get(STATS_CACHE_KEY);
    } catch (e) {
      console.warn("Redis unavailable, skipping cache read:", e);
    }

    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // 1. Total Users
    const totalUsers = await prisma.user.count();

    // 2. Total Chats (Conversations)
    const totalConversations = await prisma.conversations.count();

    // 3. Total Messages
    const totalMessages = await prisma.messages.count();

    // 4. Token Usage (From Usages table - persistent even if chat deleted)
    const tokenStats = await prisma.usages.aggregate({
      _sum: {
        inputToken: true,
        outputToken: true,
      },
    });

    const totalInputTokens = tokenStats._sum.inputToken || 0;
    const totalOutputTokens = tokenStats._sum.outputToken || 0;
    const totalTokens = totalInputTokens + totalOutputTokens;

    // 5. Total Documents (from Files table)
    const totalDocuments = await prisma.files.count();

    // 6. Estimated Cost (Gemini 1.5 Flash Pricing as baseline)
    // Input: $0.075 per 1M tokens
    // Output: $0.30 per 1M tokens
    const costInput = (totalInputTokens / 1_000_000) * 0.075;
    const costOutput = (totalOutputTokens / 1_000_000) * 0.3;
    const estimatedCost = costInput + costOutput;

    // 7. Top Active Users (by Token Usage)
    const topUsersRaw = await prisma.usages.groupBy({
      by: ["userId"],
      _sum: {
        inputToken: true,
        outputToken: true,
      },
      orderBy: {
        _sum: {
          inputToken: "desc",
        },
      },
      take: 5,
    });

    // Fetch user details for the top users
    const topUsers = await Promise.all(
      topUsersRaw.map(async (u) => {
        if (!u.userId) return null;
        const user = await prisma.user.findUnique({
          where: { id: u.userId },
          select: { name: true, email: true, image: true },
        });
        return {
          ...user,
          totalTokens: (u._sum?.inputToken || 0) + (u._sum?.outputToken || 0),
        };
      })
    );

    // 8. Activity by Hour (Simple aggregation)
    // Note: Prisma doesn't support date extraction easily in groupBy without raw query.
    // For simplicity/compatibility, we'll fetch recent usages and aggregate in JS.
    // In production with large data, use prisma.$queryRaw.
    const recentUsages = await prisma.usages.findMany({
      where: {
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      select: { timestamp: true },
    });

    const activityByHour = new Array(24).fill(0);
    recentUsages.forEach((u) => {
      const hour = new Date(u.timestamp).getHours();
      activityByHour[hour]++;
    });

    const activityData = activityByHour.map((count, hour) => ({
      hour: `${hour}:00`,
      count,
    }));

    const statsData = {
      totalUsers,
      totalConversations,
      totalMessages,
      totalTokens,
      tokenBreakdown: {
        input: totalInputTokens,
        output: totalOutputTokens,
      },
      totalDocuments,
      estimatedCost,
      topUsers: topUsers.filter(Boolean),
      activityData,
    };

    // Set Cache
    // Set Cache (Fail-safe)
    try {
      await redis.set(
        STATS_CACHE_KEY,
        JSON.stringify(statsData),
        "EX",
        CACHE_TTL
      );
    } catch (e) {
      console.warn("Redis unavailable, skipping cache write:", e);
    }

    return NextResponse.json(statsData);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
