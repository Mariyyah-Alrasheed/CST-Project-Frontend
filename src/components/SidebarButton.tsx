import { Button } from "@/components/ui/button";
// import React from "react";
// import { Link } from "react-router-dom";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;
type SidebarButtonProps = {
  icon: IconType;
  label: string;
  id: string;
  onClick?: () => void;
  isActive?: boolean;
};

export const SidebarButton = ({
  icon: Icon,
  label,
  id,
  onClick,
  isActive = false,
}: SidebarButtonProps) => (
  <Button
    aria-label={label}
    variant={isActive ? "default" : "ghost"}
    className={`justify-end text-base flex-row-reverse ${
      isActive
        ? "bg-blue-950 text-white"
        : "active:bg-blue-950 active:text-white"
    }`}
    dir="rtl"
    id={id}
    onClick={onClick}
  >
    {label}
    <Icon className="ml-2 h-5 w-5" />
  </Button>
);
