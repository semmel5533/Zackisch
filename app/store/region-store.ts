import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_REGION, detectBrowserRegion, SUPPORTED_REGIONS } from "@/lib/regions";

interface RegionState {
  region: string;
  setRegion: (region: string) => void;
}

export const useRegionStore = create<RegionState>()(
  persist(
    (set) => ({
      region: typeof window !== "undefined" ? detectBrowserRegion() : DEFAULT_REGION,
      setRegion: (region) => {
        if (SUPPORTED_REGIONS[region]) {
          set({ region });
          if (typeof document !== "undefined") {
            document.cookie = `zackisch_region=${region}; path=/; max-age=31536000; SameSite=Lax`;
          }
        }
      },
    }),
    {
      name: "zackisch-region-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
