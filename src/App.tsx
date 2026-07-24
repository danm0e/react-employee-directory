import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { EmployeeListPage } from "./pages/EmployeeListPage";
import { EmployeeDetailPage } from "./pages/EmployeeDetailPage";
import { AddEmployeePage } from "./pages/AddEmployeePage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EmployeeListPage />} />
          <Route path="/employees/new" element={<AddEmployeePage />} />
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
