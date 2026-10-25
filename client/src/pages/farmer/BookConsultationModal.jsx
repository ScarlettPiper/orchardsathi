import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  X, 
  Calendar, 
  Clock, 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Video, 
  MapPin 
} from 'lucide-react';

export default function BookConsultationModal({ isOpen, onClose, scan, onBooked }) {
  const [experts, setExperts] = useState([]);
  const [selectedExpertId, setSelectedExpertId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 10:45 AM');
  const [consultationType, setConsultationType] = useState('Online Video');
  const [farmerPhone, setFarmerPhone] = useState('+91 94190 12345');
  const [symptomsReported, setSymptomsReported] = useState(
    scan ? `Verification requested for AI screening result: ${scan.predictedClass} (${scan.confidence}% confidence).` : ''
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      const loadExperts = async () => {
        try {
          const res = await api.get('/experts');
          if (res.data.success && res.data.experts) {
            setExperts(res.data.experts);
            if (res.data.experts.length > 0) {
              setSelectedExpertId(res.data.experts[0]._id);
            }
          }
        } catch (err) {
          console.warn('Failed to load experts:', err);
        }
      };
      loadExperts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const selectedExpert = experts.find(e => String(e._id) === String(selectedExpertId)) || experts[0];

    setSubmitting(true);
    try {
      const payload = {
        expertId: selectedExpert?._id,
        expertName: selectedExpert?.name || 'Dr. Altaf Hussain',
        scanId: scan?._id || null,
        scanImageUrl: scan?.imageUrl || '',
        predictedClass: scan?.predictedClass || 'Apple Pathology Consultation',
        appointmentDate,
        timeSlot,
        consultationType,
        farmerPhone,
        symptomsReported,
      };

      const res = await api.post('/consultations/book', payload);
      setSubmitting(false);

      if (res.data.success) {
        setSuccessMsg('Consultation requested successfully! The agricultural expert will review your case.');
        setTimeout(() => {
          if (onBooked) onBooked(res.data.consultation);
          onClose();
        }, 1800);
      } else {
        setErrorMsg(res.data.message || 'Booking request failed.');
      }
    } catch (err) {
      setSubmitting(false);
      setErrorMsg(err.response?.data?.message || 'Could not connect to consultation service.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Request Expert Review</h3>
              <p className="text-xs text-slate-500">Connect with a certified plant pathologist</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan Snapshot Header */}
        {scan && (
          <div className="p-3 bg-earth-50 rounded-2xl border border-emerald-100 flex items-center space-x-3 text-xs">
            <img
              src={scan.imageUrl}
              alt="Scan"
              className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100&q=80';
              }}
            />
            <div>
              <p className="font-bold text-slate-900">Linked Scan: {scan.predictedClass}</p>
              <p className="text-slate-500 text-[11px]">AI Confidence: {scan.confidence}% • ID: {String(scan._id).slice(-6)}</p>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Select Expert */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Select Agricultural Specialist
            </label>
            <select
              value={selectedExpertId}
              onChange={(e) => setSelectedExpertId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {experts.map((exp) => (
                <option key={exp._id} value={exp._id}>
                  {exp.name} — {exp.title} ({exp.institution})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Preferred Date
              </label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="10:00 AM - 10:45 AM">10:00 AM - 10:45 AM</option>
                <option value="11:30 AM - 12:15 PM">11:30 AM - 12:15 PM</option>
                <option value="02:30 PM - 03:15 PM">02:30 PM - 03:15 PM</option>
                <option value="04:00 PM - 04:45 PM">04:00 PM - 04:45 PM</option>
              </select>
            </div>
          </div>

          {/* Consultation Type */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Consultation Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConsultationType('Online Video')}
                className={`py-2 px-3 rounded-xl border font-semibold text-center transition-all ${
                  consultationType === 'Online Video'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                📹 Online Video Call
              </button>
              <button
                type="button"
                onClick={() => setConsultationType('In-Person Orchard Visit')}
                className={`py-2 px-3 rounded-xl border font-semibold text-center transition-all ${
                  consultationType === 'In-Person Orchard Visit'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                🚜 In-Person Field Visit
              </button>
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Farmer Contact Number
            </label>
            <input
              type="text"
              value={farmerPhone}
              onChange={(e) => setFarmerPhone(e.target.value)}
              placeholder="+91 94190 XXXXX"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              required
            />
          </div>

          {/* Symptoms details */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
              Notes / Questions for the Expert
            </label>
            <textarea
              value={symptomsReported}
              onChange={(e) => setSymptomsReported(e.target.value)}
              rows="2"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="w-1/3 py-2.5 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-2/3 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {submitting ? (
                <span>Submitting Request...</span>
              ) : (
                <span>Confirm Booking</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
