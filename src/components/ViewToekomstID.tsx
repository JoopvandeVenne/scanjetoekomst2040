import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CareerResult, UserProfile } from '../types';

interface ToekomstIDData {
  id: string;
  name: string;
  gender: string;
  superpowers: string[];
  job_title: string;
  dendron_world: string;
  sector_type: string;
  description: string;
  dendron_training: string;
  image_url: string | null;
  created_at: string;
}

export default function ViewToekomstID({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ToekomstIDData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: result, error: dbError } = await supabase
          .from('toekomst_ids')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (dbError) {
          setError('ID niet gevonden');
        } else if (result) {
          setData(result);
        } else {
          setError('ID niet gevonden');
        }
      } catch (err) {
        setError('Er ging iets mis');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-blue-400 font-orbitron">Toekomst ID laden...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <i className="fas fa-exclamation-triangle text-5xl text-red-400"></i>
          <h2 className="text-2xl font-orbitron font-bold">Fout</h2>
          <p className="text-slate-400">{error || 'Toekomst ID niet gevonden'}</p>
          <a href="/" className="inline-block px-6 py-3 bg-blue-600 rounded-xl font-orbitron font-bold">
            Terug naar Home
          </a>
        </div>
      </div>
    );
  }

  const result: CareerResult = {
    jobTitle: data.job_title,
    dendronWorld: data.dendron_world,
    sectorType: data.sector_type,
    description: data.description,
    dendronTraining: data.dendron_training,
    imageUrl: data.image_url || undefined
  };

  const userProfile: UserProfile = {
    name: data.name,
    gender: data.gender,
    superpowers: data.superpowers
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center p-4 md:p-8 overflow-y-auto">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#020617_100%)]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/30 blur-[120px] animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center gap-8 py-6 md:py-10">
        <div className="text-center space-y-1 md:space-y-2">
          <h1 className="text-3xl md:text-6xl font-orbitron font-bold text-emerald-400 uppercase tracking-tighter">JOUW TOEKOMST ID</h1>
          <p className="text-white/40 font-orbitron tracking-[0.4em] uppercase text-[9px] md:text-xs">Dendron_Hub_Gegevens // 2040_AUTH</p>
        </div>

        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-full overflow-x-hidden flex justify-center">
            <div className="relative bg-slate-900 rounded-[2rem] border-2 border-blue-500/40 overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.3)] p-1 w-full max-w-4xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500"></div>
              <div className="p-6 md:p-10 space-y-6 md:space-y-10 flex flex-col">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <i className="fas fa-microchip text-2xl text-blue-400"></i>
                      <h4 className="text-3xl font-orbitron font-bold tracking-tighter text-white uppercase">Toekomst ID</h4>
                    </div>
                    <p className="text-[12px] text-blue-400/60 font-mono uppercase tracking-[0.2em]">Digital_Entity // 2040_AUTH</p>
                  </div>
                  <div className="text-right font-orbitron">
                    <div className="text-[10px] text-slate-500 uppercase">Geldigheidsduur</div>
                    <div className="text-2xl font-bold text-emerald-400 tracking-widest">2040-2050</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-10">
                  <div className="relative w-56 sm:w-72 aspect-square rounded-[2rem] overflow-hidden border-2 border-white/10 bg-slate-800 shrink-0 shadow-2xl mx-auto sm:mx-0">
                    <img src="/chatgpt_image_28_jan_2026,_18_21_17.png" alt="Toekomst Avatar" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 w-full bg-blue-600/80 backdrop-blur-md text-[10px] text-center py-1.5 font-orbitron uppercase tracking-widest text-white">BIO_SCAN_OK</div>
                  </div>
                  <div className="flex-1 space-y-6 flex flex-col justify-center">
                    <div>
                      <div className="text-[12px] text-slate-500 font-orbitron uppercase tracking-widest mb-1">Naam Entiteit</div>
                      <div className="text-5xl font-orbitron font-bold text-white uppercase tracking-tight leading-none">{userProfile.name}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-slate-500 font-orbitron uppercase tracking-widest mb-1">Gekoppeld Beroep</div>
                      <div className="text-3xl font-bold text-blue-400 leading-tight uppercase tracking-tight">{result.jobTitle}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
                  <div className="bg-white/5 rounded-[1.5rem] p-5 md:p-8 border border-white/5 shadow-inner">
                    <div className="text-[10px] text-blue-400 font-orbitron mb-3 uppercase tracking-widest">Mijn Sector</div>
                    <div className="text-xl font-bold text-white mb-3 leading-tight uppercase">{result.sectorType}</div>
                    <div className="text-base text-slate-300 leading-relaxed font-light">{result.description}</div>
                  </div>
                  <div className="bg-emerald-500/5 rounded-[1.5rem] p-5 md:p-8 border border-emerald-500/20 shadow-inner flex flex-col justify-center relative overflow-hidden min-h-[140px]">
                    <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
                      <i className="fas fa-graduation-cap text-7xl"></i>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-orbitron mb-3 uppercase tracking-widest">Dendron Opleidingstraject</div>
                    <div className="text-base leading-relaxed font-light italic text-slate-200 relative z-10">{result.dendronTraining}</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-3 right-8 opacity-20 font-mono text-[10px] tracking-[0.5em] text-white">#DENDRON_HUB_SECURED</div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4 pb-10">
          <p className="text-slate-400 text-base md:text-lg">
            Wil jij ook je toekomst ontdekken?
          </p>
          <a
            href="/"
            className="inline-block px-10 py-4 md:px-12 md:py-5 bg-blue-600 hover:bg-blue-500 rounded-full font-bold font-orbitron shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all hover:scale-105 active:scale-95 text-sm md:text-base uppercase tracking-widest"
          >
            <i className="fas fa-rocket mr-2"></i>
            START JE EIGEN TOEKOMST SCAN
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
