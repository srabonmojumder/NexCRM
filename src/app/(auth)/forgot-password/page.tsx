"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to sign in
      </Link>

      {!sent ? (
        <>
          <div className="space-y-2 mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Reset your password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your work email and we&apos;ll send you a secure reset link.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-4"
          >
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
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
            >
              Send reset link
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center py-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-bold">Check your inbox</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
            We&apos;ve sent a password reset link to your email. The link expires in 30 minutes.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-6">
            <Link href="/login">Return to sign in</Link>
          </Button>
        </div>
      )}
    </motion.div>
  );
}
