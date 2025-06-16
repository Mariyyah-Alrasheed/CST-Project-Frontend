// components/AddSuspendedModal.tsx
import { useEffect, useState } from "react";

type Beneficiary = {
  name: string;
  national_id: string;
  phone: string;
  nationality: string;
  id: number;
};

type Props = {
  onClose: () => void;
};

export default function AddSuspendedModal({ onClose }: Props) {
  const [idSearchTerm, setIdSearchTerm] = useState("");
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [notFound, setNotFound] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleAddSuspended = async () => {
    if (!beneficiary) return;

    const payload = {
      beneficiary_id: beneficiary.id,
      suspended_at: new Date().toISOString().split("T")[0], // today's date in YYYY-MM-DD
    };

    try {
      const res = await fetch(`${API_BASE_URL}/suspended_beneficiaries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to suspend beneficiary");

      // Optionally show success toast here

      onClose(); // Close modal on success
    } catch (err) {
      console.error("Error suspending beneficiary:", err);
      // Optionally show error toast
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchBeneficiary = async () => {
        if (!idSearchTerm.trim()) return;

        try {
          const res = await fetch(
            `${API_BASE_URL}/beneficiaries/${idSearchTerm.trim()}`
          );
          if (!res.ok) {
            setBeneficiary(null);
            setNotFound(true);
            return;
          }

          const data = await res.json();
          setBeneficiary(data);
          setNotFound(false);
        } catch (err) {
          console.error("Error fetching beneficiary:", err);
          setNotFound(true);
          setBeneficiary(null);
        }
      };

      fetchBeneficiary();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [API_BASE_URL, idSearchTerm]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white w-[90vw] h-[90vh] p-6 rounded-lg shadow-lg relative flex flex-col">
        {/* Header */}
        <header className="mb-2">
          <button
            className="absolute top-3 left-3 text-gray-500 hover:text-red-500 text-2xl"
            onClick={() => {
              onClose();
              setIdSearchTerm("");
              setBeneficiary(null);
              setNotFound(false);
            }}
          >
            ✕
          </button>
          <h2 className="text-2xl font-bold text-blue-950">
            إضافة مستفيد الى قائمة الإيقاف
          </h2>
        </header>

        <hr />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
          <div>
            <label className="block mb-1 font-semibold">
              رقم الهوية الوطنية
            </label>
            <input
              type="text"
              className="border rounded px-4 py-2 w-full"
              placeholder="أدخل رقم الهوية"
              value={idSearchTerm}
              onChange={(e) => setIdSearchTerm(e.target.value)}
            />
          </div>{" "}
          <h3 className="text-right font-semibold mb-4">بيانات المستفيد</h3>
          <div dir="rtl" className=" p-4 rounded text-sm space-y-3">
            {/* First row: Name and Phone */}
            <div className="flex justify-between mb-8">
              <div className="w-1/2 pl-2 text-right space-y-3">
                <div className="text-xs text-gray-600">اسم المستفيد</div>
                <div className="font-bold">{beneficiary?.name || ""}</div>
              </div>
              <div className="w-1/2 pr-2 text-right space-y-3">
                <div className="text-xs text-gray-600">رقم الجوال</div>
                <div className="font-bold">{beneficiary?.phone || ""}</div>
              </div>
            </div>

            {/* Second row: National ID and Nationality */}
            <div className="flex justify-between">
              <div className="w-1/2 pl-2 text-right space-y-3">
                <div className="text-xs text-gray-600">رقم الهوية</div>
                <div className="font-bold">
                  {beneficiary?.national_id || ""}
                </div>
              </div>
              <div className="w-1/2 pr-2 text-right space-y-3">
                <div className="text-xs text-gray-600">الجنسية</div>
                <div className="font-bold">
                  {beneficiary?.nationality || ""}
                </div>
              </div>
            </div>
          </div>
          {notFound && (
            <div className="text-red-500">
              لم يتم العثور على مستفيد بهذا الرقم.
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="mt-4 flex justify-between">
          <button
            className="bg-red-900 text-white px-10 py-2 rounded hover:bg-red-700"
            onClick={() => {
              onClose();
              setIdSearchTerm("");
              setBeneficiary(null);
              setNotFound(false);
            }}
          >
            الغاء
          </button>

          <button
            className="bg-blue-950 text-white px-10 py-2 rounded hover:bg-blue-800"
            onClick={() => {
              handleAddSuspended();
            }}
          >
            ارسال
          </button>
        </div>
      </div>
    </div>
  );
}
