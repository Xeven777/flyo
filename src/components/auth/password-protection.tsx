"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export function PasswordProtection({ children }: PasswordProtectionProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedHash = localStorage.getItem("flyo_access");

    if (!storedHash) {
      router.push("/login");
      return;
    }

    // Verify the hash is valid
    const isValid = storedHash.length > 0;

    if (!isValid) {
      localStorage.removeItem("flyo_access");
      router.push("/login");
      return;
    }

    setIsAuthenticated(true);
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Checking authentication...</div>
      </div>
    );
  }

  return <>{children}</>;
}
