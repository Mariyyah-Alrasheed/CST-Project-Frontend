import { Button } from "@/components/ui/button";
import axios from "axios";
import { FileText, Search, Eye } from "lucide-react";
import { useEffect, useState } from "react";
// import { debounce } from "lodash";
import { TablePagination } from "@/components/ui/TablePagination";
import { PaginatedTable } from "@/components/ui/PaginatedTable";
import { useDebounce } from "use-debounce";
import { CompanyDetailsModal } from "./CompanyDetailsModal";

export type Company = {
  id: number;
  name: string;
  commercial_number: string;
  unified_number: string;
  type: string;
};

//   type: string; // "installation" | "sales";
export default function Companies() {
  const [selectedCompanyDetails, setSelectedCompanyDetails] =
    useState<Company | null>(null);
  const [isModelOpen, setIsModalOpen] = useState(false);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(4);
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
            ? "http://127.0.0.1:8000/companies_installation"
            : "http://127.0.0.1:8000/companies_sales";

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
  }, [page, limit, selectedType, debouncedSearchTerm]);

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
          className="flex items-center gap-1"
          onClick={() => {
            setSelectedCompanyDetails(item);
            setIsModalOpen(true);
            // Handle view details action here
            console.log("Selected ID:", item.id);
          }}
        >
          <Eye size={16} />
        </Button>
      ),
    },
  ];

  return (
    <>
      <section className="mb-6 justify-between flex">
        <div className="text-sm text-gray-500 gap-2 flex items-center">
          <Button
            variant={selectedType === "installation" ? "default" : "outline"}
            onClick={() => setSelectedType("installation")}
          >
            شركات التركيب
          </Button>
          <Button
            variant={selectedType === "sales" ? "default" : "outline"}
            onClick={() => setSelectedType("sales")}
          >
            شركات المبيعات
          </Button>
        </div>
        <Button
          onClick={() => downloadCSV(filteredCompanies)}
          variant="outline"
          className="flex gap-1 items-center"
        >
          <FileText size={18} />
          اصدار تقرير
        </Button>
      </section>

      <div className="relative mb-4 w-full max-w-md ml-auto">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2  text-gray-500" />
        <input
          type="text"
          className="w-full border-1 border-gray-300 rounded px-4 py-2 pr-10 text-right placeholder:text-gray-400"
          placeholder="بحث عن شركة..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mx-auto w-full">
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
      </div>
    </>
  );
}
