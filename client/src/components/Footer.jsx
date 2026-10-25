import React from 'react';
import { Sprout, ShieldAlert, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5 text-emerald-100" />
              </div>
              <span className="font-bold text-lg text-white">OrchardSathi AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              An AI-Powered Apple Orchard Health and Decision Support System engineered for the fruit growers of Kashmir. 
              Designed to detect foliar pathologies early, track authentic Mandi trends, and bridge farmers with regional agricultural experts.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Final Year Engineering Capstone — Review 1 Prototype</span>
            </div>
          </div>

          {/* Role Navigation */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Role Experiences</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/farmer/dashboard" className="hover:text-emerald-400 transition-colors">
                  🍎 Farmer Orchard Portal
                </Link>
              </li>
              <li>
                <Link to="/farmer/detect" className="hover:text-emerald-400 transition-colors">
                  🔬 Leaf Disease Detection
                </Link>
              </li>
              <li>
                <Link to="/customer/dashboard" className="hover:text-emerald-400 transition-colors">
                  📊 Customer Market Dashboard
                </Link>
              </li>
              <li>
                <Link to="/expert/dashboard" className="hover:text-emerald-400 transition-colors">
                  🩺 Agricultural Expert Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Kashmir Regional Context */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Agricultural Citations</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Sher-e-Kashmir University of Agricultural Sciences (SKUAST-K)</li>
              <li>Directorate of Horticulture Kashmir</li>
              <li>Sopore, Shopian & Parimpora Mandi Networks</li>
              <li>PlantVillage Apple Pathology Dataset</li>
            </ul>
          </div>

        </div>

        {/* Academic & Medical Disclaimer Box */}
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 mb-8 flex items-start space-x-3 text-xs text-slate-300">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-amber-300 font-semibold">Agricultural Safety Notice:</strong> AI screening provided by OrchardSathi AI is an automated advisory support aid and not a certified lab diagnosis. Always verify chemical spray recommendations with a registered horticultural development officer or university plant pathologist prior to field application.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 OrchardSathi AI. Built for Kashmir Apple Growers.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Tagline:</span>
            <span className="text-slate-300 font-medium italic">“Smarter Orchards, Healthier Harvests.”</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
