import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarLayout from "./components/SidebarLayout";
import Companies from "./pages/Companies";
import { Employees } from "./pages/Employees";
import { SuspendedBeneficiary } from "./pages/SuspendedBeneficiary";
import { Requests } from "./pages/Requests";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SidebarLayout />}>
          <Route index element={<Companies />} />
          <Route path="companies" element={<Companies />} />
          <Route path="employees" element={<Employees />} />
          <Route path="beneficiaries" element={<SuspendedBeneficiary />} />
          <Route path="requests" element={<Requests />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
