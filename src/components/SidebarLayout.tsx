// SidebarLayout.tsx
import { FileText } from "lucide-react";
import { FaRegBuilding, FaUsers } from "react-icons/fa";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { BsFilePersonFill } from "react-icons/bs";
import { RiListCheck3 } from "react-icons/ri";
import { PiFileLockBold } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import { SidebarButton } from "@/components/SidebarButton"; // Assuming you have a SidebarButton component
import { NavigationSection } from "@/components/NavigationSection";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
export type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export const AddButton = ({
  icon: Icon,
  label,
  id,
  onClick,
}: {
  icon: IconType;
  label: string;
  id: string; // Optional id for the button
  onClick?: () => void; // Optional click handler
}) => (
  <Button
    aria-label={label}
    variant="outline"
    className="justify-end text-base active:bg-blue-950 active:text-white mr-2"
    dir="rtl"
    onClick={onClick}
    id={id} // Generate an id from the label
  >
    <Icon className="h-12 w-12 ml-1" />
    {label}
  </Button>
);

type SectionKey = "companies" | "employees" | "beneficiaries" | "requests";

export default function SidebarLayout() {
  // const [activeSection, setActiveSection] = useState<SectionKey>("companies");

  const sections: Record<
    SectionKey,
    {
      icon: IconType;
      title: string;
      description: string;
    }
  > = {
    companies: {
      icon: HiOutlineBuildingOffice2,
      title: "شركات المبيعات والتركيب",
      description: "إدارة الشركات التي تقدم خدمات المبيعات والتركيب.",
    },
    employees: {
      icon: PiFileLockBold,
      title: "موظفوا المبيعات والتركيب",
      description: "إدارة موظفي المبيعات والتركيب.",
    },
    beneficiaries: {
      icon: PiFileLockBold,
      title: "المستفيدون",
      description: "إدارة المستفيدين من خدمات الشركات.",
    },
    requests: {
      icon: FileText,
      title: "طلبات الايقاف",
      description: "إدارة طلبات الإيقاف المقدمة من الشركات.",
    },
  };

  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname.replace("/", "") as SectionKey; // Get the current path without leading slash

  const currentSection = sections[path] || sections.companies; // Default to companies if path doesn't match

  return (
    <div className="flex text-right h-170" dir="rtl">
      <aside className="w-64 bg-white border-l border-gray-200 px-4 py-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-blue-950 text-right mr-4">
          قائمة الايقاف
        </h2>
        <hr className="mb-6" />
        <nav className="flex flex-col gap-3">
          <SidebarButton
            icon={FaRegBuilding}
            id="companies"
            label="شركات المبيعات والتركيب"
            onClick={() => navigate("/companies")}
            isActive={location.pathname === "/companies"}
          />
          <SidebarButton
            icon={BsFilePersonFill}
            id="amploey"
            label="موظفوا المبيعات والتركيب"
            onClick={() => navigate("employees")}
            isActive={location.pathname === "/employees"}
          />
          <SidebarButton
            icon={FaUsers}
            id="benifit"
            label="المستفيدون"
            onClick={() => navigate("beneficiaries")}
            isActive={location.pathname === "/beneficiaries"}
          />
          <SidebarButton
            icon={RiListCheck3}
            id="requests"
            label="طلبات الايقاف"
            onClick={() => navigate("requests")}
            isActive={location.pathname === "/requests"}
          />
        </nav>
      </aside>

      <div className="w-full border-gray-200 px-3 flex flex-col mb-1 gap-3">
        <NavigationSection
          icon={currentSection.icon}
          title={`${currentSection.title}`}
          description={currentSection.description}
        ></NavigationSection>
        <main className="flex-1 p-6 bg-white rounded-md shadow-lg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
