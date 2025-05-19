"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Optional: If you're managing cookies/sessions on the server
      });

      const data = await res.json();
      console.log(data); // Optional: Debug info

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      if (data.id) {
        localStorage.setItem("session_token", data.id);
        router.push("/dashboard");
      } else {
        setError("Failed to get user session");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
              placeholder="Enter your password"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-3 rounded-md"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          {error && <div className="text-red-500 text-center">{error}</div>}
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-400">Don&apos;t have an account?</span>
          <a href="/auth/signup" className="ml-2 text-indigo-400 hover:underline">Sign Up</a>
        </div>
      </div>
    </div>
  );
}
