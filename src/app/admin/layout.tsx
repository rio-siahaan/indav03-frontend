import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard - INDA",
  description: "Admin Dashboard for INDA Application",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check authentication
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // Check admin role
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (user?.role !== "admin") {
    redirect("/"); // Redirect non-admin users to home
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 min-h-screen">{children}</main>
    </div>
  );
}
