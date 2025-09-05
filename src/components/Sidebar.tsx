'use client';
import React from "react";
import { usePathname } from 'next/navigation';
import SidebarLink from "./SidebarLink";
import {
  Facebook,
  Instagram,
  Users,
  LineChart as LineChartIcon,
  Sparkles,
  TestTube,
  Settings,
} from "lucide-react";

const navItems = [
  { name: 'Dashboard', href: '/', icon: LineChartIcon },
  { name: 'Instagram', href: '/instagram', icon: Instagram },
  { name: 'Facebook', href: '/facebook', icon: Facebook },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Campaigns', href: '/campaigns', icon: Sparkles },
  { name: 'A/B Tests', href: '/ab-tests', icon: TestTube },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-gray-700 bg-gray-800/80 backdrop-blur sticky top-0 h-screen hidden lg:flex flex-col">
      <div className="px-5 py-5 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow text-white font-bold">
            A0
          </div>
          <div>
            <div className="font-semibold text-white">anothezero CRM</div>
            <div className="text-xs text-gray-400">Interest-Based Lead Gen</div>
          </div>
        </div>
      </div>

      <nav className="p-3 text-sm">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <SidebarLink 
              key={item.href}
              icon={<IconComponent size={18} />} 
              label={item.name} 
              href={item.href}
              active={pathname === item.href} 
            />
          );
        })}
        <div className="mt-auto" />
      </nav>

      <div className="p-4 mt-auto">
        <div className="text-xs text-gray-400">System Health</div>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs text-gray-300">APIs nominal</span>
        </div>
        <SidebarLink 
          icon={<Settings size={16} />} 
          label="Settings" 
          href="/settings"
          active={pathname === '/settings'}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-700 text-white py-2 text-sm hover:bg-gray-600 transition"
        />
      </div>
    </aside>
  );
};

export default Sidebar;