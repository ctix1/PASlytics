import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  ClipboardList, 
  Users, 
  LogOut, 
  HelpCircle,
  Bell,
  Globe
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [user] = useAuthState(auth);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: t('Dashboard'), path: '/dashboard' },
    { icon: ClipboardList, label: t('System Logs'), path: '/logs' },
    { icon: Users, label: t('Site Management'), path: '/management' },
    { icon: Settings, label: t('Profile'), path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 h-screen flex flex-col sticky top-0 overflow-hidden shrink-0">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
          <LayoutDashboard className="text-white w-5 h-5" />
        </div>
        <span className="text-2xl font-black text-slate-900 tracking-tight">PASlytics</span>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all group",
              location.pathname === item.path 
                ? "bg-violet-600 text-white shadow-xl shadow-violet-100 translate-x-1" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              location.pathname === item.path ? "text-white" : "text-slate-400 group-hover:text-slate-600"
            )} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-50 space-y-1">
        <div className="flex items-center justify-around px-5 py-3">
            <button onClick={() => changeLanguage('en')} className={`font-bold text-sm ${i18n.language === 'en' ? 'text-violet-600' : 'text-slate-500'}`}>EN</button>
            <button onClick={() => changeLanguage('ar')} className={`font-bold text-sm ${i18n.language === 'ar' ? 'text-violet-600' : 'text-slate-500'}`}>AR</button>
        </div>
        <Link
          to="#"
          className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <HelpCircle className="w-5 h-5 text-slate-400" />
          Support
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          {t('Logout')}
        </button>
      </div>

      <div className="p-5 bg-slate-50/50 mx-4 mb-8 rounded-[2rem] flex items-center gap-3 border border-slate-100">
        <div className="w-12 h-12 rounded-[1rem] bg-violet-100 border border-white flex items-center justify-center text-violet-700 font-bold overflow-hidden shadow-sm">
          <img src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} alt="User" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-black text-slate-900 truncate">{user?.displayName}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{t('Admin Account')}</p>
        </div>
        <Bell className="w-4 h-4 text-slate-400 hover:text-violet-600 cursor-pointer transition-colors" />
      </div>
    </aside>
  );
};

export default Sidebar;
