"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AdminModeContextValue = {
  isAdmin: boolean;
  /** True until the initial session check finishes. */
  loading: boolean;
  /** Verifies the password against the server and sets the admin cookie on success. */
  unlock: (password: string) => Promise<boolean>;
  logout: () => void;
};

const AdminModeContext = createContext<AdminModeContextValue | null>(null);

export function AdminModeProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => setIsAdmin(!!data.isAdmin))
      .catch(() => setIsAdmin(false))
      .finally(() => setLoading(false));
  }, []);

  const unlock = async (password: string) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
  };

  return (
    <AdminModeContext.Provider value={{ isAdmin, loading, unlock, logout }}>
      {children}
    </AdminModeContext.Provider>
  );
}

export function useAdminMode() {
  const ctx = useContext(AdminModeContext);
  if (!ctx) throw new Error("useAdminMode must be used within AdminModeProvider");
  return ctx;
}
