import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  ScanLine, 
  TrendingUp, 
  Stethoscope, 
  LogOut, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  History,
  LayoutDashboard,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { user, role, isAuthenticated, logout, quickLoginAs } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleQuickSwitch = async (targetRole) => {
    setDemoMenuOpen(false);
    setMobileMenuOpen(false);
    const res = await quickLoginAs(targetRole);
    if (res.success) {
      if (targetRole === 'farmer') navigate('/farmer/dashboard');
      else if (targetRole === 'customer') navigate('/customer/dashboard');
      else if (targetRole === 'expert') navigate('/expert/dashboard');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-emerald-950 tracking-tight">OrchardSathi</span>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">AI</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">Kashmir Apple Health & Decisions</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'}`}
                >
                  Overview
                </Link>
                <a 
                  href="#how-it-works" 
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-colors"
                >
                  How It Works
                </a>
                <a 
                  href="#roles" 
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-colors"
                >
                  User Roles
                </a>
              </>
            ) : (
              <>
                {/* Farmer Links */}
                {role === 'farmer' && (
                  <>
                    <Link
                      to="/farmer/dashboard"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/farmer/dashboard') ? 'text-emerald-800 bg-emerald-100/70 font-semibold' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'}`}
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/farmer/detect"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/farmer/detect') ? 'text-emerald-800 bg-emerald-100/70 font-semibold' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'}`}
                    >
                      <ScanLine className="w-4 h-4 text-emerald-600" />
                      <span>Detect Disease</span>
                    </Link>
                    <Link
                      to="/farmer/history"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/farmer/history') ? 'text-emerald-800 bg-emerald-100/70 font-semibold' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'}`}
                    >
                      <History className="w-4 h-4 text-emerald-600" />
                      <span>Scan History</span>
                    </Link>
                  </>
                )}

                {/* Customer Links */}
                {role === 'customer' && (
                  <>
                    <Link
                      to="/customer/dashboard"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/customer/dashboard') ? 'text-emerald-800 bg-emerald-100/70 font-semibold' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'}`}
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                      <span>Market Dashboard</span>
                    </Link>
                    <Link
                      to="/customer/prices"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/customer/prices') ? 'text-emerald-800 bg-emerald-100/70 font-semibold' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'}`}
                    >
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Mandi Rates & Trends</span>
                    </Link>
                  </>
                )}

                {/* Expert Links */}
                {role === 'expert' && (
                  <>
                    <Link
                      to="/expert/dashboard"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/expert/dashboard') ? 'text-emerald-800 bg-emerald-100/70 font-semibold' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'}`}
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                      <span>Expert Desk</span>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Quick Demo Switcher Pill (Great for Review Evaluation!) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-lg transition-colors"
                title="Switch demo persona for academic presentation"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Demo Switcher</span>
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Switch Test Role:
                  </div>
                  <button
                    onClick={() => handleQuickSwitch('farmer')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 text-slate-700 flex items-center justify-between"
                  >
                    <span className="font-medium text-emerald-900">👨‍🌾 Farmer (Primary Module)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Active</span>
                  </button>
                  <button
                    onClick={() => handleQuickSwitch('customer')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 text-slate-700 flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800">🛒 Customer / Trader</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Mandi</span>
                  </button>
                  <button
                    onClick={() => handleQuickSwitch('expert')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 text-slate-700 flex items-center justify-between"
                  >
                    <span className="font-medium text-blue-900">🔬 Agricultural Expert</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Consult</span>
                  </button>
                </div>
              )}
            </div>

            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 rounded-lg shadow-sm shadow-emerald-700/20 transition-all hover:scale-[1.02]"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 truncate max-w-[140px]">{user?.name}</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 capitalize flex items-center justify-end space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    <span>{role}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {isAuthenticated && (
            <div className="p-3 bg-emerald-50 rounded-xl mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-emerald-950">{user?.name}</p>
                <p className="text-xs text-emerald-700 font-semibold uppercase">{role} Account</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-xs font-semibold text-rose-700 bg-white rounded-lg border border-rose-200"
              >
                Log Out
              </button>
            </div>
          )}

          <div className="space-y-1">
            {role === 'farmer' && (
              <>
                <Link
                  to="/farmer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
                >
                  Dashboard
                </Link>
                <Link
                  to="/farmer/detect"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
                >
                  Detect Disease
                </Link>
                <Link
                  to="/farmer/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
                >
                  Scan History
                </Link>
              </>
            )}

            {role === 'customer' && (
              <>
                <Link
                  to="/customer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
                >
                  Market Dashboard
                </Link>
                <Link
                  to="/customer/prices"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
                >
                  Mandi Rates & Trends
                </Link>
              </>
            )}

            {role === 'expert' && (
              <Link
                to="/expert/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50"
              >
                Expert Desk
              </Link>
            )}

            {!isAuthenticated && (
              <div className="pt-2 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 text-sm font-semibold text-emerald-800 bg-emerald-50 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 text-sm font-semibold text-white bg-emerald-700 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase px-3 mb-1">Quick Switch Demo Persona:</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleQuickSwitch('farmer')}
                  className="py-1.5 px-2 text-xs bg-slate-100 rounded-lg font-medium text-slate-800"
                >
                  Farmer
                </button>
                <button
                  onClick={() => handleQuickSwitch('customer')}
                  className="py-1.5 px-2 text-xs bg-slate-100 rounded-lg font-medium text-slate-800"
                >
                  Customer
                </button>
                <button
                  onClick={() => handleQuickSwitch('expert')}
                  className="py-1.5 px-2 text-xs bg-slate-100 rounded-lg font-medium text-slate-800"
                >
                  Expert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
