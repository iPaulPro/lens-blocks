"use client";

import { Switch } from "@/registry/new-york/ui/switch";
import { useEffect, useState } from "react";

const DarkModeSwitch = ({ className }: { className: string }) => {
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("darkMode") === "true",
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode ? "true" : "false");
  }, [darkMode]);

  return <Switch id="dark-mode-toggle" checked={darkMode} onCheckedChange={setDarkMode} className={className} />;
};

export default DarkModeSwitch;
