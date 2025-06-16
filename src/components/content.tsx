import { useEffect, useState } from "react";
import axios from "axios";

type Company = {
  id: number;
  name: string;
  commercial_number: string;
  unified_number: string;
  type: string;
};

export const Companies = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/companies`) // تأكد من تعديل الرابط حسب FastAPI
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error(err));
  }, [API_BASE_URL]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">شركات المبيعات والتركيب</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">الاسم</th>
            <th className="p-2 border">الرقم التجاري</th>
            <th className="p-2 border">الرقم الموحد</th>
            <th className="p-2 border">النوع</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td className="p-2 border">{company.name}</td>
              <td className="p-2 border">{company.commercial_number}</td>
              <td className="p-2 border">{company.unified_number}</td>
              <td className="p-2 border">{company.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Companies;
