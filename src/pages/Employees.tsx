import { useEffect, useState } from "react";
import { AddButton } from "@/components/SidebarLayout";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/ui/TablePagination";
import { CirclePlus } from "lucide-react";
import { PaginatedTable } from "@/components/ui/PaginatedTable";
import { useDebounce } from "use-debounce";
import { AddEmployeeSuspend } from "@/pages/AddEmployeeSuspend";
import { MdOutlineSearch } from "react-icons/md";
// import { IoMdEye } from "react-icons/io";
import { PiLockKeyOpenFill } from "react-icons/pi";

export type SuspendedEmployee = {
  id: number;
  suspended_at: string;
  employee: {
    id: number;
    name: string;
    national_id: string;
    job_number: string;
    nationality: string;
    phone: string;
    company: {
      id: number;
      name: string;
    };
  };
};

type SelectedEmployeeType = "installation" | "sales";

const columns = [
  {
    title: "اسم الموظف",
    render: (item: SuspendedEmployee) => item.employee.name,
  },
  {
    title: "اسم الشركة",
    render: (item: SuspendedEmployee) => item.employee.company.name,
  },
  {
    title: "رقم الهوية|الاقامة",
    render: (item: SuspendedEmployee) => item.employee.national_id,
  },
  // {
  //   title: "رقم الوظيفة",
  //   render: (item: SuspendedEmployee) => item.employee.job_number,
  // },
  {
    title: " الاجراءات",
    render: () => (
      <Button
        variant="ghost"
        className="w-0.5 h-1"
        // Handle view details action here
      >
        <PiLockKeyOpenFill />
      </Button>
    ),
  },
];

export function Employees() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [employees, setEmployees] = useState<SuspendedEmployee[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  // const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(4);
  const [selectedType, setSelectedType] =
    useState<SelectedEmployeeType>("installation");

  const skip = (page - 1) * limit;

  // Debounce effect for search input
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/suspended_employees?company_type=${selectedType}&skip=${skip}&limit=${limit}&search=${debouncedSearchTerm.trim()}`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setEmployees(data.data);
        setTotal(data.total);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    fetchEmployees();
  }, [page, debouncedSearchTerm, skip, limit, selectedType, API_BASE_URL]);

  return (
    <>
      {/* Top Bar: Type Selector and Add Button */}
      <section className="mb-4 justify-between flex">
        <div className="text-sm text-gray-500 gap-5 flex items-center">
          <Button
            variant="default"
            active={selectedType === "sales"}
            onClick={() => {
              setPage(1);
              setSelectedType("sales");
            }}
          >
            موظفوا شركات المبيعات
          </Button>
          <Button
            variant="default"
            active={selectedType === "installation"}
            onClick={() => {
              setPage(1); // Reset to first page
              setSelectedType("installation");
            }}
          >
            موظفوا شركات التركيب
          </Button>
        </div>
        <AddButton
          id="add"
          icon={CirclePlus}
          onClick={() => setShowAddEmployeeModal(true)}
          label=" اضافة"
        />
        {showAddEmployeeModal && (
          <AddEmployeeSuspend
            onClose={() => setShowAddEmployeeModal(false)}
            selectedType={selectedType}
          />
        )}
      </section>

      {/* Search Input */}

      <div className="relative mb-4 w-full max-w-md ml-auto">
        <MdOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 w-5 h-5" />
        <input
          type="text"
          className="w-full border border-gray-300  rounded px-4 py-2.5 pr-10 text-right placeholder:text-gray-500 text-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <PaginatedTable data={employees} columns={columns} />

      {/* Pagination */}
      <TablePagination
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
      />
    </>
  );
}
