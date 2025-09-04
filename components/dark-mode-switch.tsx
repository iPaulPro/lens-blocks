"use client";

import { Switch } from "@/registry/new-york/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const DarkModeSwitch = ({ className }: { className?: string }) => {
  const { setTheme, theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!theme || !mounted) return null;

  return (
    <Switch
      id="dark-mode-toggle"
      checked={theme === "dark"}
      onCheckedChange={checked => setTheme(checked ? "dark" : "light")}
      className={className}
    />
  );
};

export default DarkModeSwitch;
