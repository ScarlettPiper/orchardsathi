import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  MapPin, 
  UserCheck, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  Activity,
  ArrowRight
} from 'lucide-react';

export default function ExpertDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(user?.expertProfile?.isAvailable !== false);
  const [selectedCase, setSelectedCase] = useState(null);

  // Assessment form states
  const [assessmentText, setAssessmentText] = useState('');
  const [recommendationsText, setRecommendationsText] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [submittingAssessment, setSubmittingAssessment] = useState(false);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/consultations/my-consultations');
      if (res.data.success) {
        setConsultations(res.data.consultations || []);
      }
    } catch (err) {
      console.warn('Consultations fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await api.put(`/consultations/${id}/status`, { status });
      if (res.data.success) {
        setConsultations(consultations.map(c => c._id === id ? { ...c, status } : c));
      }
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleAvailability = async () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    try {
      await api.put('/experts/availability', { isAvailable: nextState });
    } catch (err) {
      console.warn('Availability update failed:', err);
    }
  };

  const handleSubmitAssessment = async (e) => {
    e.preventDefault();
    if (!selectedCase || !assessmentText.trim()) return;

    setSubmittingAssessment(true);
    try {
      const res = await api.post(`/consultations/${selectedCase._id}/assessment`, {
        expertAssessment: assessmentText,
        recommendations: recommendationsText,
        followUpDate,
      });

      if (res.data.success) {
        setConsultations(consultations.map(c => c._id === selectedCase._id ? res.data.consultation : c));
        setSelectedCase(null);
        setAssessmentText('');
        setRecommendationsText('');
        alert('Diagnostic assessment submitted and archived into farmer record!');
      }
    } catch (err) {
      alert('Failed to save assessment: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingAssessment(false);
    }
  };

  const pendingCount = consultations.filter(c => c.status === 'pending').length;
  const confirmedCount = consultations.filter(c => c.status === 'confirmed').length;
  const completedCount = consultations.filter(c => c.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold bg-white/10 px-3 py-1 rounded-full text-blue-200">
              <Stethoscope className="w-3.5 h-3.5 text-blue-300" />
              <span>Plant Pathology & Pomology Consultation Desk</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name || 'Agricultural Specialist'}
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl">
              {user?.expertProfile?.institution || 'SKUAST-Kashmir'} • {user?.expertProfile?.specialization || 'Temperate Fruit Disease Management'}
            </p>
          </div>

          {/* Availability Status Toggle */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-2">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-xs font-semibold text-blue-100">Consultation Availability:</span>
              <button
                type="button"
                onClick={handleToggleAvailability}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isAvailable ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {isAvailable ? '● Available Online' : '○ Unavailable / In-Field'}
              </button>
            </div>
            <p className="text-[10px] text-blue-200/80">Farmers can request video appointments when active.</p>
          </div>
        </div>
      </div>

      {/* Verification Status Warning Box */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start space-x-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-amber-950 flex items-center space-x-1.5">
            <span>Institutional Verification Status: Pending Verification</span>
            <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.2 rounded-full font-bold">Prototype State</span>
          </p>
          <p className="leading-relaxed text-slate-700 text-[11px]">
            In compliance with OrchardSathi academic guidelines, agricultural specialists undergo departmental authentication before issuing certified prescription stamps. During Review 1 demonstration, cases and bookings operate in simulated clinical workflow mode.
          </p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending Bookings</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-700">{pendingCount}</p>
          <p className="text-[11px] text-slate-400">Awaiting your confirmation</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Confirmed Sessions</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-800">{confirmedCount}</p>
          <p className="text-[11px] text-slate-400">Upcoming appointments</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Cases Completed</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{completedCount}</p>
          <p className="text-[11px] text-slate-400">Advisories issued</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Consults</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{consultations.length}</p>
          <p className="text-[11px] text-slate-400">Recorded cases</p>
        </div>

      </div>

      {/* Consultations Management Section */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-700" />
            <span>Consultation Case Requests</span>
          </h2>
          <span className="text-xs text-slate-500">Live Case Feed</span>
        </div>

        {loading ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-700 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Retrieving consultation cases...</p>
          </div>
        ) : consultations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
            <p className="text-sm font-bold text-slate-800">No consultation requests assigned yet.</p>
            <p className="text-xs text-slate-500">When farmers request an expert review from their scan result, cases will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consultations.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        item.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>

                    <span className="text-xs font-semibold text-slate-500">
                      📅 {item.appointmentDate} • {item.timeSlot}
                    </span>
                  </div>

                  <div className="flex items-start space-x-3">
                    {item.scanImageUrl && (
                      <img
                        src={item.scanImageUrl}
                        alt="Scan preview"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{item.farmerName}</h3>
                      <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.farmerLocation}</span>
                      </p>
                      <p className="text-xs font-semibold text-emerald-800 mt-1">
                        Screened Condition: {item.predictedClass}
                      </p>
                    </div>
                  </div>

                  {item.symptomsReported && (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                      <p className="font-semibold text-slate-700 text-[11px]">Farmer Reported Symptoms:</p>
                      <p className="italic mt-0.5">"{item.symptomsReported}"</p>
                    </div>
                  )}

                  {item.expertAssessment && (
                    <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-950 border border-emerald-200">
                      <p className="font-bold text-[11px] text-emerald-800">Your Clinical Assessment:</p>
                      <p className="mt-0.5">{item.expertAssessment}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {item.status === 'pending' && (
                    <div className="flex items-center space-x-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(item._id, 'confirmed')}
                        className="flex-1 py-2 px-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Accept & Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(item._id, 'cancelled')}
                        className="py-2 px-3 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {item.status === 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => setSelectedCase(item)}
                      className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>Issue Clinical Assessment & Advice</span>
                    </button>
                  )}

                  {item.status === 'completed' && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Case Assessment Completed</span>
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Case Assessment Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Case Diagnostic Assessment</h3>
                <p className="text-xs text-slate-500">Patient: {selectedCase.farmerName} • {selectedCase.farmerLocation}</p>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAssessment} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Expert Pathology Assessment & Confirmation
                </label>
                <textarea
                  value={assessmentText}
                  onChange={(e) => setAssessmentText(e.target.value)}
                  placeholder="e.g. Confirmed secondary foliar scab (Venturia inaequalis). Primary infection period initiated during last rainfall spell..."
                  rows="3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Prescribed Treatment Plan (Fungicide / Cultural Action)
                </label>
                <textarea
                  value={recommendationsText}
                  onChange={(e) => setRecommendationsText(e.target.value)}
                  placeholder="e.g. Apply Dodine 65 WP (0.075%) or Difenoconazole 25 EC (0.03%). Maintain 14-day interval. Avoid overhead irrigation."
                  rows="2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Follow-up Inspection Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="w-1/3 py-2.5 border border-slate-300 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAssessment}
                  className="w-2/3 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md transition-all disabled:opacity-60"
                >
                  {submittingAssessment ? 'Saving Record...' : 'Submit Assessment'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
