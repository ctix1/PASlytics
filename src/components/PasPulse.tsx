import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const PasPulse = ({ pulse }) => {
  const { t } = useTranslation();

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="w-8 h-8 text-emerald-500" />;
    if (trend < 0) return <TrendingDown className="w-8 h-8 text-red-500" />;
    return <Minus className="w-8 h-8 text-slate-500" />;
  };

  return (
    <div className="bg-white border-2 border-slate-50 rounded-[3rem] p-10 shadow-sm h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-black text-slate-900 mb-2">{t('PAS Pulse')}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('Market sentiment score')}</p>
      </div>
      <div className="text-center">
        <p className="text-7xl font-black text-violet-600">{pulse ? pulse.score.toFixed(1) : '--'}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {pulse && getTrendIcon(pulse.trend)}
          <p className="text-slate-500 font-bold"><span className="text-slate-800 font-black">{pulse ? pulse.trend.toFixed(1) : '--'}%</span> {t('vs last week')}</p>
        </div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{t('Updated hourly')}</p>
      </div>
    </div>
  );
};

export default PasPulse;
