"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    navigator.serviceWorker.register("/sw.js");
  }, []);

  return null;
}