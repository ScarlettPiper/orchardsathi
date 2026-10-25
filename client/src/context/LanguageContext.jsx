import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const TRANSLATIONS = {
  en: {
    appName: "OrchardSathi AI",
    tagline: "Smarter Orchards, Healthier Harvests.",
    navOverview: "Overview",
    navHowItWorks: "How It Works",
    navRoles: "User Roles",
    navDashboard: "Dashboard",
    navDetectDisease: "Detect Disease",
    navScanHistory: "Scan History",
    navMarketDashboard: "Market Dashboard",
    navMandiRates: "Mandi Rates & Trends",
    navExpertDesk: "Expert Desk",
    navLogin: "Log In",
    navRegister: "Register",
    navLogout: "Log Out",
    welcome: "Welcome",
    totalScans: "Total Leaf Scans",
    diseasesDetected: "Pathologies Detected",
    healthyFoliage: "Healthy Foliage",
    expertNetwork: "Expert Network",
    detectAppleDisease: "Detect Apple Disease",
    agroWeather: "Orchard Agro-Weather",
    scabRisk: "Apple Scab Risk",
    recentScans: "Recent Foliar Scans",
    confidence: "Confidence",
    viewDetails: "View Diagnosis & Advisory",
    demoDataNotice: "Demo data — Kashmiri Mandi Reference Rates (Not live official feed)",
    appleScab: "Apple Scab (Bamchunt Daag)",
    blackRot: "Black Rot (Frog-Eye)",
    cedarRust: "Cedar Apple Rust",
    healthyLeaf: "Healthy Apple Leaf",
    requestExpert: "Request Expert Review",
    scanAnotherLeaf: "Scan Another Leaf",
    selectRole: "Choose Your Role",
    farmer: "Apple Farmer",
    customer: "Customer & Trader",
    expert: "Agricultural Expert",
  },
  ur: {
    appName: "آرچرڈ ساتھی AI",
    tagline: "بہتر باغات، صحت مند فصل۔",
    navOverview: "جائزہ",
    navHowItWorks: "یہ کیسے کام کرتا ہے",
    navRoles: "صارفین کے کردار",
    navDashboard: "ڈیش بورڈ",
    navDetectDisease: "بیماری کی تشخیص",
    navScanHistory: "اسکین کی تاریخ",
    navMarketDashboard: "مارکیٹ ڈیش بورڈ",
    navMandiRates: "منڈی ریٹس اور رجحانات",
    navExpertDesk: "ماہرین کا ڈیسک",
    navLogin: "لاگ ان",
    navRegister: "رجسٹر کریں",
    navLogout: "لاگ آؤٹ",
    welcome: "خوش آمدید",
    totalScans: "کل پتے اسکین",
    diseasesDetected: "تشخیص شدہ بیماریاں",
    healthyFoliage: "صحت مند پتے",
    expertNetwork: "ماہرین کا نیٹ ورک",
    detectAppleDisease: "سیب کی بیماری کی تشخیص کریں",
    agroWeather: "باغ کا زرعی موسم",
    scabRisk: "سیب کے خارش کا خطرہ",
    recentScans: "حالیہ پتے کے اسکین",
    confidence: "اعتماد",
    viewDetails: "تشخیص اور مشورہ دیکھیں",
    demoDataNotice: "ڈیمو ڈیٹا — کشمیری منڈی کے حوالہ کے ریٹ",
    appleScab: "سیب کا اسکیب (بم چونٹ داغ)",
    blackRot: "سیاہ سڑن (بلیک روٹ)",
    cedarRust: "سیڈر ایپل رسٹ",
    healthyLeaf: "صحت مند سیب کا پتہ",
    requestExpert: "ماہر سے رابطہ کریں",
    scanAnotherLeaf: "دوسرا پتہ اسکین کریں",
    selectRole: "اپنا کردار منتخب کریں",
    farmer: "سیب کاشتکار (باغبان)",
    customer: "خریدار و تاجر",
    expert: "زرعی ماہر",
  },
  ks: {
    appName: "آرچرڈ سٲتھی AI",
    tagline: "جان باغات، اصل پیداوار۔",
    navOverview: "خلاصہٕ",
    navHowItWorks: "کِتھ کَن چھُ کٲم کَران",
    navRoles: "کردار",
    navDashboard: "ڈیش بورڈ",
    navDetectDisease: "بیماری ژھانڈُن",
    navScanHistory: "پرون رکارڈ",
    navMarketDashboard: "منڈی ڈیش بورڈ",
    navMandiRates: "منڈی قئمت تہٕ رجحان",
    navExpertDesk: "ماہرین ڈیسک",
    navLogin: "لاگ اِن",
    navRegister: "ناو درج کٔریو",
    navLogout: "لاگ آوٹ",
    welcome: "خوش آمدید",
    totalScans: "کُل سکین",
    diseasesDetected: "بیماری لٔبمٕژ",
    healthyFoliage: "صحت مند پن",
    expertNetwork: "ماہرین ٹیم",
    detectAppleDisease: "ژوٗنٛٹ بؠمٲرؠ ژھانٛڈِو",
    agroWeather: "باغُک موسم",
    scabRisk: "بم چونٹ داغ خطرٕ",
    recentScans: "تازٕ سکین",
    confidence: "یقین دٔہی",
    viewDetails: "علاج تہٕ مشورٕ وِچھِو",
    demoDataNotice: "ڈیمو معلوٗمات — کشمیری منڈی نمونہٕ قئمت",
    appleScab: "بَم چُوٗنٛٹ داغ (Apple Scab)",
    blackRot: "سیاہ روٹ (Black Rot)",
    cedarRust: "سیڈر رسٹ",
    healthyLeaf: "صحت مند پن",
    requestExpert: "ڈاکٹرس سٟتؠ رابطہ کٔریو",
    scanAnotherLeaf: "بیٛاکھ پَن سکین کٔریو",
    selectRole: "پَنُن کردار چُنو",
    farmer: "ژوٗنٛٹ باغبان (کسان)",
    customer: "خریدار تہٕ تاجر",
    expert: "زرعی ماہر (ڈاکٹر)",
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('orchardsathi_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('orchardsathi_lang', lang);
  }, [lang]);

  const t = (key) => {
    const activeDict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return activeDict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div dir={lang === 'ur' || lang === 'ks' ? 'rtl' : 'ltr'} className={lang !== 'en' ? 'font-sans' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
