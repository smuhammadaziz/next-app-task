"use client";

import IndustrySelector from "../components/IndustrySelector";
import { Toaster } from "react-hot-toast";

export default function DashboardPage() {
  return (
    <>
      <Toaster position="top-center" />
      <IndustrySelector />
    </>
  );
}
