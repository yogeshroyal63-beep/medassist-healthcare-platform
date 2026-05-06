import { Component } from "react";

  class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, info) {
      console.error("ErrorBoundary caught:", error, info);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div className="flex min-h-screen items-center justify-center p-8">
            <div className="glass-card rounded-2xl p-8 text-center">
              <h2 className="text-xl font-semibold text-slate-900">Something went wrong</h2>
              <p className="mt-2 text-sm text-slate-500">{this.state.error?.message}</p>
              <button
                className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white"
                style={{ background: "var(--brand-700)" }}
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Try again
              </button>
            </div>
          </div>
        );
      }
      return this.props.children;
    }
  }

  export default ErrorBoundary;
  