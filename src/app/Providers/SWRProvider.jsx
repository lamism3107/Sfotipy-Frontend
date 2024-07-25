"use client";
import { SWRConfig } from "swr";

export default function SWRProvider({ children }) {
  return (
    <SWRConfig
      value={{
        // dedupingInterval: 5000,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
