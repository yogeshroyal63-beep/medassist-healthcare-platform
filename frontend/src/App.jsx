import { BrowserRouter } from "react-router-dom";
  import AppRoutes from "./app/routes";
  import { Toaster } from "react-hot-toast";
  import ErrorBoundary from "./shared/components/ErrorBoundary";

  const App = () => {
    return (
      <ErrorBoundary>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-right" />
        </BrowserRouter>
      </ErrorBoundary>
    );
  };

  export default App;
  