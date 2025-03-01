"use client";

import AuthForm from "../components/AuthForm";
import { Toaster } from "react-hot-toast";

export default function LoginPage() {
  return (
    <>
      <Toaster position="top-center" />
      <AuthForm type="login" />
    </>
  );
}
