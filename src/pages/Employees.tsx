import { useEffect, useState } from "react";
import { AddButton } from "@/components/SidebarLayout";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/ui/TablePagination";
import { CirclePlus, Search } from "lucide-react";
import { PaginatedTable } from "@/components/ui/PaginatedTable";
import { useDebounce } from "use-debounce";
import { AddEmployeeSuspend } from "@/pages/AddEmployeeSuspend";

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
  {
    title: "رقم الوظيفة",
    render: (item: SuspendedEmployee) => item.employee.job_number,
  },
];

export function Employees() {
  const [employees, setEmployees] = useState<SuspendedEmployee[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  // const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
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
          `http://127.0.0.1:8000/suspended_employees?company_type=${selectedType}&skip=${skip}&limit=${limit}&search=${debouncedSearchTerm.trim()}`
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
  }, [page, debouncedSearchTerm, skip, limit, selectedType]);

  return (
    <>
      {/* Top Bar: Type Selector and Add Button */}
      <section className="mb-6 justify-between flex">
        <div className="text-sm text-gray-500 gap-2 flex items-center">
          <Button
            variant={selectedType === "installation" ? "default" : "outline"}
            onClick={() => {
              setPage(1); // Reset to first page
              setSelectedType("installation");
            }}
          >
            موظفوا التركيب
          </Button>
          <Button
            variant={selectedType === "sales" ? "default" : "outline"}
            onClick={() => {
              setPage(1);
              setSelectedType("sales");
            }}
          >
            موظفوا المبيعات
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
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-4 py-2 pr-10 text-right placeholder:text-gray-400"
          placeholder="بحث عن موظف..."
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
