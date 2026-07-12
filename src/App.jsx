import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { GenerationProvider } from '@/lib/GenerationContext';
import Home from "./pages/Home";
import Library from "./pages/Library";
import Roadmap from "./pages/Roadmap";
import Login from "./pages/Login";
const AuthenticatedApp = () => {
  const { isLoadingAuth, isAuthenticated } = useAuth();
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Login />;
  }
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/library" element={<Library />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};
function App() {
  return (
    <AuthProvider>
      <GenerationProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </GenerationProvider>
    </AuthProvider>
  );
}
export default App;
