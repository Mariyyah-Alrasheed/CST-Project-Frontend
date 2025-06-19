import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdEye, IoIosArrowDown } from "react-icons/io";
import { BsChatSquareText } from "react-icons/bs";

// import { debounce } from "lodash";
import { TablePagination } from "@/components/ui/TablePagination";
import { PaginatedTable } from "@/components/ui/PaginatedTable";
import { useDebounce } from "use-debounce";
import { CompanyDetailsModal } from "./CompanyDetailsModal";
import { MdOutlineSearch } from "react-icons/md";

export type Company = {
  id: number;
  name: string;
  commercial_number: string;
  unified_number: string;
  type: string;
};

//   type: string; // "installation" | "sales";
export default function Companies() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [selectedCompanyDetails, setSelectedCompanyDetails] =
    useState<Company | null>(null);
  const [isModelOpen, setIsModalOpen] = useState(false);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Debounce search term

  const [selectedType, setSelectedType] = useState<"installation" | "sales">(
    "installation"
  );

  const downloadCSV = (data: Company[]) => {
    const headers = [
      "اسم الشركة",
      "رقم السجل التجاري",
      "الرقم الموحد للمنشأة",
      "النوع",
    ];
    const rows = data.map((company) => [
      company.name,
      company.commercial_number,
      company.unified_number,
      company.type === "installation" ? "شركة تركيب" : "شركة مبيعات",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    // إضافة \uFEFF لضمان أن الترميز يكون UTF-8 مع BOM
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "companies.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const skip = (page - 1) * limit;

        const endpoint =
          selectedType === "installation"
            ? `${API_BASE_URL}/companies_installation`
            : `${API_BASE_URL}/companies_sales`;

        const res = await axios.get(endpoint, {
          params: {
            skip,
            limit,
            search: debouncedSearchTerm, // pass search term from input here
          },
        });

        setCompanies(res.data.data);
        setTotal(res.data.total); // Should be total for the filtered type
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };

    fetchCompanies();
  }, [page, limit, selectedType, debouncedSearchTerm, API_BASE_URL]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);
  // State to manage selected type
  const filteredCompanies = companies.filter(
    (company) =>
      company.unified_number
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase().trim()) ||
      company.name
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase().trim()) ||
      company.commercial_number
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase().trim())
  );

  const columns = [
    { title: "اسم الشركة", render: (item: Company) => item.name },
    {
      title: "رقم السجل التجاري",
      render: (item: Company) => item.commercial_number,
    },
    {
      title: "الرقم الموحد للمنشأة",
      render: (item: Company) => item.unified_number,
    },
    {
      title: "التفاصيل",
      render: (item: Company) => (
        <Button
          variant="ghost"
          className="w-0.5 h-1"
          onClick={() => {
            setSelectedCompanyDetails(item);
            setIsModalOpen(true);
            // Handle view details action here
            console.log("Selected ID:", item.id);
          }}
        >
          <IoMdEye />
        </Button>
      ),
    },
  ];

  return (
    <>
      <section className="mb-4 justify-between flex">
        <div className="text-sm text-gray-500 gap-2 flex items-center">
          <Button
            variant="default"
            active={selectedType === "sales"}
            onClick={() => setSelectedType("sales")}
          >
            شركات المبيعات
          </Button>
          <Button
            variant="default"
            active={selectedType === "installation"}
            onClick={() => setSelectedType("installation")}
          >
            شركات التركيب
          </Button>
        </div>
        <Button
          onClick={() => downloadCSV(filteredCompanies)}
          variant="outline"
          className="flex gap-1 items-center text-blue-950 font-bold"
        >
          <BsChatSquareText size={18} className="mt-0.5" />
          اصدار تقرير
          <IoIosArrowDown size={4} className="mt-0.5" />
        </Button>
      </section>

      <div className="relative mb-4 w-full max-w-md ml-auto">
        <MdOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 w-5 h-5" />
        <input
          type="text"
          className="w-full border border-gray-300  rounded px-4 py-2.5 pr-10 text-right placeholder:text-gray-500 text-sm"
          placeholder=" يمكنك البحث باسم الشركة أو رقم الشركة الموحد "
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <PaginatedTable data={filteredCompanies} columns={columns} />

      <TablePagination
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
      />
      {/* Modal for company details */}
      {/* Ensure the modal is only rendered when a company is selected */}
      {selectedCompanyDetails && (
        <CompanyDetailsModal
          company={selectedCompanyDetails}
          open={isModelOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCompanyDetails(null);
          }}
        />
      )}
    </>
  );
}
