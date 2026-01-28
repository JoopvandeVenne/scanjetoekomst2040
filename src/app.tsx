
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { GameState, Interest, Choice, CareerResult, UserProfile } from './types';
import { TALENTS, ENVIRONMENTS, DRIVES, GENDERS, SUPERPOWERS } from './constants';
import { generateCareerContent } from './services/geminiService';
import { supabase } from './lib/supabase';
import ViewToekomstID from './components/ViewToekomstID';
import { getContextualMessage } from './services/adaptationService';
import { playClickSound, playSuccessSound } from './services/audioService';


const PassportCard = React.forwardRef<HTMLDivElement, { isLarge?: boolean; result: CareerResult | null; userProfile: UserProfile; uniqueId?: string }>(({ isLarge = false, result, userProfile }, ref) => {
  return (
  <div ref={ref} className={`relative bg-slate-900 rounded-[2rem] border-2 border-blue-500/40 overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.3)] p-1 w-full ${isLarge ? 'max-w-4xl' : 'max-w-lg mx-auto lg:mx-0'}`}>
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500"></div>
    <div className={`${isLarge ? 'p-6 md:p-10 space-y-6 md:space-y-10 flex flex-col' : 'p-6 md:p-8 space-y-6'}`}>
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <i className={`fas fa-microchip ${isLarge ? 'text-2xl' : 'text-sm'} text-blue-400`}></i>
            <h4 className={`${isLarge ? 'text-3xl' : 'text-lg'} font-orbitron font-bold tracking-tighter text-white uppercase`}>Toekomst ID</h4>
          </div>
          <p className={`${isLarge ? 'text-[12px]' : 'text-[8px]'} text-blue-400/60 font-mono uppercase tracking-[0.2em]`}>Digital_Entity // 2040_AUTH</p>
        </div>
        <div className="text-right font-orbitron">
          <div className={`${isLarge ? 'text-[10px]' : 'text-[10px]'} text-slate-500 uppercase`}>Geldigheidsduur</div>
          <div className={`${isLarge ? 'text-2xl' : 'text-base'} font-bold text-emerald-400 tracking-widest`}>2040-2050</div>
        </div>
      </div>
      
      <div className={`flex flex-col sm:flex-row ${isLarge ? 'gap-10' : 'gap-6'}`}>
        <div className={`relative ${isLarge ? 'w-56 sm:w-72' : 'w-full sm:w-44'} aspect-square rounded-[2rem] overflow-hidden border-2 border-white/10 bg-slate-800 shrink-0 shadow-2xl`}>
          <img src="/chatgpt_image_28_jan_2026,_18_21_17.png" alt="Toekomst Avatar" className="w-full h-full object-cover" />
          <div className="absolute bottom-0 w-full bg-blue-600/80 backdrop-blur-md text-[10px] text-center py-1.5 font-orbitron uppercase tracking-widest text-white">BIO_SCAN_OK</div>
        </div>
        <div className={`flex-1 ${isLarge ? 'space-y-6' : 'space-y-4'} flex flex-col justify-center`}>
          <div>
            <div className={`${isLarge ? 'text-[12px]' : 'text-[10px]'} text-slate-500 font-orbitron uppercase tracking-widest mb-1`}>Naam Entiteit</div>
            <div className={`${isLarge ? 'text-5xl' : 'text-2xl'} font-orbitron font-bold text-white uppercase tracking-tight leading-none`}>{userProfile.name}</div>
          </div>
          <div>
            <div className={`${isLarge ? 'text-[12px]' : 'text-[10px]'} text-slate-500 font-orbitron uppercase tracking-widest mb-1`}>Gekoppeld Beroep</div>
            <div className={`${isLarge ? 'text-3xl' : 'text-lg'} font-bold text-blue-400 leading-tight uppercase tracking-tight`}>{result?.jobTitle}</div>
          </div>
        </div>
      </div>

      <div className={`${isLarge ? 'grid grid-cols-2 gap-8' : 'space-y-6'} pt-4 border-t border-white/10`}>
        <div className="bg-white/5 rounded-[1.5rem] p-5 md:p-8 border border-white/5 shadow-inner">
          <div className={`${isLarge ? 'text-[10px]' : 'text-[10px]'} text-blue-400 font-orbitron mb-3 uppercase tracking-widest`}>Mijn Sector</div>
          <div className={`${isLarge ? 'text-xl' : 'text-base'} font-bold text-white mb-3 leading-tight uppercase`}>{result?.sectorType}</div>
          <div className={`${isLarge ? 'text-base' : 'text-xs'} text-slate-300 leading-relaxed font-light`}>{result?.description}</div>
        </div>
        <div className="bg-emerald-500/5 rounded-[1.5rem] p-5 md:p-8 border border-emerald-500/20 shadow-inner flex flex-col justify-center relative overflow-hidden min-h-[140px]">
          <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
            <i className="fas fa-graduation-cap text-7xl"></i>
          </div>
          <div className={`${isLarge ? 'text-[10px]' : 'text-[10px]'} text-emerald-400 font-orbitron mb-3 uppercase tracking-widest`}>Dendron Opleidingstraject</div>
          <div className={`${isLarge ? 'text-base' : 'text-xs'} leading-relaxed font-light italic text-slate-200 relative z-10`}>{result?.dendronTraining}</div>
        </div>
      </div>
    </div>
    <div className="absolute bottom-3 right-8 opacity-20 font-mono text-[10px] tracking-[0.5em] text-white">#DENDRON_HUB_SECURED</div>
  </div>
  );
});

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('');
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', gender: '', superpowers: [] });
  const [selectedTalents, setSelectedTalents] = useState<Interest[]>([]);
  const [selectedEnv, setSelectedEnv] = useState<Choice | null>(null);
  const [selectedDrive, setSelectedDrive] = useState<Choice | null>(null);
  const [result, setResult] = useState<CareerResult | null>(null);
  const [_error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState("Systeem opstarten...");
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [uniqueId, setUniqueId] = useState<string | null>(null);
  const [animatedYear, setAnimatedYear] = useState(2026);
  const [isYearBlinking, setIsYearBlinking] = useState(false);

  const passportRef = useRef<HTMLDivElement>(null);
  const fullscreenPassportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (gameState === GameState.START) {
      let currentYear = 2026;
      const targetYear = 2040;
      const duration = 8000;
      const steps = targetYear - currentYear;
      const stepDuration = duration / steps;
      let countInterval: any;
      let blinkTimeout: any;

      countInterval = setInterval(() => {
        currentYear++;
        setAnimatedYear(currentYear);
        if (currentYear >= targetYear) {
          clearInterval(countInterval);
          setIsYearBlinking(true);

          blinkTimeout = setTimeout(() => {
            setIsYearBlinking(false);
            currentYear = 2025;
            setAnimatedYear(2026);

            countInterval = setInterval(() => {
              currentYear++;
              setAnimatedYear(currentYear);
              if (currentYear >= targetYear) {
                clearInterval(countInterval);
                setIsYearBlinking(true);
              }
            }, stepDuration);
          }, 10000);
        }
      }, stepDuration);

      return () => {
        clearInterval(countInterval);
        clearTimeout(blinkTimeout);
        setIsYearBlinking(false);
      };
    }
  }, [gameState]);

  const initEverything = () => {
    setGameState(GameState.ONBOARDING);
  };

  const resetGame = () => {
    setGameState(GameState.START);
    setUserProfile({ name: '', gender: '', superpowers: [] });
    setSelectedTalents([]);
    setSelectedEnv(null);
    setSelectedDrive(null);
    setResult(null);
    setError(null);
    setShowFullscreen(false);
    setUniqueId(null);
    setAnimatedYear(2026);
    setIsYearBlinking(false);
  };

  const handleDownload = async () => {
    const targetRef = showFullscreen ? fullscreenPassportRef.current : passportRef.current;
    if (!targetRef) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(targetRef, {
        scale: 2,
        backgroundColor: '#0f172a',
        useCORS: true,
        logging: false,
      });
      const image = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement('a');
      link.href = image;
      link.download = `Toekomst_ID_${userProfile.name}.jpg`;
      link.click();
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (gameState === GameState.GENERATING) {
      const messages = ["DNA scannen...", "AI analyseert...", "Paspoort printen...", "Neurale koppeling..."];
      let i = 0;
      interval = setInterval(() => {
        setLoadingText(messages[i % messages.length]);
        i++;
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (gameState === GameState.RESULT && result) {
      const timer = setTimeout(() => {
        setShowFullscreen(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [gameState, result]);

  const runAnalysis = async () => {
    setGameState(GameState.GENERATING);
    try {
      const career = await generateCareerContent(userProfile, selectedTalents, selectedEnv!, selectedDrive!);
      setResult(career);

      const { data, error: dbError } = await supabase
        .from('toekomst_ids')
        .insert({
          name: userProfile.name,
          gender: userProfile.gender,
          superpowers: userProfile.superpowers,
          job_title: career.jobTitle,
          dendron_world: career.dendronWorld,
          sector_type: career.sectorType || '',
          description: career.description,
          dendron_training: career.dendronTraining,
          image_url: null
        })
        .select('id')
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
      } else if (data) {
        setUniqueId(data.id);
      }

      playSuccessSound();
      setGameState(GameState.RESULT);
    } catch (err) {
      setError("Storing! Probeer het opnieuw.");
      setGameState(GameState.ONBOARDING);
    }
  };

  const handleStateChange = (newState: GameState) => {
    setGameState(newState);
  };

  const StepIndicator = ({ step }: { step: number }) => (
    <div className="flex justify-center gap-2 mb-8">
      {[1, 2, 3, 4, 5].map(s => (
        <div key={s} className={`h-1.5 w-10 rounded-full transition-all ${step >= s ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]' : 'bg-slate-800'}`} />
      ))}
    </div>
  );

  if (currentRoute.startsWith('#/view/')) {
    const viewId = currentRoute.replace('#/view/', '');
    return <ViewToekomstID id={viewId} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 font-inter overflow-x-hidden">
      
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#020617_100%)]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/30 blur-[120px] animate-pulse"></div>
      </div>

      <main className={`relative z-10 w-full ${gameState === GameState.RESULT ? 'max-w-6xl' : 'max-w-4xl'} glass rounded-[2.5rem] p-6 md:p-12 border border-white/10 shadow-2xl transition-all duration-700 max-h-[90vh] overflow-y-auto custom-scrollbar`}>
        
        {gameState === GameState.START && (
          <div className="text-center py-12 space-y-12 animate-fadeIn flex flex-col items-center">
            <div className="space-y-8 flex flex-col items-center w-full">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-16 bg-[#ffcc00] mb-4 shadow-[0_10px_30px_rgba(255,204,0,0.3)]" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                <div className="space-y-1">
                  <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white whitespace-nowrap px-4">
                    Dendron <span className="font-light opacity-90">college</span>
                  </h2>
                  <p className="italic text-lg md:text-2xl text-slate-300 font-serif">samen leren, samen leven</p>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className={`text-5xl md:text-8xl font-orbitron font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-blue-200 to-blue-500 py-2 ${isYearBlinking ? 'animate-yearBlink' : ''}`}>
                  Jij in {animatedYear}
                </h1>
                <p className="text-slate-400 text-lg md:text-xl font-light tracking-widest uppercase font-orbitron opacity-70">Toekomst Analyse Systeem</p>
              </div>
            </div>
            
            <button
                            onClick={() => { playClickSound(); initEverything(); }}
              className="px-20 py-10 bg-blue-600 hover:bg-blue-500 rounded-[3rem] text-4xl font-bold font-orbitron transition-all transform hover:scale-105 shadow-[0_0_60px_rgba(37,99,235,0.5)] border border-blue-400/30 group animate-gentleBlink"
            >
              START DE SCAN <i className="fas fa-fingerprint ml-4 text-blue-200 group-hover:animate-pulse"></i>
            </button>
          </div>
        )}

        {gameState === GameState.ONBOARDING && (
          <div className="space-y-10 animate-fadeIn">
            <StepIndicator step={1} />
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-orbitron font-bold">Wie ben jij?</h2>
            </div>
            <div className="max-w-md mx-auto space-y-8">
              <input
                type="text"
                value={userProfile.name}
                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                placeholder="Je voornaam..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl focus:outline-none focus:border-blue-500 transition-all text-center placeholder:text-slate-600 font-orbitron tracking-widest uppercase"
              />
              <div className="grid grid-cols-3 gap-4">
                {GENDERS.map(g => (
                  <button
                    key={g.id}
                    onClick={() => { playClickSound(); setUserProfile({...userProfile, gender: g.label}); }}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${userProfile.gender === g.label ? 'border-blue-400 bg-blue-500/20 shadow-lg scale-105' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                  >
                    <i className={`fas ${g.icon} text-2xl`}></i>
                    <span className="text-[10px] font-bold uppercase font-orbitron">{g.label}</span>
                  </button>
                ))}
              </div>
              <button
                                disabled={!userProfile.name || !userProfile.gender}
                onClick={() => { playClickSound(); handleStateChange(GameState.STEP_SUPERPOWER); }}
                className="w-full py-5 bg-blue-600 disabled:opacity-20 rounded-2xl font-bold text-xl font-orbitron transition-all shadow-lg uppercase tracking-widest"
              >
                VOLGENDE
              </button>
            </div>
          </div>
        )}

        {gameState === GameState.STEP_SUPERPOWER && (
          <div className="space-y-10 animate-fadeIn">
            <StepIndicator step={2} />
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-orbitron font-bold uppercase tracking-tight">Jouw Superkrachten?</h2>
              <p className="text-slate-400">Kies er <span className="text-emerald-400 font-bold">exact 2</span> die bij jou passen.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {SUPERPOWERS.map(s => {
                const isSelected = userProfile.superpowers.includes(s.label);
                return (
                  <button
                    key={s.id}
                                        onClick={() => {
                                            playClickSound();
                                            if (isSelected) {
                        setUserProfile({...userProfile, superpowers: userProfile.superpowers.filter(sp => sp !== s.label)});
                      } else if (userProfile.superpowers.length < 2) {
                        setUserProfile({...userProfile, superpowers: [...userProfile.superpowers, s.label]});
                      }
                    }}
                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${isSelected ? 'border-emerald-400 bg-emerald-500/20 shadow-lg scale-105' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                  >
                    <i className={`fas ${s.icon} text-3xl text-emerald-400`}></i>
                    <span className="text-sm font-bold uppercase font-orbitron text-center leading-tight">{s.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-center">
              <button
                                disabled={userProfile.superpowers.length !== 2}
                onClick={() => { playClickSound(); handleStateChange(GameState.STEP_TALENTS); }}
                className="px-12 py-4 bg-blue-600 disabled:opacity-20 rounded-xl font-bold font-orbitron transition-all uppercase tracking-widest"
              >
                VOLGENDE
              </button>
            </div>
          </div>
        )}

        {gameState === GameState.STEP_TALENTS && (
          <div className="space-y-8 animate-fadeIn">
            <StepIndicator step={3} />
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-orbitron font-bold uppercase tracking-tight">Jouw Talent?</h2>
              <p className="text-slate-500 mt-2">Kies <span className="text-blue-400 font-bold">exact 3</span> kwaliteiten.</p>
              {userProfile.superpowers.length > 0 && (
                <p className="text-emerald-400 text-sm italic animate-pulse">
                  {getContextualMessage('talents', userProfile)}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {TALENTS.map(t => {
                const isSelected = !!selectedTalents.find(s => s.id === t.id);
                return (
                  <button
                    key={t.id}
                                        onClick={() => {
                                            playClickSound();
                                            if (isSelected) {
                        setSelectedTalents(selectedTalents.filter(s => s.id !== t.id));
                      } else if (selectedTalents.length < 3) {
                        setSelectedTalents([...selectedTalents, t]);
                      }
                    }}
                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${isSelected ? 'border-blue-400 bg-blue-500/20 scale-105 shadow-xl' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                  >
                    <i className={`fas ${t.icon} text-3xl text-blue-400`}></i>
                    <span className="font-bold text-sm uppercase font-orbitron text-center">{t.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-center">
              <button
                                disabled={selectedTalents.length !== 3}
                onClick={() => { playClickSound(); handleStateChange(GameState.STEP_ENVIRONMENT); }}
                className="px-12 py-4 bg-blue-600 disabled:opacity-20 rounded-xl font-bold font-orbitron transition-all uppercase tracking-widest"
              >
                VOLGENDE
              </button>
            </div>
          </div>
        )}

        {gameState === GameState.STEP_ENVIRONMENT && (
          <div className="space-y-8 animate-fadeIn">
            <StepIndicator step={4} />
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-orbitron font-bold uppercase tracking-tight">Waar werk je graag?</h2>
              {selectedTalents.length > 0 && (
                <p className="text-emerald-400 text-sm italic">
                  {getContextualMessage('environment', userProfile, selectedTalents)}
                </p>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {ENVIRONMENTS.map(env => (
                <button
                  key={env.id}
                  onClick={() => { playClickSound(); setSelectedEnv(env); }}
                  className={`p-8 rounded-[2rem] border-2 text-left transition-all flex items-start gap-6 ${selectedEnv?.id === env.id ? 'border-blue-400 bg-blue-500/20 shadow-xl scale-[1.02]' : 'border-white/5 bg-white/5'}`}
                >
                  <div className="p-4 bg-blue-500/20 rounded-2xl"><i className={`fas ${env.icon} text-2xl text-blue-400`}></i></div>
                  <div><h3 className="font-bold text-xl mb-1 uppercase font-orbitron">{env.label}</h3><p className="text-sm text-slate-500">{env.description}</p></div>
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              <button disabled={!selectedEnv} onClick={() => { playClickSound(); handleStateChange(GameState.STEP_DRIVE); }} className="px-12 py-4 bg-blue-600 disabled:opacity-20 rounded-xl font-bold font-orbitron uppercase tracking-widest">LAATSTE STAP</button>
            </div>
          </div>
        )}

        {gameState === GameState.STEP_DRIVE && (
          <div className="space-y-8 animate-fadeIn">
            <StepIndicator step={5} />
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-orbitron font-bold uppercase tracking-tight">Wat wil je bereiken?</h2>
              {selectedEnv && (
                <p className="text-emerald-400 text-sm italic">
                  {getContextualMessage('drive', userProfile, selectedTalents, selectedEnv)}
                </p>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {DRIVES.map(drive => (
                <button
                  key={drive.id}
                  onClick={() => { playClickSound(); setSelectedDrive(drive); }}
                  className={`p-8 rounded-[2rem] border-2 text-left transition-all flex items-start gap-6 ${selectedDrive?.id === drive.id ? 'border-blue-400 bg-blue-500/20 shadow-xl scale-[1.02]' : 'border-white/5 bg-white/5'}`}
                >
                  <div className="p-4 bg-blue-500/20 rounded-2xl"><i className={`fas ${drive.icon} text-2xl text-blue-400`}></i></div>
                  <div><h3 className="font-bold text-xl mb-1 uppercase font-orbitron">{drive.label}</h3><p className="text-sm text-slate-500">{drive.description}</p></div>
                </button>
              ))}
            </div>
            <div className="flex justify-center pt-6">
              <button
                                disabled={!selectedDrive}
                onClick={() => { playClickSound(); runAnalysis(); }}
                className="px-16 py-6 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl font-bold text-xl font-orbitron shadow-lg uppercase tracking-widest"
              >
                GENEREER TOEKOMST ID
              </button>
            </div>
          </div>
        )}

        {gameState === GameState.GENERATING && (
          <div className="py-24 flex flex-col items-center gap-12 text-center animate-fadeIn">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 border-[10px] border-blue-500/10 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 border-[10px] border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                  <i className="fas fa-brain text-4xl text-blue-400 animate-pulse"></i>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-orbitron font-bold tracking-widest uppercase">{loadingText}</h3>
              <p className="text-slate-500 italic font-orbitron text-xs">AI-Core: Actief // Verbinding: Optimaal</p>
            </div>
          </div>
        )}

        {gameState === GameState.RESULT && result && (
          <div className="animate-fadeIn space-y-8 md:space-y-12">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
              {/* Linkerkolom: De Kaart */}
              <div className="flex flex-col items-center lg:items-start lg:sticky lg:top-0">
                <div
                  className="transform hover:scale-[1.02] transition-transform duration-500 cursor-pointer w-full"
                  onClick={() => { playClickSound(); setShowFullscreen(true); }}
                >
                  <PassportCard ref={passportRef} result={result} userProfile={userProfile} uniqueId={uniqueId || undefined} />
                </div>
                <div className="text-center w-full mt-4 text-blue-400/80 text-[10px] animate-pulse font-orbitron uppercase tracking-widest flex items-center justify-center gap-2">
                  <i className="fas fa-search-plus"></i> Klik op de kaart om te vergroten
                </div>
              </div>

              {/* Rechterkolom: Tekst en Acties */}
              <div className="flex flex-col h-full justify-between gap-8">
                <div className="space-y-6 text-center lg:text-left">
                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-5xl font-orbitron font-bold text-white leading-tight uppercase tracking-tighter">ID GEVALIDEERD</h2>
                    <p className="text-blue-400 font-mono text-[9px] tracking-[0.3em] uppercase">Systeem_Status: Koppeling_OK</p>
                  </div>
                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
                    Geweldig, <span className="text-white font-bold">{userProfile.name}</span>! Je bent geanalyseerd. Hieronder vind je jouw Toekomst-ID.
                  </p>
                </div>
                
                {/* Actieknoppen onderaan - Compacter gemaakt */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                                        onClick={() => { playClickSound(); setShowFullscreen(true); }}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl font-bold font-orbitron shadow-lg border border-white/10 flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95 group text-sm"
                  >
                    <i className="fas fa-expand group-hover:scale-110 transition-transform"></i>
                    <span className="tracking-tight">BEKIJK VOLLEDIG SCHERM</span>
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      disabled={isDownloading}
                      onClick={() => { playClickSound(); handleDownload(); }}
                      className="py-3 bg-emerald-600/10 border border-emerald-500/30 hover:bg-emerald-600/20 rounded-xl font-bold font-orbitron transition-all text-[9px] tracking-widest uppercase text-emerald-400 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-download"></i>
                      {isDownloading ? 'BEZIG...' : 'DOWNLOAD'}
                    </button>
                    <button
                      onClick={() => { playClickSound(); resetGame(); }}
                      className="py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold font-orbitron transition-all text-[9px] tracking-widest uppercase text-slate-400 flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-redo"></i>
                      OPNIEUW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showFullscreen && result && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/98 backdrop-blur-3xl flex flex-col items-center p-4 md:p-8 animate-fadeIn overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-6xl flex flex-col items-center gap-8 py-6 md:py-10">
            <div className="text-center space-y-1 md:space-y-2 flex-shrink-0">
              <h2 className="text-3xl md:text-6xl font-orbitron font-bold text-emerald-400 uppercase tracking-tighter">JOUW TOEKOMST ID</h2>
              <p className="text-white/40 font-orbitron tracking-[0.4em] uppercase text-[9px] md:text-xs">Dendron_Hub_Gegevens // 2040_AUTH</p>
            </div>
            
            <div className="w-full flex justify-center items-center">
              <div className="w-full max-w-full overflow-x-hidden flex justify-center">
                <PassportCard ref={fullscreenPassportRef} isLarge={true} result={result} userProfile={userProfile} uniqueId={uniqueId || undefined} />
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 flex-shrink-0 pb-10">
              <button
                disabled={isDownloading}
                onClick={() => { playClickSound(); handleDownload(); }}
                className="px-8 md:px-10 py-3 md:py-4 bg-emerald-600 rounded-full font-bold font-orbitron flex items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95 text-[11px] md:text-sm text-white disabled:opacity-50 uppercase tracking-widest"
              >
                <i className="fas fa-download"></i> {isDownloading ? 'OPSLAAN...' : 'OPSLAAN'}
              </button>
              <button
                onClick={() => { playClickSound(); setShowFullscreen(false); }}
                className="px-8 md:px-10 py-3 md:py-4 bg-slate-800 rounded-full font-bold font-orbitron flex items-center gap-2 border border-white/10 transition-all hover:bg-slate-700 active:scale-95 text-[11px] md:text-sm uppercase tracking-widest"
              >
                <i className="fas fa-times"></i> SLUITEN
              </button>
              <button
                onClick={() => { playClickSound(); resetGame(); }}
                className="px-8 md:px-10 py-3 md:py-4 bg-blue-600/10 rounded-full font-bold font-orbitron flex items-center gap-2 border border-blue-500/40 transition-all hover:bg-blue-600/20 active:scale-95 text-[11px] md:text-sm text-blue-200 uppercase tracking-widest"
              >
                <i className="fas fa-home"></i> HOME
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-8 mb-4 text-white text-[10px] font-orbitron tracking-[0.5em] text-center space-y-4 uppercase flex-shrink-0">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent max-w-xs mx-auto mb-4"></div>
        <div>OPEN DAG 2026 // DENDRON COLLEGE HUB</div>
        <div className="opacity-20 flex justify-center gap-6">
          <i className="fas fa-atom"></i>
          <i className="fas fa-dna"></i>
          <i className="fas fa-satellite"></i>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes gentleBlink {
          0%, 100% { opacity: 1; box-shadow: 0 0 60px rgba(37, 99, 235, 0.5); }
          50% { opacity: 0.7; box-shadow: 0 0 40px rgba(37, 99, 235, 0.3); }
        }
        .animate-gentleBlink { animation: gentleBlink 2s ease-in-out infinite; }

        @keyframes yearBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-yearBlink { animation: yearBlink 0.5s ease-in-out infinite; }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
}
