import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./app/routes";
import { AuthProvider } from "./shared/hooks/useAuth";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;