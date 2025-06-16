import type { IconType } from "@/components/SidebarLayout";

export const NavigationSection = ({
  icon: Icon,
  title,
  description,
}: {
  icon?: IconType;
  title: string;
  description?: string;
}) => (
  <nav
    className="flex flex-row items-center justify-between gap-3 bg-gray-50 p-2 rounded-md shadow-sm pr-6 py-5"
    dir="rtl"
  >
    <div className="flex flex-col gap-1 text-right">
      <h1 className="text-lg font-semibold">{title}</h1>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
    {Icon && <Icon className="h-10 w-10 text-blue-950" />}
  </nav>
);
