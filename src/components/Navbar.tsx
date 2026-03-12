import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
          <LayoutDashboard className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">PASlytics</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-wider">
        <Link to="/" className="hover:text-violet-600 transition-colors">Features</Link>
        <Link to="/" className="hover:text-violet-600 transition-colors">Pricing</Link>
        <Link to="/" className="hover:text-violet-600 transition-colors">About</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/login" className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-violet-600 transition-colors">Log in</Link>
        <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-100">
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
