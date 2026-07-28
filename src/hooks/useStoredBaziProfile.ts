"use client";

import { useEffect, useState } from "react";
import {
  readStoredBaziProfile,
  type StoredBaziProfile,
} from "@/lib/bazi/storage";

export function useStoredBaziProfile(typeId: string) {
  const [state, setState] = useState<{
    profile?: StoredBaziProfile;
    ready: boolean;
  }>({ ready: false });

  useEffect(() => {
    setState({
      profile: readStoredBaziProfile(typeId),
      ready: true,
    });
  }, [typeId]);

  return state;
}
