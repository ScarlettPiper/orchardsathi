import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Farmer Pages (Primary Module)
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import DiseaseDetectionPage from './pages/farmer/DiseaseDetectionPage';
import ScanResultPage from './pages/farmer/ScanResultPage';
import ScanHistoryPage from './pages/farmer/ScanHistoryPage';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MarketPricesPage from './pages/customer/MarketPricesPage';

// Expert Pages
import ExpertDashboard from './pages/expert/ExpertDashboard';

// 404 Component
function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-black">
        404
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900">Page Not Found</h1>
      <p className="text-xs text-slate-500 max-w-sm">
        The requested OrchardSathi AI route does not exist. Please return to the homepage or your dashboard.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md"
      >
        Return to Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#F7F9F6] selection:bg-emerald-600 selection:text-white">
            <Navbar />
            
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Farmer Routes (Primary Functional Module) */}
                <Route
                  path="/farmer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <FarmerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/detect"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <DiseaseDetectionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/scan/:id"
                  element={
                    <ProtectedRoute allowedRoles={['farmer', 'expert']}>
                      <ScanResultPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/history"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <ScanHistoryPage />
                    </ProtectedRoute>
                  }
                />

                {/* Customer Routes (Market Prices & Trends) */}
                <Route
                  path="/customer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/prices"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <MarketPricesPage />
                    </ProtectedRoute>
                  }
                />

                {/* Agricultural Expert Routes */}
                <Route
                  path="/expert/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['expert']}>
                      <ExpertDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback Catch-All */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
