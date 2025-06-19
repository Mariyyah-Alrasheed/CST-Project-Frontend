import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PaginatedTable } from "@/components/ui/PaginatedTable";
import { TablePagination } from "@/components/ui/TablePagination";
import type { Company } from "./Companies";
import { useEffect, useState } from "react";

export function CompanyDetailsModal({
  company,
  open,
  onClose,
}: {
  company: Company | null;
  open: boolean;
  onClose: () => void;
}) {
  type ServiceProviderType = {
    id: number;
    name: string;
    id_number: string;
    code: string;
  };

  type CompanyEmployee = {
    id: number;
    name: string;
    national_id: string;
    job_number: string;
    nationality: string;
    phone: string;
  };
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [serviceProviders, setServiceProviders] = useState<
    ServiceProviderType[]
  >([]);
  const [companyEmployees, setCompanyEmployees] = useState<CompanyEmployee[]>(
    []
  );
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const skip = (page - 1) * limit;

  // Fetch service providers
  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/service_providers`);
        if (!res.ok) throw new Error("Network response was not ok");
        const response = await res.json();
        setServiceProviders(response);
      } catch (err) {
        console.error("Error fetching service providers:", err);
      }
    };
    fetchServiceProviders();
  }, [API_BASE_URL]);

  // Fetch company employees with pagination
  useEffect(() => {
    if (!company) return;
    const fetchEmployees = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/company_employees?company_id=${company.id}&skip=${skip}&limit=${limit}`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const response = await res.json();
        setCompanyEmployees(response.data);
        setTotal(response.total);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, [company, skip, limit, page, API_BASE_URL]);

  const columns = [
    { title: "اسم الموظف", render: (item: CompanyEmployee) => item.name },
    {
      title: "رقم الوظيفة",
      render: (item: CompanyEmployee) => item.job_number,
    },
    {
      title: "رقم الهوية",
      render: (item: CompanyEmployee) => item.national_id,
    },
    { title: "الجنسية", render: (item: CompanyEmployee) => item.nationality },
    { title: "رقم الجوال", render: (item: CompanyEmployee) => item.phone },
  ];

  return (
    <Dialog open={open && !!company} onOpenChange={onClose}>
      {company && (
        <DialogContent dir="rtl" className="px-9">
          <DialogHeader
            className="mb-4"
            // style={{ boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.15)" }}
          >
            <DialogTitle className="text-lg font-bold text-blue-950">
              {company.name}
            </DialogTitle>
            <DialogDescription className="text-right">
              {company.type === "installation" ? "شركة تركيب" : "شركة مبيعات"}
            </DialogDescription>
          </DialogHeader>

          <h2 className="text-right font-semibold mb-6 text-lg text-black-800">
            بيانات الشركة
          </h2>

          <div className="m-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-right w-8/12">
            <div>
              <div className="mb-3">اسم الشركة</div>
              <div className="font-semibold">{company.name}</div>
            </div>
            <div>
              <div className="mb-3">رقم السجل التجاري (CR)</div>
              <div className="font-semibold">{company.commercial_number}</div>
            </div>
            <div>
              <div className="mb-3">الرقم الموحد للمنشأة</div>
              <div className="font-semibold">{company.unified_number}</div>
            </div>
          </div>

          <h2 className="text-right font-semibold mt-12 text-lg text-black-800">
            المتعاقدين مع مقدمي الخدمات ({serviceProviders.length})
          </h2>

          <table className="w-[25vw] mt-4 justify-items-center text-right">
            <thead>
              <tr className="bg-[#d6e0f7] text-blue-950 font-bold">
                <th className="px-4 py-2">اسم مقدم الخدمة</th>
                <th className="px-4 py-2">الرمز</th>
              </tr>
            </thead>
            <tbody>
              {serviceProviders.map((provider) => (
                <tr key={provider.id}>
                  <td className="px-4 py-2">{provider.name}</td>
                  <td className="px-4 py-2">{provider.code}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-right font-semibold my-4 text-lg text-black-800">
            الموظفين ({total})
          </h2>

          <PaginatedTable
            data={companyEmployees}
            columns={columns}
            headerClassName="bg-[#d6e0f7]" // لون الخلفية اللي تبينه
            ClassNameRow="border-none"
          />
          <TablePagination
            total={total}
            page={page}
            limit={limit}
            onPageChange={setPage}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
