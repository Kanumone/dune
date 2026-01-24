import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - Карта Сугробов",
  description: "Admin panel for managing locations",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
