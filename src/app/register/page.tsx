"use client";

import AuthForm from "../components/AuthForm";
import { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  return (
    <>
      <Toaster position="top-center" />
      <AuthForm type="register" />
    </>
  );
}
