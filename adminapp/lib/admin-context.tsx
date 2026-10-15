"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";

// Fallback api definition for client-side queries
interface AdminContextType {
  currentRegion: string;
  setCurrentRegion: (region: string) => void;
  adminEmail: string;
  adminUser: any;
  regions: any[];
}

const AdminContext = createContext<AdminContextType>({
  currentRegion: "de",
  setCurrentRegion: () => {},
  adminEmail: "selim@zackisch.com",
  adminUser: null,
  regions: [],
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [currentRegion, setCurrentRegion] = useState("de");
  const adminEmail = "selim@zackisch.com";

  // Attempt to fetch from Convex using api path
  // Since we share the backend, queries can be called via anyApi
  const adminUser = useQuery((anyApi as any).admin.getAdminByEmail, { email: adminEmail });
  const regions = useQuery((anyApi as any).admin.listRegions, {}) || [];

  return (
    <AdminContext.Provider
      value={{
        currentRegion,
        setCurrentRegion,
        adminEmail,
        adminUser,
        regions,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
