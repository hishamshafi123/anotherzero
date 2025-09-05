'use client';
import React from "react";
import Link from 'next/link';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  className?: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, href = '#', active, className }) => {
  const baseClasses = className || `w-full flex items-center gap-3 px-4 py-2 rounded-xl mb-1 transition text-left ${
    active ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-300"
  }`;

  return (
    <Link href={href} className={baseClasses}>
      <span className="shrink-0">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default SidebarLink;
