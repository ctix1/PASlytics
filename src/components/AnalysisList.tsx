import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, Search, Info } from 'lucide-react';

const AnalysisList = ({ analyses }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white border-2 border-slate-50 rounded-[3rem] p-10 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center shadow-inner">
            <BarChart3 className="w-7 h-7 text-violet-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">{t('Recent Analyses')}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t('Your latest product insights')}</p>
          </div>
        </div>
        <button className="px-6 py-3 bg-white border-2 border-slate-100 text-slate-700 font-black rounded-2xl hover:border-violet-600 hover:text-violet-600 transition-all flex items-center gap-2 shadow-sm">
          {t('View All')}
        </button>
      </div>

      <div className="space-y-4">
        {analyses.map((analysis, index) => (
          <AnalysisItem key={index} analysis={analysis} />
        ))}
      </div>
    </div>
  );
};

const AnalysisItem = ({ analysis }) => {
  const { t } = useTranslation();

  const getStatusChip = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-black rounded-full border-2 border-emerald-100">{t('Completed')}</span>;
      case 'In Progress':
        return <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-black rounded-full border-2 border-amber-100">{t('In Progress')}</span>;
      default:
        return <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-black rounded-full border-2 border-slate-100">{t('Queued')}</span>;
    }
  };

  return (
    <div className="bg-slate-50/50 p-4 rounded-2xl flex items-center justify-between transition-all hover:shadow-md hover:bg-white">
      <div className="flex items-center gap-4">
        <img src={analysis.imageUrl} alt={analysis.product} className="w-16 h-16 rounded-xl object-cover" />
        <div>
          <h4 className="font-black text-slate-800">{analysis.product}</h4>
          <p className="text-sm text-slate-400 font-bold">{new Date(analysis.date.seconds * 1000).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        {getStatusChip(analysis.status)}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          <span className="font-black text-slate-800 text-lg">{analysis.score.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default AnalysisList;
