"use client";
import Toolbar from "@/components/Toolbar";
import BottomNavbar from "@/components/BottomNavbar";
import SkyBackground from "@/components/Background";
import { Home, Settings } from "lucide-react";

export default function Page() {
  return (
  <>
    <Toolbar title="Settings" buttons={false} />
    <SkyBackground color="dark" />
    <BottomNavbar
      items={[
        { id: "home", href: "/", icon: "home", label: "Home" },
        { id: "settings", href: "/settings", icon: "settings", label: "Settings" },
      ]}
    />
  </>
);
}
