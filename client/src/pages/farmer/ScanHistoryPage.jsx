import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  ScanLine, 
  History, 
  Filter, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  Search,
  ExternalLink
} from 'lucide-react';

export default function ScanHistoryPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/scans/history');
      if (res.data.success) {
        setScans(res.data.scans || []);
      } else {
        setErrorMsg(res.data.message || 'Failed to load history.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error connecting to scans database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this scan record?')) return;

    setDeletingId(id);
    try {
      const res = await api.delete(`/scans/${id}`);
      if (res.data.success) {
        setScans(scans.filter(s => s._id !== id));
      }
    } catch (err) {
      alert('Failed to delete scan: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered scans
  const filteredScans = scans.filter((scan) => {
    const matchesFilter = filterClass === 'All' || scan.predictedClass === filterClass;
    const matchesSearch = 
      scan.predictedClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (scan.scientificName && scan.scientificName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (scan.farmerNotes && scan.farmerNotes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <History className="w-7 h-7 text-emerald-700" />
            <span>Foliar Scan History</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Private diagnostic log of all leaf screenings conducted in your orchard
          </p>
        </div>

        <Link
          to="/farmer/detect"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <ScanLine className="w-4 h-4" />
          <span>New Leaf Scan</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search symptoms or notes..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {['All', 'Apple Scab', 'Black Rot', 'Cedar Apple Rust', 'Healthy Leaf'].map((cls) => (
            <button
              key={cls}
              onClick={() => setFilterClass(cls)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterClass === cls
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading your private scan history...</p>
        </div>
      ) : errorMsg ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 text-center">
          {errorMsg}
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
            <ScanLine className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No Scans Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm || filterClass !== 'All'
                ? 'No scan records match the current filter criteria.'
                : 'You have not uploaded any apple leaves for AI analysis yet.'}
            </p>
          </div>
          <Link
            to="/farmer/detect"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md"
          >
            <span>Scan First Leaf</span>
          </Link>
        </div>
      ) : (
        /* Scans Table / Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScans.map((scan) => {
            const isHealthy = scan.predictedClass === 'Healthy Leaf';
            return (
              <div
                key={scan._id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img
                    src={scan.imageUrl}
                    alt={scan.predictedClass}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-md ${
                        isHealthy ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {scan.confidence}%
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-3 bg-slate-950/70 px-2 py-0.5 rounded text-[10px] text-white">
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{scan.predictedClass}</h3>
                    <p className="text-xs text-slate-500 italic">{scan.scientificName}</p>
                  </div>

                  {scan.farmerNotes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                      "{scan.farmerNotes}"
                    </p>
                  )}

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {scan.symptoms?.[0] || 'Pathology analyzed via neural network.'}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/farmer/scan/${scan._id}`}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(scan._id, e)}
                      disabled={deletingId === scan._id}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete scan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
