import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Mail, Lock as LockIcon, ChevronDown, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useState } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
          // New user, create a document
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ')[1] || '',
            notificationPreference: 'immediate',
            role: 'Analyst',
            status: 'Active',
            lastActive: new Date(),
          });
        }

        navigate('/dashboard');
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to sign in with Google. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEmailPasswordSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error(error);
        setError("Invalid email or password. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-200/40 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <div className="mb-12 flex items-center gap-4">
        <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-200">
          <LayoutDashboard className="text-white w-7 h-7" />
        </div>
        <span className="text-3xl font-black text-slate-900 tracking-tight">PASlytics</span>
      </div>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white rounded-[3rem] shadow-2xl shadow-violet-100 p-10 lg:p-12">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-violet-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-violet-100/50">
            <LayoutDashboard className="text-violet-600 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('Sign In')}</h1>
          <p className="text-slate-400 mt-3 text-center font-bold text-sm tracking-wide uppercase">{t('Secure analysis environment')}</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl relative flex items-center gap-4">
            <AlertCircle className="w-6 h-6" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailPasswordSignIn} className="space-y-5">
          <div className="space-y-2">
            <div className="relative group">
              <Mail className="absolute left-4 top-4.5 w-5 h-5 text-slate-300 group-focus-within:text-violet-600 transition-colors" />
              <input
                type="email"
                placeholder={t('Work Email')}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all font-bold text-slate-700 shadow-inner"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <LockIcon className="absolute left-4 top-4.5 w-5 h-5 text-slate-300 group-focus-within:text-violet-600 transition-colors" />
              <input
                type="password"
                placeholder={t('Work Password')}
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all font-bold text-slate-700 shadow-inner"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <ChevronDown className="absolute right-4 top-4.5 w-5 h-5 text-slate-300" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4.5 bg-violet-600 text-white font-black rounded-2xl hover:bg-violet-700 transition-all shadow-xl shadow-violet-200 mt-6 text-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? t('Signing in...') : t('Sign in to PAS')}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-slate-50">
          <button onClick={handleGoogleSignIn} className="w-full py-4 px-4 border-2 border-slate-50 bg-white rounded-2xl flex items-center justify-center gap-4 hover:border-violet-600 hover:text-violet-600 transition-all group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
            <img src="https://www.google.com/favicon.ico" alt={t("Google")} className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all" />
            <span className="font-black text-slate-700 group-hover:text-violet-600">{t('Continue with Google')}</span>
          </button>
        </div>

        <p className="text-center text-slate-400 text-sm mt-10 font-bold uppercase tracking-widest">
          {t("Don't have access?")} <Link to="#" className="text-violet-600 hover:underline">{t('Contact Admin')}</Link>
        </p>
      </div>
      
      <p className="mt-16 text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
        © 2026 PASlytics
      </p>
    </div>
  );
};

export default LoginPage;
