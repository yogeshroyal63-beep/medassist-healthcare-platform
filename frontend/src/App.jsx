import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./app/routes";
import { AuthProvider } from "./shared/hooks/useAuth";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./shared/components/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;