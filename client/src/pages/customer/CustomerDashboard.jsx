import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  MapPin, 
  Search, 
  Filter, 
  Info, 
  ArrowUpRight, 
  Sparkles,
  ExternalLink,
  PackageCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export default function CustomerDashboard() {
  const { user } = useAuth();

  const [prices, setPrices] = useState([]);
  const [trends, setTrends] = useState([]);
  const [selectedVariety, setSelectedVariety] = useState('Kashmiri Delicious (Red Delicious)');
  const [trendAnalysis, setTrendAnalysis] = useState('');
  const [selectedMandi, setSelectedMandi] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fetch prices and trends
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const pricesRes = await api.get('/market/prices');
        if (pricesRes.data.success) {
          setPrices(pricesRes.data.prices || []);
        }

        const trendsRes = await api.get(`/market/trends?variety=${encodeURIComponent(selectedVariety)}`);
        if (trendsRes.data.success) {
          setTrends(trendsRes.data.trends || []);
          setTrendAnalysis(trendsRes.data.analysis || '');
        }
      } catch (err) {
        console.warn('Market fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [selectedVariety]);

  const filteredPrices = prices.filter(p => selectedMandi === 'All' || p.mandi.includes(selectedMandi));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold bg-white/10 px-3 py-1 rounded-full text-emerald-300">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kashmir Apple Market Terminal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || 'Fruit Trader / Buyer'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Monitor real-time wholesale reference prices, track harvest arrival volumes across Sopore, Shopian, and Parimpora mandis, and analyze seasonal pricing curves.
          </p>

          {/* Mandatory Data Rule Badge */}
          <div className="inline-flex items-center space-x-2 p-2 px-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs">
            <Info className="w-4 h-4 text-amber-300 shrink-0" />
            <span><strong>Notice:</strong> Demo data — not live market prices. Reflects authentic Kashmiri benchmark cultivars.</span>
          </div>
        </div>
      </div>

      {/* Market Overview Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Gainer</p>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-700">Royal Delicious</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> +6.2% this week
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Mandi Rate</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">₹9,130</p>
          <p className="text-[11px] text-slate-400">per quintal wholesale</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Standard Box Price</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">₹1,540</p>
          <p className="text-[11px] text-slate-400">16-18 kg fruit carton</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Primary Mandi</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">Sopore Mandi</p>
          <p className="text-[11px] text-slate-400">Asia's 2nd largest hub</p>
        </div>

      </div>

      {/* Main Grid: Price Trends Chart & Variety Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Interactive Recharts Market Trend */}
        <div className="lg:col-span-8 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-emerald-700" />
                <span>Harvest Price Trajectory (Aug — Oct 2026)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tracking {selectedVariety} wholesale rates per quintal (₹)
              </p>
            </div>

            {/* Variety Selector */}
            <select
              value={selectedVariety}
              onChange={(e) => setSelectedVariety(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Kashmiri Delicious (Red Delicious)">Kashmiri Delicious</option>
              <option value="Royal Delicious">Royal Delicious</option>
              <option value="Maharaji (White Dotted Red)">Maharaji</option>
              <option value="American Trel">American Trel</option>
              <option value="Kullu Delicious">Kullu Delicious</option>
              <option value="Gala (High Density)">Gala (High Density)</option>
            </select>
          </div>

          {/* Recharts Component */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="timeline" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={['dataMin - 500', 'dataMax + 500']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()} / quintal`, 'Price']}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#15803d"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#15803d' }}
                  activeDot={{ r: 7, fill: '#22c55e' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Derived Market Commentary */}
          {trendAnalysis && (
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-emerald-950 space-y-1">
              <p className="font-bold uppercase tracking-wider text-[11px] text-emerald-800">
                📊 Seasonal Market Insight:
              </p>
              <p className="leading-relaxed text-slate-700">
                {trendAnalysis}
              </p>
            </div>
          )}

        </div>

        {/* Right 4 Cols: Mandi Filter & Reference Highlights */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Filter by Mandi</h3>
              <MapPin className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-1.5 text-xs">
              {['All', 'Sopore', 'Shopian', 'Parimpora', 'Narwal', 'Azadpur'].map((mandi) => (
                <button
                  key={mandi}
                  onClick={() => setSelectedMandi(mandi)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl font-medium transition-all flex items-center justify-between ${
                    selectedMandi === mandi
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{mandi === 'All' ? 'All Kashmiri Mandis' : `${mandi} Mandi`}</span>
                  {selectedMandi === mandi && <span className="text-[10px]">Active</span>}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <p><strong>Standard Units:</strong> 1 Quintal = 100 kg.</p>
              <p>Apple wooden / corrugated box = 16-18 kg net weight.</p>
            </div>

          </div>

          {/* Quick link to detailed table */}
          <Link
            to="/customer/prices"
            className="block p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl shadow-sm text-center space-y-1 group hover:border-amber-300 transition-colors"
          >
            <p className="text-xs font-bold text-amber-900">Looking for variety rate tables?</p>
            <p className="text-xs font-extrabold text-amber-800 flex items-center justify-center space-x-1 group-hover:translate-x-0.5 transition-transform">
              <span>Open Full Mandi Comparison Table</span>
              <ArrowUpRight className="w-4 h-4" />
            </p>
          </Link>

        </div>

      </div>

      {/* Variety Cards Grid */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Current Reference Mandi Rates</h3>
          <span className="text-xs font-semibold text-slate-500">Date: 24 Oct 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrices.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {item.grade}
                  </span>
                  <div className={`flex items-center space-x-1 text-xs font-bold ${item.trend === 'up' ? 'text-emerald-700' : item.trend === 'down' ? 'text-rose-600' : 'text-slate-500'}`}>
                    {item.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : item.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                    <span>{item.changePercent > 0 ? `+${item.changePercent}%` : `${item.changePercent}%`}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-base">{item.variety}</h4>
                  <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.mandi}</span>
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Per Quintal (100kg):</span>
                  <span className="font-extrabold text-slate-900 text-sm">₹{item.pricePerQuintal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500">Per Standard Box (16-18kg):</span>
                  <span className="font-extrabold text-emerald-800 text-sm">₹{item.pricePerBox.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span>Range: ₹{item.minPrice} - ₹{item.maxPrice}</span>
                <span>Arrival: {item.volumeQuintals} Qtl</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
