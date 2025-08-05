"use client";

import { Switch } from "@/registry/new-york/ui/switch";
import { useTheme } from "next-themes";

const DarkModeSwitch = ({ className }: { className: string }) => {
  const { setTheme, theme } = useTheme();

  if (!theme) return null;

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
