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

  const [serviceProviders, setServiceProviders] = useState<
    ServiceProviderType[]
  >([]);
  const [companyEmployees, setCompanyEmployees] = useState<CompanyEmployee[]>(
    []
  );
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const skip = (page - 1) * limit;

  // Fetch service providers
  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/service_providers");
        if (!res.ok) throw new Error("Network response was not ok");
        const response = await res.json();
        setServiceProviders(response);
      } catch (err) {
        console.error("Error fetching service providers:", err);
      }
    };
    fetchServiceProviders();
  }, []);

  // Fetch company employees with pagination
  useEffect(() => {
    if (!company) return;
    const fetchEmployees = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/company_employees?company_id=${company.id}&skip=${skip}&limit=${limit}`
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
  }, [company, skip, limit, page]);

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
        <DialogContent dir="rtl">
          <DialogHeader
            className="mb-2"
            style={{ boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.15)" }}
          >
            <DialogTitle className="text-lg font-bold text-blue-950">
              {company.name}
            </DialogTitle>
            <DialogDescription className="text-right">
              {company.type === "installation" ? "شركة تركيب" : "شركة مبيعات"}
            </DialogDescription>
          </DialogHeader>

          <h2 className="text-right font-semibold mb-4 text-lg text-gray-700">
            بيانات الشركة
          </h2>

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-right">
            <div>
              <div className="font-semibold mb-1">اسم الشركة</div>
              <div>{company.name}</div>
            </div>
            <div>
              <div className="font-semibold mb-1">رقم السجل التجاري (CR)</div>
              <div>{company.commercial_number}</div>
            </div>
            <div>
              <div className="font-semibold mb-1">الرقم الموحد للمنشأة</div>
              <div>{company.unified_number}</div>
            </div>
          </div>

          <h2 className="text-right font-semibold mt-1 text-lg text-gray-700">
            المتعاقدين مع مقدمي الخدمات
          </h2>

          <table className="w-[25vw] mt-4 justify-items-center text-right">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2">اسم مقدم الخدمة</th>
                <th className="px-4 py-2">الرمز</th>
              </tr>
            </thead>
            <tbody>
              {serviceProviders.map((provider) => (
                <tr key={provider.id} className="border-b">
                  <td className="px-4 py-2">{provider.name}</td>
                  <td className="px-4 py-2">{provider.code}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-right font-semibold mt-2 text-lg text-gray-700">
            الموظفين
          </h2>

          <PaginatedTable
            data={companyEmployees}
            columns={columns}
            headerClassName="bg-blue-100"
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
