import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy, limit, addDoc, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDropzone } from 'react-dropzone';
import AnalysisList from '../components/AnalysisList';
import PasPulse from '../components/PasPulse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [pasPulse, setPasPulse] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) return;
    setIsUploading(true);

    try {
      for (const file of acceptedFiles) {
        const storageRef = ref(storage, `uploads/${user.uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        await addDoc(collection(db, 'analysis'), {
          product: file.name.split('.')[0],
          imageUrl: downloadURL,
          status: 'In Progress',
          date: new Date(),
          score: 0,
          user: user.displayName || user.email,
          userId: user.uid,
        });
      }
    } catch (error) {
      console.error('Error uploading files: ', error);
      alert('Failed to upload files.');
    } finally {
      setIsUploading(false);
    }
  }, [user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': ['.jpeg', '.png', '.webp'] } });

  useEffect(() => {
    if (!user) return;

    const analysisQuery = query(collection(db, 'analysis'), where('userId', '==', user.uid), orderBy('date', 'desc'), limit(5));
    const unsubscribeAnalysis = onSnapshot(analysisQuery, (snapshot) => {
      const analysisList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnalyses(analysisList);
    });

    const pulseQuery = query(collection(db, 'pasPulse'), limit(1));
    const unsubscribePulse = onSnapshot(pulseQuery, (snapshot) => {
      if (!snapshot.empty) {
        setPasPulse(snapshot.docs[0].data());
      }
    });

    return () => {
      unsubscribeAnalysis();
      unsubscribePulse();
    };
  }, [user]);

  const chartData = analyses.map(a => ({ name: a.product, value: a.score })).reverse();
  const COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div
            {...getRootProps()}
            className={`bg-white border-2 rounded-[3rem] p-12 flex flex-col items-center justify-center min-h-[450px] shadow-sm relative overflow-hidden group cursor-pointer hover:border-violet-100 hover:shadow-2xl hover:shadow-violet-100 transition-all duration-500 ${
              isDragActive ? 'border-violet-600 bg-violet-50' : 'border-slate-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="absolute top-0 left-0 w-full h-2 bg-violet-600"></div>
            <div className="w-24 h-24 bg-violet-50 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Upload className="w-12 h-12 text-violet-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 text-center">
              {isDragActive ? t('Drop the files here ...') : t('Upload product images')}
            </h3>
            <p className="text-slate-500 text-center max-w-sm mb-10 font-bold leading-relaxed">
              {t('Drag and drop your images here, or click to browse. Supports JPG, PNG and WEBP.')}
            </p>
            <button className="px-10 py-4 bg-white border-2 border-slate-100 text-slate-700 font-black rounded-2xl group-hover:border-violet-600 group-hover:text-violet-600 transition-all flex items-center gap-4 shadow-sm" disabled={isUploading}>
              {isUploading ? t('Uploading...') : t('Select Files')}
            </button>
          </div>

          <PasPulse pulse={pasPulse} />
        </div>

        <AnalysisList analyses={analyses} />
      </div>

      <div className="bg-white border-2 border-slate-50 rounded-[3rem] p-10 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 mb-4">{t('Analysis Score Trend')}</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: '700' }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f8fafc', radius: 10 }}
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
              />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
