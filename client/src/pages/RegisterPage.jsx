import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, UserPlus, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') || 'farmer';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('Shopian');

  // Farmer specific fields
  const [orchardName, setOrchardName] = useState('');
  const [acreage, setAcreage] = useState('4.5');
  const [primaryVarieties, setPrimaryVarieties] = useState('Kashmiri Delicious, Royal Delicious');

  // Expert specific fields
  const [specialization, setSpecialization] = useState('Plant Pathology & Apple Scab Control');
  const [institution, setInstitution] = useState('SKUAST-Kashmir');

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const urlRole = searchParams.get('role');
    if (urlRole && ['farmer', 'customer', 'expert'].includes(urlRole)) {
      setRole(urlRole);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Email address is required.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    const payload = {
      name,
      email,
      password,
      role,
      district,
    };

    if (role === 'farmer') {
      payload.orchardName = orchardName || `${name}'s Orchard`;
      payload.acreage = acreage;
      payload.primaryVarieties = primaryVarieties;
    } else if (role === 'expert') {
      payload.specialization = specialization;
      payload.institution = institution;
    }

    setSubmitting(true);
    const res = await register(payload);
    setSubmitting(false);

    if (res.success) {
      if (role === 'farmer') navigate('/farmer/dashboard');
      else if (role === 'customer') navigate('/customer/dashboard');
      else if (role === 'expert') navigate('/expert/dashboard');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-emerald-100 p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create OrchardSathi Account</h2>
          <p className="text-xs text-slate-500">Select your role to configure your dedicated workspace</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${role === 'farmer' ? 'bg-white text-emerald-800 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
            >
              👨‍🌾 Farmer
            </button>
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${role === 'customer' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
            >
              🛒 Customer
            </button>
            <button
              type="button"
              onClick={() => setRole('expert')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${role === 'expert' ? 'bg-white text-blue-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
            >
              🔬 Expert
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ghulam Hassan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                District / Location
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
              >
                <option value="Shopian">Shopian</option>
                <option value="Baramulla">Baramulla / Sopore</option>
                <option value="Pulwama">Pulwama</option>
                <option value="Srinagar">Srinagar</option>
                <option value="Anantnag">Anantnag</option>
                <option value="Budgam">Budgam</option>
                <option value="Kupwara">Kupwara</option>
                <option value="Jammu">Jammu</option>
                <option value="Delhi">Delhi (Mandi / Buyer)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. grower@orchardsathi.ai"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password (Min 6 Characters)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              required
            />
          </div>

          {/* Conditional Role Metadata Fields */}
          {role === 'farmer' && (
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-3">
              <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Orchard Configuration</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Orchard Name</label>
                  <input
                    type="text"
                    value={orchardName}
                    onChange={(e) => setOrchardName(e.target.value)}
                    placeholder="e.g. Pirpanjal High Orchard"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Total Acreage</label>
                  <input
                    type="number"
                    step="0.5"
                    value={acreage}
                    onChange={(e) => setAcreage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Primary Cultivars</label>
                <input
                  type="text"
                  value={primaryVarieties}
                  onChange={(e) => setPrimaryVarieties(e.target.value)}
                  placeholder="Kashmiri Delicious, Royal Delicious, Maharaji"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>
          )}

          {role === 'expert' && (
            <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Agricultural Expert Credentials</p>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">Verification Required</span>
              </div>
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Plant Pathology, Pomology, Entomology"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Affiliated Institution</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. SKUAST-Kashmir, Department of Horticulture"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {submitting ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Creating Account...</span>
              </span>
            ) : (
              <>
                <span>Complete Registration</span>
                <UserPlus className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-emerald-700 hover:underline">
            Sign in here
          </Link>
        </div>

      </div>
    </div>
  );
}
