import { Search, Filter, ArrowRight, Download, MoreVertical, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '../utils/cn';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const SystemLogs = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const logsCollection = collection(db, 'logs');
      const logSnapshot = await getDocs(logsCollection);
      const logList = logSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          product: data.product,
          status: data.status,
          date: data.date.toDate().toLocaleDateString(t('en-US'), { year: 'numeric', month: 'long', day: 'numeric' }),
          score: data.score,
          user: data.user,
        };
      });
      setLogs(logList);
    };

    fetchLogs();
  }, [t]);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('Analysis Logs')}</h1>
          <p className="text-slate-500 font-bold mt-1">{t('History of all product analysis processes')}</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 group-hover:text-violet-600 transition-colors" />
            <input
              type="text"
              placeholder={t('Search logs...')}
              className="pl-12 pr-6 py-3.5 bg-white border-2 border-slate-50 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all font-bold text-sm w-full md:w-72 shadow-sm"
            />
          </div>
          <button className="px-6 py-3.5 bg-white border-2 border-slate-50 text-slate-700 font-black rounded-[1.25rem] hover:border-violet-600 hover:text-violet-600 transition-all shadow-sm flex items-center gap-3 text-sm">
            <Filter className="w-5 h-5" />
            {t('Filters')}
          </button>
          <button className="p-3.5 bg-violet-600 text-white rounded-[1.25rem] hover:bg-violet-700 transition-all shadow-xl shadow-violet-100 flex items-center justify-center">
            <Download className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-50 rounded-[3rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-50 bg-slate-50/20">
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('Product')}</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('Status')}</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('Date Analyzed')}</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('Score')}</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('User')}</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {logs.map((log) => (
                <tr key={log.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-6 h-6 text-violet-600" />
                      </div>
                      <span className="font-black text-slate-900 text-lg group-hover:text-violet-600 transition-colors">{log.product}</span>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    {log.status === 'Success' && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 text-xs font-black rounded-xl border-2 border-emerald-100">
                        <CheckCircle2 className="w-4 h-4" />
                        {t(log.status)}
                      </span>
                    )}
                    {log.status === 'In Progress' && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 text-xs font-black rounded-xl border-2 border-amber-100">
                        <Clock className="w-4 h-4" />
                        {t(log.status)}
                      </span>
                    )}
                    {log.status === 'Failed' && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-xs font-black rounded-xl border-2 border-red-100">
                        <AlertTriangle className="w-4 h-4" />
                        {t(log.status)}
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-7 text-sm text-slate-500 font-bold uppercase tracking-wider">{log.date}</td>
                  <td className="px-10 py-7">
                    <span className={cn(
                      "font-black text-xl",
                      log.score === '--' ? "text-slate-200" : "text-violet-600"
                    )}>{log.score}</span>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 border border-white shadow-sm overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${log.user}`} alt={log.user} className="w-full h-full object-cover grayscale" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all">
                      <MoreVertical className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-10 py-8 border-t-2 border-slate-50 flex items-center justify-between bg-slate-50/20">
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{t('Showing 1 to 7 of 42 results')}</p>
          <div className="flex items-center gap-3">
            {[1, 2, 3, '...', 6].map((page, i) => (
              <button 
                key={i}
                className={cn(
                  "w-11 h-11 rounded-[1.25rem] text-sm font-black flex items-center justify-center transition-all",
                  page === 1 
                    ? "bg-violet-600 text-white shadow-xl shadow-violet-100 hover:scale-105" 
                    : "text-slate-400 hover:bg-white hover:text-violet-600 hover:shadow-sm"
                )}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
