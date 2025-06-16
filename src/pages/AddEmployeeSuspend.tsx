import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import type { Company } from "./Companies";

export type SelectedType = "installation" | "sales";

type Props = {
  onClose: () => void;
  selectedType: SelectedType;
};
export type Employee = {
  id: number;
  name: string;
  national_id: string;
  job_number: string;
  nationality: string;
  phone: string;
  company_id: number;
};

export function AddEmployeeSuspend({ onClose, selectedType }: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const selected = employees.find(
    (emp) => emp.id.toString() === selectedEmployee
  );

  useEffect(() => {
    console.log("Selected Type:", selectedType);
    const fetchCompanies = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/companies?type=${selectedType}`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setCompanies(data.data);
        console.log("Companies fetched:", data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };
    fetchCompanies();
  }, [selectedType]);

  useEffect(() => {
    console.log("Selected Company:", selectedCompany);
    // Fetch employees based on selected company
    const fetchEmployees = async () => {
      if (!selectedCompany) return; // Skip if no company is selected
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/company_employees?company_id=${selectedCompany}`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        console.log("Employees fetched:", data);
        setEmployees(data.data); // Assuming the API returns an array of employees
        // Here you can set the employees in state if needed
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, [selectedCompany]);

  const handleSuspendEmployee = async () => {
    if (!selected) {
      alert("Please select an employee first.");
      return;
    }

    const payload = {
      employee_id: selected.id,
      suspended_at: new Date().toISOString().slice(0, 10), // "YYYY-MM-DD" format
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/suspended_employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      console.log("Employee suspended:", data);
      onClose();
    } catch (err) {
      console.error("Error suspending employee:", err);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white w-[90vw] h-[90vh] p-6 rounded-lg shadow-lg relative flex flex-col">
          {/* Header */}
          <header className="mb-2">
            <button
              className="absolute top-3 left-3 text-gray-500 hover:text-red-500 text-2xl"
              onClick={() => onClose()}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-blue-950">
              إضافة موظف الى قائمة الإيقاف
            </h2>
          </header>

          <hr />

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
            <div className="flex  gap-4 text-right">
              <section className="mb-2">
                <label className="block mb-1 font-semibold">اسم الشركة</label>
                <Select onValueChange={(value) => setSelectedCompany(value)}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="اختر الشركة" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem
                        key={company.id}
                        value={company.id.toString()}
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </section>

              <section className="mb-2">
                <label className="block mb-1 font-semibold">اسم الموظف</label>
                <Select onValueChange={(value) => setSelectedEmployee(value)}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="اختر رقم الهوية" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem
                        key={employee.id}
                        value={employee.id.toString()}
                      >
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </section>
            </div>

            <h3 className="text-right font-semibold mb-4">
              بيانات موظف{" "}
              {selectedType === "installation" ? "التركيب" : "المبيعات"}
            </h3>
            <div dir="rtl" className=" p-4 rounded text-sm space-y-3">
              {/* First row: Name and Phone */}
              <div className="flex justify-between mb-8">
                <div className="w-1/2 pl-2 text-right space-y-3">
                  <div className="text-xs text-gray-600">اسم الموظف</div>
                  <div className="font-bold">{selected?.name || ""}</div>
                </div>
                <div className="w-1/2 text-right space-y-3">
                  <div className="text-xs text-gray-600">اسم الشركة</div>
                  <div className="font-bold">
                    {companies.find((c) => c.id.toString() === selectedCompany)
                      ?.name || ""}
                  </div>
                </div>
              </div>

              {/* Second row: National ID and Nationality */}
              <div className="flex justify-between">
                <div className="w-1/2 pl-2 text-right space-y-3">
                  <div className="text-xs text-gray-600">رقم الهوية</div>
                  <div className="font-bold">{selected?.national_id || ""}</div>
                </div>
                <div className="w-1/2 pr-2 text-right space-y-3">
                  <div className="text-xs text-gray-600">الجنسية</div>
                  <div className="font-bold">{selected?.nationality || ""}</div>
                </div>
              </div>
              {/* Third row: Job Number */}
              <div className="flex justify-between mt-4">
                <div className="w-1/2 text-right space-y-3">
                  <div className="text-xs text-gray-600">رقم الهاتف</div>
                  <div className="font-bold">{selected?.phone || ""}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="mt-4 flex justify-between">
            <button
              className="bg-red-900 text-white px-10 py-2 rounded hover:bg-red-700"
              onClick={() => onClose()}
            >
              الغاء
            </button>

            <button
              className="bg-blue-950 text-white px-10 py-2 rounded hover:bg-blue-800"
              onClick={handleSuspendEmployee}
            >
              ارسال
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
