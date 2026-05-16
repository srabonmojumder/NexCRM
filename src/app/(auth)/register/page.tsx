"use client";

import { motion } from "framer-motion";
import { ArrowRight, Building2, Mail, User } from "lucide-react";
import { FaApple, FaGoogle, FaMicrosoft } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    signIn();
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
          Start your trial
        </h1>
        <p className="text-sm text-muted-foreground">
          Free for 14 days. No credit card required.
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
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="first">First name</Label>
            <Input id="first" placeholder="Alex" icon={<User className="h-4 w-4" />} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last">Last name</Label>
            <Input id="last" placeholder="Hunter" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            icon={<Mail className="h-4 w-4" />}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            placeholder="Acme Inc."
            icon={<Building2 className="h-4 w-4" />}
            required
          />
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Creating workspace..." : "Create workspace"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </Button>

        <p className="text-[11px] text-muted-foreground text-center">
          By continuing you agree to our{" "}
          <Link href="#" className="underline">Terms</Link> and{" "}
          <Link href="#" className="underline">Privacy Policy</Link>.
        </p>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
