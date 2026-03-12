import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { User, Bell, Mail, Briefcase, ChevronDown } from 'lucide-react';

const Settings = () => {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [notificationPreference, setNotificationPreference] = useState('immediate');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFirstName(userData.firstName || '');
          setLastName(userData.lastName || '');
          setEmail(userData.email || '');
          setNotificationPreference(userData.notificationPreference || 'immediate');
        }
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
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
    setIsSaving(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('Profile & Settings')}</h1>

      <div className="bg-white border-2 border-slate-50 rounded-[3rem] shadow-sm p-10 lg:p-12">
        <form onSubmit={handleSave} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* User Info Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center shadow-inner">
                  <User className="w-7 h-7 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{t('Personal Information')}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t('Update your details')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="relative group">
                  <label className="absolute -top-2.5 left-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2">{t('First Name')}</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all font-bold text-slate-700 shadow-sm"
                  />
                </div>
                <div className="relative group">
                  <label className="absolute -top-2.5 left-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2">{t('Last Name')}</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all font-bold text-slate-700 shadow-sm"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="absolute -top-2.5 left-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 flex items-center gap-2"><Mail className="w-3 h-3"/> {t('Email Address')}</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-slate-400 shadow-inner cursor-not-allowed"
                />
              </div>
            </div>
            
            {/* Notifications Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-inner">
                  <Bell className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{t('Notifications')}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t('Manage how you get alerts')}</p>
                </div>
              </div>

              <div className="relative group">
                <label className="absolute -top-2.5 left-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2">{t('Frequency')}</label>
                <select
                  value={notificationPreference}
                  onChange={(e) => setNotificationPreference(e.target.value)}
                  className="appearance-none w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all font-bold text-slate-700 shadow-sm"
                >
                  <option value="immediate">{t('Immediate')}</option>
                  <option value="daily">{t('Once a day')}</option>
                  <option value="off">{t('Off')}</option>
                </select>
                <ChevronDown className="absolute right-5 top-5 w-5 h-5 text-slate-300 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t-2 border-slate-50 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-10 py-4 bg-violet-600 text-white font-black rounded-2xl hover:bg-violet-700 transition-all shadow-xl shadow-violet-200 text-sm hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? t('Saving...') : t('Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
