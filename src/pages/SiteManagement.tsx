import { Users, UserCheck, Shield, Clock, Search, Plus, MoreHorizontal, ShieldCheck, Mail, Lock as LockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const SiteManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: `${data.firstName} ${data.lastName}`.trim(),
          email: data.email, // Assuming email is stored in the user document
          role: data.role || 'Analyst', // Default to Analyst if role is not set
          status: data.status || 'Active', // Default to Active
          lastActive: data.lastActive || t('N/A'), // Default to N/A
        };
      });
      setUsers(userList);
    };

    fetchUsers();
  }, [t]);

  const stats = [
    { icon: Users, label: t('Total Users'), value: users.length.toString(), change: '+2', color: 'violet' },
    { icon: UserCheck, label: t('Active Analysts'), value: '24', change: '+4', color: 'emerald' },
    { icon: Shield, label: t('Analysts'), value: '12', change: '0', color: 'amber' },
    { icon: Clock, label: t('Permissions'), value: '3', change: '-1', color: 'slate' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('User Management')}</h1>
          <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">{t('Manage team access and permissions')}</p>
        </div>
        <button className="px-8 py-4 bg-violet-600 text-white font-black rounded-[1.5rem] hover:bg-violet-700 transition-all shadow-xl shadow-violet-100 flex items-center gap-3 text-sm hover:-translate-y-0.5">
          <Plus className="w-5 h-5" />
          {t('Add User')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500`}>
            <div className={`absolute top-0 left-0 w-full h-1 bg-${stat.color}-500 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 bg-${stat.color}-50 rounded-2xl flex items-center justify-center shadow-inner`}>
                <stat.icon className={`w-7 h-7 text-${stat.color}-600`} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${
                stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                stat.change === '0' ? 'bg-slate-50 text-slate-400 border border-slate-100' : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border-2 border-slate-50 rounded-[3rem] shadow-sm overflow-hidden">
        <div className="p-10 border-b-2 border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-8 bg-slate-50/10">
          <div className="relative group w-full lg:w-[32rem]">
            <Search className="absolute left-5 top-4.5 w-6 h-6 text-slate-300 group-hover:text-violet-600 transition-colors" />
            <input
              type="text"
              placeholder={t('Search by name, email or role...')}
              className="pl-14 pr-6 py-4.5 bg-white border-2 border-slate-50 rounded-3xl focus:outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all font-bold text-sm w-full shadow-sm"
            />
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none px-8 py-4 bg-white border-2 border-slate-50 text-slate-600 font-black rounded-2xl hover:border-violet-600 hover:text-violet-600 transition-all shadow-sm flex items-center justify-center gap-3 text-xs uppercase tracking-widest">
              {t('Role: All')}
            </button>
            <button className="flex-1 lg:flex-none px-8 py-4 bg-white border-2 border-slate-50 text-slate-600 font-black rounded-2xl hover:border-violet-600 hover:text-violet-600 transition-all shadow-sm flex items-center justify-center gap-3 text-xs uppercase tracking-widest">
              {t('Status: All')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-50 bg-slate-50/20">
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('User Details')}</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('Role')}</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('Status')}</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('Last Active')}</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {users.map((user, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-all duration-300">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-violet-100/50 rounded-2xl flex items-center justify-center text-violet-700 font-black text-xl border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg group-hover:text-violet-600 transition-colors">{user.name}</p>
                        <p className="text-sm text-slate-400 font-bold flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      {user.role === 'Admin' ? <ShieldCheck className="w-5 h-5 text-violet-600" /> : <LockIcon className="w-5 h-5 text-slate-300" />}
                      <span className="text-sm font-black text-slate-700 uppercase tracking-widest">{t(user.role)}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border-2 ${
                      user.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                      {t(user.status)}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-sm text-slate-500 font-bold uppercase tracking-wider">{user.lastActive}</td>
                  <td className="px-10 py-8 text-right">
                    <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-white hover:shadow-md rounded-[1.25rem] transition-all">
                      <MoreHorizontal className="w-7 h-7" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SiteManagement;
