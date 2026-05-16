"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { FaApple, FaGoogle, FaMicrosoft } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    signIn(email || undefined);
    router.push("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-2 mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your NexCRM workspace to continue.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { icon: FaGoogle, label: "Google" },
          { icon: FaApple, label: "Apple" },
          { icon: FaMicrosoft, label: "Microsoft" },
        ].map(({ icon: Icon, label }) => (
          <Button
            key={label}
            variant="glass"
            type="button"
            className="h-10 text-sm"
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-foreground/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="bg-background px-3 text-muted-foreground">or</span>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-4 w-4" />}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" defaultChecked />
          <Label htmlFor="remember" className="text-xs cursor-pointer">
            Keep me signed in for 30 days
          </Label>
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Start a free trial
        </Link>
      </p>
    </motion.div>
  );
}
