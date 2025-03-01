import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

const AuthForm = ({ type }: { type: "login" | "register" }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        type === "login" ? "/api/auth/login" : "/api/auth/register";
      await axios.post(endpoint, { email, password });
      toast.success(type === "login" ? "Logged in!" : "Account created!");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      const message = error.response?.data?.error || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-gray-800 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            {type === "login" ? "Sign in to your account" : "Create an account"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="relative block w-full rounded-md border-0 bg-gray-700 p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-md border-0 bg-gray-700 p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-purple-600 px-3 py-3 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-70"
            >
              {loading
                ? "Processing..."
                : type === "login"
                ? "Sign in"
                : "Sign up"}
            </button>
          </div>

          <div className="text-center text-sm text-gray-400">
            {type === "login" ? (
              <>
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="font-medium text-purple-400 hover:text-purple-300"
                >
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-purple-400 hover:text-purple-300"
                >
                  Sign in
                </a>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
