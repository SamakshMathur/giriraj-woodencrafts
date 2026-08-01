"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "giriraj-admin-mode";

type AdminModeContextValue = {
  isAdmin: boolean;
  unlock: () => void;
  logout: () => void;
};

const AdminModeContext = createContext<AdminModeContextValue | null>(null);

export function AdminModeProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(window.localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  const unlock = () => {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setIsAdmin(true);
  };

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setIsAdmin(false);
  };

  return (
    <AdminModeContext.Provider value={{ isAdmin, unlock, logout }}>
      {children}
    </AdminModeContext.Provider>
  );
}

export function useAdminMode() {
  const ctx = useContext(AdminModeContext);
  if (!ctx) throw new Error("useAdminMode must be used within AdminModeProvider");
  return ctx;
}
