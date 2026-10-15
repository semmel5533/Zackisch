"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: "regional_admin" | "staff";
  regionId: string;
  permissions: string[];
  isActive?: boolean;
}

interface AdminContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminUser: AdminUser | null;
  adminEmail: string;
  currentRegion: string;
  currentLocale: "de" | "en";
  setCurrentRegion: (region: string) => void;
  setCurrentLocale: (locale: "de" | "en") => void;
  login: (email: string, password?: string, otp?: string) => Promise<{ success: boolean; error?: string }>;
  initiateLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  completeLoginWithOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  resendOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  regions: any[];
  t: (key: string) => string;
}

const translations: Record<string, Record<string, string>> = {
  de: {
    regionSelectorTitle: "Region & Sprache auswählen",
    regionSelectorDescription: "Wähle deine Geschäftsregion und die Anzeigesprache",
    regionLabel: "Geschäftsregion",
    languageLabel: "Anzeigesprache",
    cancel: "Abbrechen",
    saveAndContinue: "Speichern & Fortfahren",
    overview: "Übersicht",
    organizations: "Betriebe",
    orders: "Bestellungen",
    staff: "Mitarbeiter",
    partners: "Vertriebspartner",
    newsletter: "Newsletter",
    emails: "E-Mail-Log",
    audit: "Audit-Trail",
    settings: "Einstellungen",
    logout: "Abmelden",
  },
  en: {
    regionSelectorTitle: "Select Region & Language",
    regionSelectorDescription: "Choose your operating region and language",
    regionLabel: "Operating Region",
    languageLabel: "Language",
    cancel: "Cancel",
    saveAndContinue: "Save & Continue",
    overview: "Overview",
    organizations: "Organizations",
    orders: "Orders",
    staff: "Staff",
    partners: "Partners",
    newsletter: "Newsletter",
    emails: "Email Log",
    audit: "Audit Trail",
    settings: "Settings",
    logout: "Sign out",
  },
};

const AdminContext = createContext<AdminContextType>({
  isAuthenticated: false,
  isLoading: true,
  adminUser: null,
  adminEmail: "",
  currentRegion: "de",
  currentLocale: "de",
  setCurrentRegion: () => {},
  setCurrentLocale: () => {},
  login: async () => ({ success: false }),
  initiateLogin: async () => ({ success: false }),
  completeLoginWithOtp: async () => ({ success: false }),
  resendOtp: async () => ({ success: false }),
  logout: () => {},
  regions: [],
  t: (key: string) => key,
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [currentRegion, setCurrentRegionState] = useState<string>("de");
  const [currentLocale, setCurrentLocaleState] = useState<"de" | "en">("de");
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loginMutation = useMutation((anyApi as any).admin.loginAdmin);
  const initiateLoginMutation = useMutation((anyApi as any).admin.initiateAdminLogin);
  const completeLoginMutation = useMutation((anyApi as any).admin.completeAdminLoginWithOtp);
  const resendOtpMutation = useMutation((anyApi as any).admin.resendAdminOtp);
  const regions = useQuery((anyApi as any).admin.listRegions, {}) || [];

  // Query to verify session
  const verifiedSessionUser = useQuery(
    (anyApi as any).admin.verifyAdminSession,
    sessionToken ? { sessionToken } : "skip"
  );

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("zackisch_ops_session");
      const storedRegion = localStorage.getItem("zackisch_ops_region");
      const storedLocale = localStorage.getItem("zackisch_ops_locale");

      if (storedRegion) setCurrentRegionState(storedRegion);
      if (storedLocale === "de" || storedLocale === "en") setCurrentLocaleState(storedLocale);

      if (storedToken) {
        setSessionToken(storedToken);
      } else {
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  }, []);

  // Handle session verification query response
  useEffect(() => {
    if (!sessionToken) {
      setIsLoading(false);
      return;
    }

    if (verifiedSessionUser !== undefined) {
      if (verifiedSessionUser) {
        setAdminUser(verifiedSessionUser);
        if (verifiedSessionUser.regionId) {
          setCurrentRegionState(verifiedSessionUser.regionId);
        }
      } else {
        // Invalid or expired token
        setAdminUser(null);
        setSessionToken(null);
        try {
          localStorage.removeItem("zackisch_admin_session");
        } catch {}
      }
      setIsLoading(false);
    }
  }, [verifiedSessionUser, sessionToken]);

  const setCurrentRegion = (region: string) => {
    setCurrentRegionState(region);
    try {
      localStorage.setItem("zackisch_admin_region", region);
    } catch {}
  };

  const setCurrentLocale = (locale: "de" | "en") => {
    setCurrentLocaleState(locale);
    try {
      localStorage.setItem("zackisch_admin_locale", locale);
    } catch {}
  };

  const login = async (
    email: string,
    password?: string,
    otp?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await loginMutation({ email, password, otp });
      if (res.success && res.admin) {
        setAdminUser(res.admin);
        setSessionToken(res.admin.sessionToken);
        if (res.admin.regionId) {
          setCurrentRegionState(res.admin.regionId);
        }
        try {
          localStorage.setItem("zackisch_admin_session", res.admin.sessionToken);
        } catch {}
        return { success: true };
      }
      return { success: false, error: res.error || "Anmeldung fehlgeschlagen." };
    } catch (err: any) {
      return { success: false, error: err.message || "Verbindungsfehler bei der Anmeldung." };
    }
  };

  const initiateLogin = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await initiateLoginMutation({
        email,
        password,
        locale: currentLocale,
      });
      if (res.success) {
        return { success: true };
      }
      return { success: false, error: res.error || "Anmeldung fehlgeschlagen." };
    } catch (err: any) {
      return { success: false, error: err.message || "Verbindungsfehler bei der Anmeldung." };
    }
  };

  const completeLoginWithOtp = async (
    email: string,
    otp: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await completeLoginMutation({ email, otp });
      if (res.success && res.admin) {
        setAdminUser(res.admin);
        setSessionToken(res.admin.sessionToken);
        if (res.admin.regionId) {
          setCurrentRegionState(res.admin.regionId);
        }
        try {
          localStorage.setItem("zackisch_ops_session", res.admin.sessionToken);
        } catch {}
        return { success: true };
      }
      return { success: false, error: res.error || "Bestätigungscode ungültig." };
    } catch (err: any) {
      return { success: false, error: err.message || "Verbindungsfehler bei der Überprüfung." };
    }
  };

  const resendOtp = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await resendOtpMutation({
        email,
        locale: currentLocale,
      });
      if (res.success) {
        return { success: true };
      }
      return { success: false, error: res.error || "Code konnte nicht gesendet werden." };
    } catch (err: any) {
      return { success: false, error: err.message || "Verbindungsfehler beim erneuten Senden." };
    }
  };

  const logout = () => {
    setAdminUser(null);
    setSessionToken(null);
    try {
      localStorage.removeItem("zackisch_ops_session");
    } catch {}
  };

  const t = (key: string): string => {
    return translations[currentLocale]?.[key] || translations.de[key] || key;
  };

  const isAuthenticated = !!adminUser;
  const adminEmail = adminUser?.email || "selim@zackisch.com";

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        adminUser,
        adminEmail,
        currentRegion,
        currentLocale,
        setCurrentRegion,
        setCurrentLocale,
        login,
        initiateLogin,
        completeLoginWithOtp,
        resendOtp,
        logout,
        regions,
        t,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
