import { ChevronRight, Mail, User, Shield, Bell, Lock as LockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const Profile = () => {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [notificationPreference, setNotificationPreference] = useState('');

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setNotificationPreference(data.notificationPreference || 'immediate');
        }
      });
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userDocRef, {
          firstName,
          lastName,
          notificationPreference,
        });
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile: ', error);
        alert('Failed to update profile.');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('User Profile')}</h1>
          <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">{t('Manage your account information and security')}</p>
        </div>
        <button onClick={handleSaveChanges} className="px-10 py-4 bg-violet-600 text-white font-black rounded-[1.5rem] hover:bg-violet-700 transition-all shadow-xl shadow-violet-100 hover:-translate-y-0.5">
          {t('Save Changes')}
        </button>
      </div>

      <div className="bg-white border-2 border-slate-50 rounded-[3rem] shadow-sm p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 text-violet-100/30 pointer-events-none -translate-y-12 translate-x-12">
          <User className="w-96 h-96 opacity-10" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-16 items-center md:items-start mb-16 relative z-10">
          <div className="w-44 h-44 bg-violet-50 rounded-[3.5rem] flex items-center justify-center text-violet-700 font-black text-4xl border-8 border-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] rotate-6 hover:rotate-0 transition-all duration-700 cursor-pointer overflow-hidden group">
            <img 
              src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400'} 
              alt={t('Profile')}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
          <div className="text-center md:text-left pt-6">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{user?.displayName}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5">
              <span className="inline-flex items-center gap-3 px-6 py-3 bg-violet-50 text-violet-700 text-sm font-black rounded-2xl border-2 border-violet-100/50 shadow-sm uppercase tracking-widest">
                <Shield className="w-5 h-5" />
                {t('Admin Account')}
              </span>
              <span className="inline-flex items-center gap-3 px-6 py-3 bg-slate-50 text-slate-500 text-sm font-black rounded-2xl border-2 border-slate-100/50 shadow-sm uppercase tracking-widest">
                <Mail className="w-5 h-5" />
                {user?.email}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 relative z-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">{t('First Name')}</label>
            <div className="relative group">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-8 pr-12 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all font-bold text-slate-700 shadow-inner"
              />
              <ChevronRight className="absolute right-6 top-5.5 w-6 h-6 text-slate-200 group-hover:text-violet-600 transition-colors" />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">{t('Last Name')}</label>
            <div className="relative group">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pl-8 pr-12 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all font-bold text-slate-700 shadow-inner"
              />
              <ChevronRight className="absolute right-6 top-5.5 w-6 h-6 text-slate-200 group-hover:text-violet-600 transition-colors" />
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-16 relative z-10">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">{t('Email Alert Notification')}</label>
          <div className="relative group">
            <select
              value={notificationPreference}
              onChange={(e) => setNotificationPreference(e.target.value)}
              className="w-full pl-8 pr-12 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all font-bold text-slate-700 shadow-inner appearance-none cursor-pointer"
            >
              <option value="immediate">{t('Immediately for all high-priority analysis')}</option>
              <option value="daily">{t('Daily Digest Summary')}</option>
              <option value="weekly">{t('Weekly Analysis Report Only')}</option>
              <option value="none">{t('No Notifications')}</option>
            </select>
            <ChevronRight className="absolute right-6 top-5.5 w-6 h-6 text-slate-200 rotate-90" />
          </div>
        </div>

        <div className="pt-12 border-t-2 border-slate-50 relative z-10">
          <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4 tracking-tight">
            <LockIcon className="w-7 h-7 text-violet-600" />
            {t('Security & Authentication')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border-2 border-slate-50 hover:border-violet-100 hover:bg-white hover:shadow-2xl hover:shadow-violet-100 transition-all duration-500 cursor-pointer group">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500">
                    <Shield className="w-8 h-8 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-lg group-hover:text-violet-600 transition-colors tracking-tight">{t('Change Password')}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t('Last changed 3 months ago')}</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-violet-600 group-hover:translate-x-2 transition-all duration-500" />
              </div>
            </div>
            <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border-2 border-slate-50 hover:border-violet-100 hover:bg-white hover:shadow-2xl hover:shadow-violet-100 transition-all duration-500 cursor-pointer group">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500">
                    <Bell className="w-8 h-8 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-lg group-hover:text-violet-600 transition-colors tracking-tight">{t('2FA Settings')}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t('Status: Disabled')}</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-violet-600 group-hover:translate-x-2 transition-all duration-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
