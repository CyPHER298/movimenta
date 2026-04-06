"use client";

import { LogoPositivo } from "../Logo/LogoPositivo";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import { AnimatePresence } from "motion/react";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center bg-(--branco) px-8 py-4 border-b border-gray-300 shadow-sm">
        <LogoPositivo direction="horizontal" />
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="cursor-pointer rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
