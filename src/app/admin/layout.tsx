import type { Metadata } from "next";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const metadata: Metadata = {
  title: "Admin Command Center | HighTechBirds",
  description: "HighTechBirds Internal Business Command Center & Operations Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
