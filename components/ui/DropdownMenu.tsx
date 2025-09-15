"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type DropdownMenuProps = {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
};

export function DropdownMenu({
  trigger,
  children,
  align = "right",
  className = "",
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const alignmentClasses = {
    left: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    right: "right-0",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${alignmentClasses[align]}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

type DropdownMenuItemProps = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  icon?: ReactNode;
};

export function DropdownMenuItem({
  children,
  onClick,
  href,
  className = "",
  icon,
}: DropdownMenuItemProps) {
  const baseClasses = "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left";
  
  const content = (
    <>
      {icon && <span className="mr-2 w-5 h-5">{icon}</span>}
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${className}`}
        role="menuitem"
        tabIndex={-1}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      role="menuitem"
      tabIndex={-1}
    >
      {content}
    </button>
  );
}

type DropdownMenuLabelProps = {
  children: ReactNode;
  className?: string;
};

export function DropdownMenuLabel({ children, className = "" }: DropdownMenuLabelProps) {
  return (
    <div className={`px-4 py-2 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

type DropdownMenuSeparatorProps = {
  className?: string;
};

export function DropdownMenuSeparator({ className = "" }: DropdownMenuSeparatorProps) {
  return <div className={`border-t border-gray-100 my-1 ${className}`} />;
}
