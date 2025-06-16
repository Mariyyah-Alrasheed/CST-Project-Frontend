// import { CirclePlus, FileText, Search } from "lucide-react";
// import { NavigationSection } from "./NavigationSection";
// import { Button } from "./ui/button";
// import { AddButton } from "./SidebarLayout";

// export default function Content() {
//     return (

//               <div className="w-full border-gray-200 shadow-md px-3 flex flex-col gap-6">
//                 <NavigationSection
//                   icon={FileText}
//                   title="قائمة التوثيق"
//                   description="يمكنك الوصول إلى جميع الوثائق المتعلقة بالتطبيق هنا."
//                 ></NavigationSection>
//                 <main className="flex-1 p-6 bg-white rounded-md shadow-sm">
//                   <section className="mb-6 justify-between flex">
//                     <div className="text-sm text-gray-500 gap-2 flex items-center">
//                       <Button> شركات التركيب</Button>
//                       <Button> شركات المبيعات</Button>
//                     </div>
//                     <AddButton id="add" icon={CirclePlus} label=" اضافة" />
//                   </section>
//                   <div className="relative mb-4 w-full max-w-md ml-auto">
//                     <Search className="absolute right-3 top-1/2 transform -translate-y-1/2  text-gray-500" />
//                     <input
//                       type="text"
//                       className="w-full border-1 border-gray-300 rounded px-4 py-2 pr-10 text-right placeholder:text-gray-400"
//                     />
//                   </div>

//                   <p className="mt-4">محتوى التطبي</p>
//                   {children}
//                 </main>
//               </div>

// <div className="flex-1 p-6 bg-gray-50">
// <h1 className="text-2xl font-bold mb-4">مرحبًا بك في لوحة التحكم</h1>
// <p className="text-gray-600">
//     هذه هي الصفحة الرئيسية للوحة التحكم. يمكنك الوصول إلى جميع الميزات من
//     القائمة الجانبية.
// </p>
// <div className="mt-6">
//     <p className="text-lg font-semibold">الميزات المتاحة:</p>
//     <ul className="list-disc list-inside mt-2 text-gray-700">
//     <li>إدارة الشركات</li>
//     <li>إدارة الموظفين</li>
//     <li>إدارة المستفيدين</li>
//     <li>طلبات الإيقاف</li>
//     </ul>
// </div>
// </div>
// );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";

type Company = {
  id: number;
  name: string;
  commercial_number: string;
  unified_number: string;
  type: string;
};

export const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/companies") // تأكد من تعديل الرابط حسب FastAPI
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error(err));
  }, []);

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
