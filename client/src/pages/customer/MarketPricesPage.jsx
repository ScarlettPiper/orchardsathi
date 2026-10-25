import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  TrendingUp, 
  MapPin, 
  Filter, 
  Search, 
  Info, 
  ArrowUpDown, 
  Calendar,
  CheckCircle2
} from 'lucide-react';

export default function MarketPricesPage() {
  const [prices, setPrices] = useState([]);
  const [selectedVariety, setSelectedVariety] = useState('All');
  const [selectedMandi, setSelectedMandi] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const res = await api.get('/market/prices');
        if (res.data.success) {
          setPrices(res.data.prices || []);
        }
      } catch (err) {
        console.warn('Market fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  let displayed = prices.filter((item) => {
    const matchesVar = selectedVariety === 'All' || item.variety.includes(selectedVariety);
    const matchesMandi = selectedMandi === 'All' || item.mandi.includes(selectedMandi);
    const matchesSearch = item.variety.toLowerCase().includes(searchTerm.toLowerCase()) || item.mandi.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesVar && matchesMandi && matchesSearch;
  });

  if (sortOrder === 'price_high') {
    displayed.sort((a, b) => b.pricePerQuintal - a.pricePerQuintal);
  } else if (sortOrder === 'price_low') {
    displayed.sort((a, b) => a.pricePerQuintal - b.pricePerQuintal);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <TrendingUp className="w-7 h-7 text-emerald-700" />
            <span>Kashmir Apple Mandi Reference Prices</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Wholesale rate comparisons across Sopore, Shopian, Srinagar, Jammu, and Delhi terminal markets
          </p>
        </div>

        {/* Demo Data Disclaimer Badge */}
        <div className="p-2.5 px-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center space-x-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold">Demo data — not live market prices</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Search */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Search</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Variety or Mandi..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Variety Selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Variety</label>
          <select
            value={selectedVariety}
            onChange={(e) => setSelectedVariety(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="All">All Apple Cultivars</option>
            <option value="Kashmiri Delicious">Kashmiri Delicious</option>
            <option value="Royal Delicious">Royal Delicious</option>
            <option value="Maharaji">Maharaji</option>
            <option value="American Trel">American Trel</option>
            <option value="Kullu Delicious">Kullu Delicious</option>
            <option value="Gala">Gala (High Density)</option>
          </select>
        </div>

        {/* Mandi Selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Market / Mandi</label>
          <select
            value={selectedMandi}
            onChange={(e) => setSelectedMandi(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="All">All Mandis</option>
            <option value="Sopore">Sopore Fruit Mandi</option>
            <option value="Shopian">Shopian Fruit Mandi</option>
            <option value="Parimpora">Parimpora Mandi (Srinagar)</option>
            <option value="Narwal">Narwal Mandi (Jammu)</option>
            <option value="Azadpur">Azadpur Mandi (Delhi)</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Sort Price</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="default">Default Sort</option>
            <option value="price_high">Price: High to Low</option>
            <option value="price_low">Price: Low to High</option>
          </select>
        </div>

      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-4 px-6 font-bold">Cultivar & Quality Grade</th>
                <th className="py-4 px-6 font-bold">Mandi Location</th>
                <th className="py-4 px-6 font-bold">Rate / Quintal (100kg)</th>
                <th className="py-4 px-6 font-bold">Rate / Box (16-18kg)</th>
                <th className="py-4 px-6 font-bold">Trend</th>
                <th className="py-4 px-6 font-bold">Volume Arrival</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayed.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900 text-sm">{item.variety}</p>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                      {item.grade}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    <div className="flex items-center space-x-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.mandi}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-extrabold text-slate-900 text-sm">₹{item.pricePerQuintal.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">Min: ₹{item.minPrice} • Max: ₹{item.maxPrice}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-extrabold text-emerald-800 text-sm">₹{item.pricePerBox.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">Standard carton</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center space-x-1 font-bold ${item.trend === 'up' ? 'text-emerald-700' : item.trend === 'down' ? 'text-rose-600' : 'text-slate-500'}`}>
                      <span>{item.changePercent > 0 ? `+${item.changePercent}%` : `${item.changePercent}%`}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {item.volumeQuintals} Qtl
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attribution Box */}
      <div className="p-4 bg-earth-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
        <p><strong>Data Architecture Note:</strong> In Review 1, Mandi wholesale rates are populated with reviewed baseline data to demonstrate analytical dashboards and Recharts visualization. The system is architected to ingest live Agmarknet or Directorate of Horticulture JSON APIs in later development phases.</p>
      </div>

    </div>
  );
}
