import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Therapeaou - Admin Dashboard",
  description: "Therapeaou Admin Dashboard - Stay Connected. Stay Protected.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
