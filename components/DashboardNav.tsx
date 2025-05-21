"use client";
import { Dispatch, SetStateAction } from 'react';
import TwitterConnectButton from '@/components/TwitterConnectButton';
import { Navbar, NavBody, NavItems, NavbarLogo, MobileNav, MobileNavHeader, MobileNavToggle, MobileNavMenu } from "@/components/ui/resizable-navbar";

interface DashboardNavProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  onTwitterStatusChange: (connected: boolean) => void;
}

export default function DashboardNav({ isMobileMenuOpen, setIsMobileMenuOpen, onTwitterStatusChange }: DashboardNavProps) {
  return (
    <Navbar className="fixed top-0 bg-black/80 backdrop-blur-lg border-b border-gray-800/50 z-50">
      <NavBody>
        <NavbarLogo />
        <NavItems items={[
          { name: "Home", link: "/" },
          { name: "Dashboard", link: "/dashboard" },
          { name: "Generate", link: "/generate-form" },
        ]} />
        <div className="relative z-20 flex items-center gap-3">
          <TwitterConnectButton onStatusChange={onTwitterStatusChange} />
        </div>
      </NavBody>
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle 
            isOpen={isMobileMenuOpen} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          />
        </MobileNavHeader>
        <MobileNavMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          className="bg-black/95 border-gray-800"
        >
          <a href="/" className="w-full px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-md transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <a href="/dashboard" className="w-full px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-md transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</a>
          <a href="/generate-form" className="w-full px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-md transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Generate</a>
          <div className="mt-4 flex w-full px-4">
            <TwitterConnectButton onStatusChange={onTwitterStatusChange} />
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
