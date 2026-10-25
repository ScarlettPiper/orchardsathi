import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  ScanLine, 
  TrendingUp, 
  Stethoscope, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Activity, 
  CloudSun, 
  Cpu, 
  Sparkles,
  BarChart3,
  Users
} from 'lucide-react';

export default function LandingPage() {
  const { quickLoginAs } = useAuth();
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    navigate(`/register?role=${role}`);
  };

  const handleQuickDemo = async (role) => {
    const res = await quickLoginAs(role);
    if (res.success) {
      if (role === 'farmer') navigate('/farmer/dashboard');
      else if (role === 'customer') navigate('/customer/dashboard');
      else if (role === 'expert') navigate('/expert/dashboard');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading and Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Empowering Kashmir's Apple Growers</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Smarter Orchards, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800">
                  Healthier Harvests.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                <strong>OrchardSathi AI</strong> provides a comprehensive decision support system tailored for the temperate apple orchards of Kashmir — from Shopian to Sopore. Detect foliar pathologies in seconds, track authentic Mandi trends, and book direct consultations with agricultural specialists.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <a
                  href="#roles"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-700/25 transition-all hover:scale-[1.02]"
                >
                  <span>Select Your Role</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('farmer')}
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-emerald-800 border-2 border-emerald-200 font-bold rounded-xl shadow-sm transition-all"
                >
                  <ScanLine className="w-4 h-4 text-emerald-600" />
                  <span>Try Farmer AI Demo</span>
                </button>
              </div>

              {/* Value metrics strip */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80">
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-900">4 Pathologies</div>
                  <div className="text-xs text-slate-500 font-medium">Scab, Black Rot, Rust, Healthy</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-900">5 Kashmir Mandis</div>
                  <div className="text-xs text-slate-500 font-medium">Sopore, Shopian, Parimpora +</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-900">SKUAST-K</div>
                  <div className="text-xs text-slate-500 font-medium">Aligned Spray Calendars</div>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Visual Glassmorphism Box */}
                <div className="rounded-3xl bg-gradient-to-b from-white to-emerald-50/50 p-6 shadow-2xl border border-emerald-100/80 relative">
                  
                  {/* Decorative badge */}
                  <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      AI Diagnostic Engine
                    </span>
                  </div>

                  {/* Leaf Mock preview */}
                  <div className="my-5 rounded-2xl overflow-hidden relative shadow-md bg-slate-900 group">
                    <img
                      src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=700&q=80"
                      alt="Apple orchard foliage"
                      className="w-full h-52 object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                      <div className="text-white">
                        <p className="text-xs font-semibold text-emerald-300">Live Folia Analysis</p>
                        <p className="text-sm font-bold">Kashmiri Delicious Leaf Sample</p>
                      </div>
                    </div>
                  </div>

                  {/* Prediction Pill */}
                  <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-slate-800">Apple Scab Detected</span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">94.2% Confidence</span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full w-[94%]"></div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-tight">
                      *Venturia inaequalis* identified. Early foliar lesions detected. SKUAST-K Pink Bud protocol recommended.
                    </p>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Role Selection Cards Section */}
      <section id="roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Tailored Workspaces</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Choose Your Role in OrchardSathi AI</h3>
          <p className="text-slate-600 text-sm sm:text-base">
            Dedicated portal workflows built to address the unique needs of apple orchardists, wholesale buyers, and certified plant pathologists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Farmer */}
          <div className="relative rounded-3xl bg-white border-2 border-emerald-500/80 p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col justify-between">
            
            <div className="absolute -top-3.5 right-6 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              Primary Module ★
            </div>

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-inner">
                <ScanLine className="w-7 h-7" />
              </div>
              
              <h4 className="text-2xl font-bold text-slate-900">Apple Farmer</h4>
              
              <p className="text-sm text-slate-600 leading-relaxed">
                Scan apple leaves instantly to identify Apple Scab, Black Rot, or Rust. Receive university-aligned treatment advice and connect directly with local experts.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant leaf pathology detection & confidence gauge</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>SKUAST-Kashmir organic & chemical spray advisory</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Personal scan history & weather risk index</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 space-y-2">
              <button
                type="button"
                onClick={() => handleRoleClick('farmer')}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center space-x-2"
              >
                <span>Enter as Farmer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('farmer')}
                className="w-full py-2 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
              >
                Launch 1-Click Farmer Demo →
              </button>
            </div>
          </div>

          {/* Card 2: Customer / Trader */}
          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-inner">
                <TrendingUp className="w-7 h-7" />
              </div>
              
              <h4 className="text-2xl font-bold text-slate-900">Customer & Trader</h4>
              
              <p className="text-sm text-slate-600 leading-relaxed">
                Stay updated on genuine Kashmiri apple Mandi rates, historical wholesale trajectories, and harvest arrivals across Sopore, Shopian, and Delhi markets.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Wholesale rates per quintal & 16-18kg apple box</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Interactive Recharts price trend timeline</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Grade A, B, and C variety comparisons</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 space-y-2">
              <button
                type="button"
                onClick={() => handleRoleClick('customer')}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center space-x-2"
              >
                <span>Enter as Customer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('customer')}
                className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Launch 1-Click Customer Demo →
              </button>
            </div>
          </div>

          {/* Card 3: Agricultural Expert */}
          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shadow-inner">
                <Stethoscope className="w-7 h-7" />
              </div>
              
              <h4 className="text-2xl font-bold text-slate-900">Agricultural Expert</h4>
              
              <p className="text-sm text-slate-600 leading-relaxed">
                Review farmer-submitted foliar scans, verify automated AI detections, conduct virtual appointments, and issue certified field prescriptions.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Case management desk with farmer symptoms</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Transparent institutional verification badge</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Appointment schedule and clinical notes</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 space-y-2">
              <button
                type="button"
                onClick={() => handleRoleClick('expert')}
                className="w-full py-3 px-4 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center space-x-2"
              >
                <span>Enter as Expert</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('expert')}
                className="w-full py-2 text-xs font-semibold text-blue-800 hover:text-blue-950 transition-colors"
              >
                Launch 1-Click Expert Demo →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-3xl border border-slate-200/80 shadow-sm scroll-mt-24">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Workflow Pipeline</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">How OrchardSathi AI Operates</h3>
          <p className="text-slate-600 text-sm">
            A seamless three-tier architecture connecting the farmer's mobile camera with advanced deep learning models and certified Kashmiri horticulturists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-earth-50 border border-emerald-100/60 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-extrabold flex items-center justify-center text-base">
              1
            </div>
            <h4 className="text-lg font-bold text-slate-900">Upload Leaf Image</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Capture or drag-and-drop a close-up photo of the affected apple foliage. Validates image resolution, format, and filesize instantly.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-earth-50 border border-emerald-100/60 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-extrabold flex items-center justify-center text-base">
              2
            </div>
            <h4 className="text-lg font-bold text-slate-900">Neural Network Analysis</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              FastAPI deep learning microservice classifies the leaf for Apple Scab, Black Rot, or Cedar Rust with confidence probability distribution.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-earth-50 border border-emerald-100/60 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-extrabold flex items-center justify-center text-base">
              3
            </div>
            <h4 className="text-lg font-bold text-slate-900">Advisory & Expert Connect</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive reviewed cultural, organic, and SKUAST-K chemical recommendations, or request a 1-click video review with an agricultural specialist.
            </p>
          </div>

        </div>

      </section>

      {/* Regional Kashmir Mission Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-forest-800 to-emerald-900 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              <Sprout className="w-4 h-4" />
              <span>Kashmir Horticultural Mission Support</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">Protecting the Valley's 20 Lakh Metric Ton Harvest</h3>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Over 7 lakh farming families in Jammu & Kashmir rely directly on the apple economy. OrchardSathi AI bridges traditional horticultural wisdom with modern AI decision systems to reduce crop loss and maximize grower returns.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              to="/register"
              className="px-6 py-3.5 bg-white text-emerald-950 font-bold rounded-xl shadow-lg hover:bg-emerald-50 transition-all hover:scale-105 inline-block text-center text-sm"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
