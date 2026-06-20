"use client";
import WeatherApp from "@/components/main";
import Toolbar from "@/components/Toolbar";
import BottomNavbar from "@/components/BottomNavbar";
import { Home, Settings } from "lucide-react";

export default function Page() {
  return (
  <>
    <Toolbar title="Weather" />
    <WeatherApp />
    <BottomNavbar
      items={[
        { id: "home", href: "/", icon: "home", label: "Home" },
        { id: "settings", href: "/settings", icon: "settings", label: "Settings" },
      ]}
    />
  </>
);
}
