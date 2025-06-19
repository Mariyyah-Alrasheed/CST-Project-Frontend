import { AddButton } from "@/components/SidebarLayout";
import AddSuspendedModal from "@/pages/AddSuspendedModal";
import { PaginatedTable } from "@/components/ui/PaginatedTable";
import { TablePagination } from "@/components/ui/TablePagination";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { MdOutlineSearch } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { PiLockKeyOpenFill } from "react-icons/pi";

type SuspendedBeneficiaryType = {
  beneficiary_id: string;
  suspended_at: string;
  id: number;
  beneficiary: {
    id: number;
    name: string;
    national_id: string;
    phone: string;
    nationality: string;
  };
};

export function SuspendedBeneficiary() {
  const columns = [
    {
      title: "اسم المستفيد",
      render: (item: SuspendedBeneficiaryType) => item.beneficiary.name,
    },
    {
      title: "رقم الهوية الوطنية",
      render: (item: SuspendedBeneficiaryType) => item.beneficiary.national_id,
    },
    // {
    //   title: "تاريخ الإيقاف",
    //   render: (item: SuspendedBeneficiaryType) => item.suspended_at,
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
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term
  const [showAddModal, setShowAddModal] = useState(false);

  const skip = (page - 1) * limit;

  // State to hold suspended beneficiaries
  const [suspendedBeneficiaries, setSuspendedBeneficiaries] = useState<
    SuspendedBeneficiaryType[]
  >([]);

  useEffect(() => {
    const fetchSuspendedBeneficiaries = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/suspended_beneficiaries?skip=${skip}&limit=${limit}&search=${debouncedSearchTerm.trim()}`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const response = await res.json();

        setSuspendedBeneficiaries(response.data); // Correctly set the array
        setTotal(response.total); // Set total for pagination
      } catch (err) {
        console.error("Error fetching suspended beneficiaries:", err);
      }
    };

    fetchSuspendedBeneficiaries();
  }, [skip, limit, debouncedSearchTerm, page, API_BASE_URL]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  return (
    <>
      <div className="flex justify-between mb-4">
        {/* Search Input */}
        <div className="relative mb-4 w-full max-w-md ml-auto">
          <MdOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 w-5 h-5" />
          <input
            type="text"
            className="w-full border border-gray-300  rounded px-4 py-2.5 pr-10 text-right placeholder:text-gray-500 text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <AddButton
          id="add"
          onClick={() => setShowAddModal(true)}
          icon={CirclePlus}
          label=" اضافة"
        />
      </div>
      {showAddModal && (
        <AddSuspendedModal onClose={() => setShowAddModal(false)} />
      )}
      <PaginatedTable data={suspendedBeneficiaries} columns={columns} />

      <TablePagination
        page={page}
        limit={limit}
        total={total}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </>
  );
}
