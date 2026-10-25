import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import BookConsultationModal from './BookConsultationModal';
import { 
  ScanLine, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  Stethoscope, 
  ShieldAlert, 
  Sparkles, 
  Cpu, 
  Calendar, 
  Info,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function ScanResultPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [scan, setScan] = useState(location.state?.scan || null);
  const [loading, setLoading] = useState(!location.state?.scan);
  const [errorMsg, setErrorMsg] = useState('');
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [bookingSuccessAlert, setBookingSuccessAlert] = useState(false);

  useEffect(() => {
    if (!scan && id) {
      const fetchScan = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/scans/${id}`);
          if (res.data.success && res.data.scan) {
            setScan(res.data.scan);
          } else {
            setErrorMsg(res.data.message || 'Scan record not found.');
          }
        } catch (err) {
          setErrorMsg(err.response?.data?.message || 'Failed to retrieve scan record.');
        } finally {
          setLoading(false);
        }
      };
      fetchScan();
    }
  }, [id, scan]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-600">Retrieving foliar pathology record...</p>
      </div>
    );
  }

  if (errorMsg || !scan) {
    return (
      <div className="max-w-lg mx-auto my-16 p-8 bg-white rounded-3xl shadow-lg border border-rose-100 text-center space-y-4">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Scan Record Unavailable</h2>
        <p className="text-xs text-slate-600">{errorMsg || 'Could not locate scan ID.'}</p>
        <Link
          to="/farmer/detect"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
        >
          <span>Return to Leaf Scanner</span>
        </Link>
      </div>
    );
  }

  const isHealthy = scan.predictedClass === 'Healthy Leaf';
  const isConfidenceLow = scan.confidence < 75;

  // Severity color styles
  const getBadgeStyle = (severity) => {
    switch (severity) {
      case 'Severe':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb & Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/farmer/history')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scan History</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span>Scan ID: <strong className="text-slate-700">{String(scan._id).slice(-8)}</strong></span>
          <span>•</span>
          <span>{new Date(scan.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Booking Success Toast */}
      {bookingSuccessAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold">Consultation booked successfully! Expert will review your leaf scan.</span>
          </div>
          <button onClick={() => setBookingSuccessAlert(false)} className="text-emerald-700 font-bold">Dismiss</button>
        </div>
      )}

      {/* Low-confidence Warning Alert */}
      {isConfidenceLow && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start space-x-3 text-xs text-amber-900 shadow-sm animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-950">Moderate/Low Confidence Screening ({scan.confidence}%)</p>
            <p className="leading-relaxed">
              The neural network detected ambiguity in this image. We strongly recommend retaking a sharper photograph under natural daylight or booking a direct review with an agricultural expert before taking chemical action.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Image on Left + Diagnosis Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (5 Cols): Uploaded Leaf Image */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-xl border border-slate-200 relative group">
            <img
              src={scan.imageUrl}
              alt={scan.predictedClass}
              className="w-full max-h-[460px] object-cover mx-auto"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80';
              }}
            />
            
            <div className="absolute top-4 left-4">
              <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border shadow-md ${getBadgeStyle(scan.severity)}`}>
                {scan.severity} Severity
              </span>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-5 text-white">
              <p className="text-xs text-slate-300">File: {scan.originalFilename || 'leaf_scan.jpg'}</p>
              <p className="text-sm font-bold flex items-center space-x-1.5 mt-0.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span className="text-xs">{scan.modelSource || 'FastAPI PyTorch Service'}</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/farmer/detect"
              className="py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold text-center shadow-sm transition-all"
            >
              Scan Another Leaf
            </Link>
            <button
              type="button"
              onClick={() => setConsultationModalOpen(true)}
              className="py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold text-center shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Request Expert</span>
            </button>
          </div>

          {/* Probability Distribution Box */}
          {scan.probabilities && (
            <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Multi-Class Probability Distribution
              </h4>
              <div className="space-y-2 text-xs">
                {Object.entries(
                  scan.probabilities instanceof Map 
                    ? Object.fromEntries(scan.probabilities) 
                    : scan.probabilities
                ).map(([className, probVal]) => {
                  const percent = Math.round(Number(probVal) * 100);
                  const isTop = className === scan.predictedClass;
                  return (
                    <div key={className} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-semibold ${isTop ? 'text-emerald-900 font-bold' : 'text-slate-600'}`}>
                          {className}
                        </span>
                        <span className={`font-mono ${isTop ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                          {percent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${isTop ? 'bg-emerald-600' : 'bg-slate-300'}`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (7 Cols): Diagnosis, Symptoms & SKUAST Advisory */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pathology Diagnosis</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center space-x-2">
                  <span>{scan.predictedClass}</span>
                  {isHealthy ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                  )}
                </h2>
                <p className="text-xs text-slate-500 italic mt-0.5">{scan.scientificName}</p>
              </div>

              {/* Confidence Meter */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center min-w-[130px]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Confidence</p>
                <p className={`text-2xl font-extrabold ${isHealthy ? 'text-emerald-700' : 'text-amber-600'}`}>
                  {scan.confidence}%
                </p>
                <p className="text-[10px] text-slate-400">Softmax Score</p>
              </div>
            </div>

            {/* Symptoms Observed */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Characteristic Diagnostic Symptoms:
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {scan.symptoms?.map((symptom, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                    <span className="leading-relaxed">{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Organic Management Card */}
          <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-emerald-950 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Organic Cultural & Biological Management</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              {scan.organicRemedy || 'Maintain routine orchard sanitation and clean floor hygiene.'}
            </p>
          </div>

          {/* Chemical Spray Schedule (SKUAST-K Aligned) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>SKUAST-Kashmir Recommended Spray Calendar</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {scan.chemicalRemedy || 'No therapeutic chemical spray required for healthy foliage.'}
            </p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
              <p className="font-bold flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Pesticide Safety Warning:</span>
              </p>
              <p className="leading-relaxed">
                Always follow official pre-harvest intervals (PHI). Wear protective equipment during spray operations. Never mix incompatible systemic fungicides without verifying university tank-mix guidelines.
              </p>
            </div>
          </div>

          {/* Preventive Measures */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Proactive Prevention for Kashmir Climatic Conditions:
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {scan.preventiveMeasures?.map((measure, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{measure}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer Box */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-[11px] flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed italic">
              {scan.disclaimer}
            </p>
          </div>

        </div>

      </div>

      {/* Consultation Booking Modal */}
      <BookConsultationModal
        isOpen={consultationModalOpen}
        onClose={() => setConsultationModalOpen(false)}
        scan={scan}
        onBooked={(consultation) => {
          setBookingSuccessAlert(true);
        }}
      />

    </div>
  );
}
