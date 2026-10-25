import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  ScanLine, 
  History, 
  CloudSun, 
  Calendar, 
  MapPin, 
  Sprout, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  TreeDeciduous,
  ShieldCheck,
  Stethoscope,
  Info
} from 'lucide-react';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [scans, setScans] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch recent scans
        const scansRes = await api.get('/scans/history');
        if (scansRes.data.success) {
          setScans(scansRes.data.scans || []);
        }

        // Fetch regional Kashmir weather
        const district = user?.location?.district || 'Shopian';
        const weatherRes = await api.get(`/weather/orchard?district=${district}`);
        if (weatherRes.data.success) {
          setWeather(weatherRes.data.weather);
        }
      } catch (err) {
        console.warn('Dashboard fetch issue:', err.message);
        setError('Could not refresh latest scans or weather. Check backend status.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Derived metrics
  const totalScans = scans.length;
  const diseasedScans = scans.filter(s => s.predictedClass !== 'Healthy Leaf').length;
  const healthyScans = scans.filter(s => s.predictedClass === 'Healthy Leaf').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-green-800 to-forest-800 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold bg-white/15 px-3 py-1 rounded-full text-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>Orchard Location: {user?.location?.district || 'Shopian'}, Kashmir</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Kashmir Apple Grower'}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
              Monitor your orchard's canopy health, review disease alerts, and stay ahead of seasonal foliar infections.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/farmer/detect"
              className="inline-flex items-center space-x-2 px-5 py-3 bg-white text-emerald-900 font-extrabold rounded-xl text-sm shadow-lg hover:bg-emerald-50 transition-all hover:scale-105"
            >
              <ScanLine className="w-5 h-5 text-emerald-700" />
              <span>Detect Apple Disease</span>
            </Link>
            <Link
              to="/farmer/history"
              className="inline-flex items-center space-x-2 px-4 py-3 bg-emerald-900/60 hover:bg-emerald-900 text-white font-semibold rounded-xl text-sm border border-emerald-700/60 transition-colors"
            >
              <History className="w-4 h-4" />
              <span>Scan History</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top Stat Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Leaf Scans</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalScans}</p>
          <p className="text-[11px] text-slate-400">Recorded in this account</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Pathologies Detected</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-700">{diseasedScans}</p>
          <p className="text-[11px] text-slate-400">Scab, Rot or Rust lesions</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Healthy Foliage</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{healthyScans}</p>
          <p className="text-[11px] text-slate-400">Optimal vegetative index</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Expert Network</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-800">3 Online</p>
          <p className="text-[11px] text-slate-400">SKUAST-K Pathologists</p>
        </div>

      </div>

      {/* Two Column Layout: Orchard Profile + Kashmir Weather & Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Orchard Profile & Action Prompts */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Orchard Profile Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <TreeDeciduous className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {user?.orchardDetails?.orchardName || 'Kashmir Apple Orchard'}
                  </h3>
                  <p className="text-xs text-slate-500">Registered Orchard Profile Summary</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Active Block
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="text-slate-500 font-medium">Orchard Acreage</p>
                <p className="font-bold text-slate-900 text-sm">{user?.orchardDetails?.acreage || 4.5} Acres</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="text-slate-500 font-medium">Tree Population</p>
                <p className="font-bold text-slate-900 text-sm">{user?.orchardDetails?.treeCount || 350} Trees</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 col-span-2 sm:col-span-1">
                <p className="text-slate-500 font-medium">Irrigation</p>
                <p className="font-bold text-slate-900 text-sm">Drip / Spring</p>
              </div>
            </div>

            <div className="p-3.5 bg-earth-50 rounded-2xl border border-emerald-100/70 space-y-1.5 text-xs">
              <p className="font-bold text-emerald-900">Primary Apple Cultivars:</p>
              <div className="flex flex-wrap gap-1.5">
                {(user?.orchardDetails?.primaryVarieties || ['Kashmiri Delicious', 'Royal Delicious', 'Maharaji']).map((v, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-800 font-medium text-[11px]">
                    🍎 {v}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Disease Screening Callout */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-emerald-950 text-base">Notice unusual foliar spots?</h4>
              <p className="text-xs text-slate-600 max-w-md">
                Photograph the leaf blade in daylight and run deep neural network analysis to catch Apple Scab or Black Rot before it reaches your harvest.
              </p>
            </div>
            <Link
              to="/farmer/detect"
              className="shrink-0 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <ScanLine className="w-4 h-4" />
              <span>Launch Scanner</span>
            </Link>
          </div>

        </div>

        {/* Right 5 Cols: Kashmir Agro-Weather & Infection Risk */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <CloudSun className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-base">Orchard Agro-Weather</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                Demo Weather Feed
              </span>
            </div>

            {weather ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-extrabold text-slate-900">{weather.tempC}°C</p>
                    <p className="text-xs font-semibold text-slate-600">{weather.condition}</p>
                    <p className="text-[11px] text-slate-400">{weather.district}</p>
                  </div>
                  <div className="text-right space-y-1 text-xs">
                    <p className="text-slate-500">Humidity: <strong className="text-slate-800">{weather.humidity}%</strong></p>
                    <p className="text-slate-500">Wind: <strong className="text-slate-800">{weather.windKmh} km/h</strong></p>
                    <p className="text-slate-500">Precip: <strong className="text-slate-800">{weather.rainfallMm} mm</strong></p>
                  </div>
                </div>

                {/* Scab Risk Alert Box */}
                <div className={`p-3.5 rounded-2xl border ${weather.scabRisk === 'High' ? 'bg-amber-50/80 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'} space-y-1.5`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <AlertTriangle className={`w-4 h-4 ${weather.scabRisk === 'High' ? 'text-amber-600' : 'text-emerald-600'}`} />
                      <span className="text-xs font-bold uppercase tracking-wider">Apple Scab Risk: {weather.scabRisk}</span>
                    </div>
                    <span className="text-[10px] font-semibold bg-white/80 px-2 py-0.5 rounded shadow-xs">Mills Index</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-700">
                    {weather.scabRiskReason}
                  </p>
                  <p className="text-[11px] font-medium text-slate-800 pt-1 border-t border-amber-200/50">
                    💡 <strong>Recommendation:</strong> {weather.actionAdvisory}
                  </p>
                </div>

                {/* 3-day forecast pills */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                  {weather.forecast?.map((f, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-xl space-y-0.5">
                      <p className="text-[11px] font-bold text-slate-700">{f.day}</p>
                      <p className="text-xs font-semibold text-slate-900">{f.temp}</p>
                      <p className="text-[10px] text-emerald-700 font-medium">🌧 {f.rainChance}</p>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">Loading agro-weather parameters...</div>
            )}

            <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 pt-2 border-t border-slate-100">
              <Info className="w-3.5 h-3.5" />
              <span>Simulated regional weather feed for Review 1 academic presentation.</span>
            </div>

          </div>

        </div>

      </div>

      {/* Recent Scans Section */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Recent Foliar Scans</h2>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              {scans.length} Total
            </span>
          </div>

          <Link
            to="/farmer/history"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
          >
            <span>View Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
            <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Loading recent scan records...</p>
          </div>
        ) : scans.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <ScanLine className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No Leaf Scans Recorded Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Take a photograph of an apple leaf with your phone or camera to start screening your orchard for diseases.
              </p>
            </div>
            <Link
              to="/farmer/detect"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition-all"
            >
              <ScanLine className="w-4 h-4" />
              <span>Perform First Scan</span>
            </Link>
          </div>
        ) : (
          /* Scans Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {scans.slice(0, 3).map((scan) => {
              const isHealthy = scan.predictedClass === 'Healthy Leaf';
              return (
                <div
                  key={scan._id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img
                      src={scan.imageUrl.startsWith('http') ? scan.imageUrl : scan.imageUrl}
                      alt={scan.predictedClass}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-md ${
                          isHealthy
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {scan.confidence}% Confidence
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{new Date(scan.createdAt).toLocaleDateString()}</span>
                      <span className="font-medium text-slate-600">Scan ID: {String(scan._id).slice(-6)}</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{scan.predictedClass}</h4>
                      <p className="text-xs text-slate-500 italic">{scan.scientificName}</p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {scan.symptoms?.[0] || 'Foliar pathology screened via deep neural network.'}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={`/farmer/scan/${scan._id}`}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
                      >
                        <span>View Diagnosis & Advisory</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
