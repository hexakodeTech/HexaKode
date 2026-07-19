import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DemoTable from "@/components/admin/DemoTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Consultations | HexaKode Console",
  description: "Administrative tracker for scheduling free consultations and scoping calls.",
};

export default function AdminDemosPage() {
  return (
    <AdminLayout>
      <DemoTable />
    </AdminLayout>
  );
}
