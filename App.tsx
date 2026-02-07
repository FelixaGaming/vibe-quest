
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Scenario, Exchange, Choice, TranscriptEntry, 
  PlayerMetrics, BehavioralAnalysis, StrategyItem 
} from './types';
import { 
  SCENARIO_POOL, ATTRIBUTE_SET, PROSOCIAL_SET, 
  NEGATIVE_SET, STRATEGY_ITEMS 
} from './constants';
import Avatar from './components/Avatar';
import TypingIndicator from './components/TypingIndicator';
import Modal from './components/Modal';
import VibeTuningGame from './components/VibeTuningGame';

// Initialize Supabase (Using standard process.env variables)
const supabaseUrl = (process.env as any).SUPABASE_URL || '';
const supabaseKey = (process.env as any).SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// --- Reusable Components ---
const ChallengeCard: React.FC<{ 
  title: string; 
  desc: string; 
  emoji?: string; 
  color: string; 
  onClick: () => void;
  primary?: boolean;
  small?: boolean;
}> = ({ title, desc, emoji, color, onClick, primary, small }) => (
  <button 
    onClick={onClick}
    className={`group relative bg-white border-4 ${primary ? 'border-orange-500' : 'border-slate-100'} hover:border-slate-300 ${small ? 'p-4 rounded-[24px]' : 'p-6 rounded-[40px]'} text-left transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-200/40 overflow-hidden w-full`}
  >
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 group-hover:opacity-20 transition-opacity bg-slate-50 opacity-10`}></div>
    <div className="flex items-center space-x-4 relative z-10">
      {emoji && (
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:rotate-6 transition-transform shrink-0`}>
          {emoji}
        </div>
      )}
      <div className="flex-1">
        <h3 className={`${small ? 'text-lg' : 'text-xl'} font-black text-slate-800 mb-0.5 uppercase tracking-tight`}>{title}</h3>
        <p className="text-slate-400 text-[10px] font-bold leading-tight">{desc}</p>
      </div>
    </div>
  </button>
);

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'splash' | 'chat' | 'instant-result' | 'impact-details' | 'vibe-tuning' | 'achievements'>('splash');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [modals, setModals] = useState({ faq: false, share: false });
  const [mindAchievements, setMindAchievements] = useState<StrategyItem[]>([]);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const stageEndRef = useRef<HTMLDivElement>(null);

  // Helper: Log results to Supabase
  const logEvent = async (type: string, data: any) => {
    if (!supabase) return;
    try {
      await supabase.from('vibe_quest_events').insert([{
        event_type: type,
        data: data,
        timestamp: new Date().toISOString()
      }]);
    } catch (err) {
      console.error('Supabase logging failed:', err);
    }
  };

  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem('vibequestPlayCount') || '0');
    setPlayCount(savedCount);
    // Log app session start
    logEvent('app_session_start', { userAgent: navigator.userAgent });
  }, []);

  useEffect(() => {
    if (gameState === 'chat') {
      stageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript, isTyping, showChoices, gameState]);

  const mapToNewAttributes = (old: string[] = []) => {
    const map: Record<string, string> = {
      "Empathy": "Empathetic", "Validation": "Polite", "Reassurance": "Encouraging",
      "Inclusion": "Polite", "Coaching": "Encouraging", "De-escalation": "Polite",
      "Bridge-building": "Polite", "Encouragement": "Encouraging", "Fairness": "Polite",
      "Respect": "Polite", "Supportive": "Encouraging", "Curious": "Polite",
      "Affirming": "Encouraging", "Peacemaking": "Polite"
    };
    const s = new Set<string>();
    old.forEach(a => {
      if (map[a]) s.add(map[a]);
      if (ATTRIBUTE_SET.includes(a)) s.add(a);
    });
    return Array.from(s);
  };

  const shuffleArray = <T,>(a: T[]): T[] => {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[j], b[i]] = [b[j], b[i]];
    }
    return b;
  };

  const startVibeCheck = () => {
    const newCount = playCount + 1;
    setPlayCount(newCount);
    localStorage.setItem('vibequestPlayCount', newCount.toString());
    const randomized = shuffleArray(SCENARIO_POOL).slice(0, 5); 
    setScenarios(randomized);
    setScenarioIndex(0);
    setTranscript([]);
    setGameState('chat');
    startExchange(randomized[0]);
  };

  const startVibeTuning = () => setGameState('vibe-tuning');

  const startExchange = (scenario: Scenario) => {
    setIsTyping(true);
    setShowChoices(false);
    const ex = scenario.exchangePool[0];
    setTimeout(() => {
      setTranscript(prev => [...prev, {
        scenario: scenario.title,
        scenarioId: scenario.id,
        exchange: 1,
        user: ex.speaker,
        comment: ex.line,
        direction: 'Post',
        attributes: ex.post.attributes,
        toxic: !!ex.post.toxic,
        severity: ex.post.severity || null,
        target: ex.post.target || null,
        feeling: null
      }]);
      setIsTyping(false);
      setShowChoices(true);
    }, 1200);
  };

  const computePlayerMetrics = useCallback((): PlayerMetrics => {
    const rows = transcript.filter(r => r.user === 'Player');
    const totalLikes = rows.reduce((s, r) => s + (r.likes || 0), 0);
    const counts: Record<string, number> = Object.fromEntries(ATTRIBUTE_SET.map(a => [a, 0]));
    rows.forEach(r => r.mappedAttrs?.forEach(a => counts[a]++));
    return { 
      rows, counts, totalTagged: rows.length, 
      negativeRows: rows.filter(r => r.mappedAttrs?.some(a => NEGATIVE_SET.has(a))), 
      totalLikes, maxPossibleLikes: rows.length * 5 
    };
  }, [transcript]);

  const generateBehavioralAnalysis = useCallback((metrics: PlayerMetrics): BehavioralAnalysis => {
    const { rows } = metrics;
    let pc = 0, mc = 0, sc = 0;
    rows.forEach(r => {
      const attrs = r.mappedAttrs || [];
      if (attrs.some(a => ["Aggressive", "Rude", "Disrespectful", "Judgmental"].includes(a))) sc++;
      else if (attrs.some(a => ["Ignorant", "Ego-centric", "Neurotic", "Sarcasm", "Agitated", "Dismissive"].includes(a))) mc++;
      else if (attrs.some(a => PROSOCIAL_SET.has(a))) pc++;
    });
    const ts = (5 * pc) + (-2 * mc) + (-5 * sc);
    const pct = rows.length > 0 ? ((ts + (5 * rows.length)) / (10 * rows.length)) * 100 : 0;
    return { 
      kindnessScore: Math.round(Math.max(0, Math.min(100, pct))), 
      positiveCount: pc, mildNegativeCount: mc, severeNegativeCount: sc, 
      totalComments: rows.length, totalScore: ts, prosocialComments: pc, 
      negativeComments: mc + sc, topNegative: [], topStrengths: [], needsWork: (mc + sc) > 0 
    };
  }, []);

  const getRank = (s: number) => {
    if (s >= 80) return "Vibe Master";
    if (s >= 60) return "Positive Influence";
    if (s >= 40) return "Mixed Signals";
    if (s >= 20) return "Reactive Player";
    return "Toxic Hazard";
  };

  const handleChoice = (opt: Choice & { kind: string }) => {
    const currentScenario = scenarios[scenarioIndex];
    setShowChoices(false);
    const newEntry: TranscriptEntry = {
      scenario: currentScenario.title,
      scenarioId: currentScenario.id,
      exchange: 1,
      user: 'Player',
      comment: opt.text,
      direction: 'Reply',
      attributes: opt.attributes,
      toxic: !!opt.toxic,
      severity: opt.severity || null,
      likes: opt.likes || 0,
      target: opt.target || null,
      feeling: opt.feelings.text,
      mappedAttrs: mapToNewAttributes(opt.attributes)
    };
    const updatedTranscript = [...transcript, newEntry];
    setTranscript(updatedTranscript);

    setTimeout(async () => {
      if (scenarioIndex + 1 < scenarios.length) {
        setScenarioIndex(prev => prev + 1);
        startExchange(scenarios[scenarioIndex + 1]);
      } else {
        // Log Vibe Tune completion to Supabase
        const finalMetrics = {
          rows: updatedTranscript.filter(r => r.user === 'Player'),
          counts: {},
          totalTagged: updatedTranscript.length,
          negativeRows: [],
          totalLikes: 0,
          maxPossibleLikes: 0
        };
        const finalAnalysis = generateBehavioralAnalysis(finalMetrics as PlayerMetrics);
        logEvent('vibe_tune_complete', { 
          score: finalAnalysis.kindnessScore, 
          rank: getRank(finalAnalysis.kindnessScore),
          playCount: playCount + 1
        });
        setGameState('instant-result');
      }
    }, 1600);
  };

  const buildComprehensiveReport = () => {
    if (transcript.length === 0) {
      return `Check out Vibe Quest! I'm learning to master my digital vibes. Play here: ${window.location.href}`;
    }
    const m = computePlayerMetrics();
    const a = generateBehavioralAnalysis(m);
    let report = `🌟 VIBE QUEST MASTER REPORT 🌟\n`;
    report += `Kindness Score: ${a.kindnessScore}% | Rank: ${getRank(a.kindnessScore)}\n`;
    report += `Play now: ${window.location.href}`;
    return report;
  };

  const handleNativeShare = async () => {
    const report = buildComprehensiveReport();
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Vibe Quest', text: report, url: window.location.href });
      } catch (e) { copyToClipboard(report); }
    } else { copyToClipboard(report); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(null), 3000);
    });
  };

  const metrics = (gameState !== 'splash' && gameState !== 'chat' && gameState !== 'vibe-tuning') ? computePlayerMetrics() : null;
  const analysis = metrics ? generateBehavioralAnalysis(metrics) : null;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col max-w-2xl mx-auto shadow-xl ring-1 ring-slate-100 relative overflow-x-hidden">
      {/* Header */}
      <header className="p-4 bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setGameState('splash')}>
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg">V</div>
          <span className="font-extrabold text-xl tracking-tighter text-slate-800 uppercase">Vibe Quest</span>
        </div>
        {(gameState === 'chat' || gameState === 'vibe-tuning') && (
          <button 
            onClick={() => setGameState('splash')} 
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-[10px] font-black uppercase transition-colors"
          >
            QUIT
          </button>
        )}
      </header>

      <main className={`flex-1 flex flex-col ${gameState === 'vibe-tuning' ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar p-6 pb-24'}`}>
        
        {/* --- SPLASH / HOME --- */}
        {gameState === 'splash' && (
          <div className="flex flex-col items-center pt-8 animate-pop">
            <div className="text-center px-4 mb-8">
              <h1 className="text-5xl font-black leading-tight tracking-tighter uppercase mb-2">
                <span className="bg-gradient-to-r from-orange-500 via-violet-500 to-indigo-600 bg-clip-text text-transparent text-8xl">Vibe Quest</span>
              </h1>
            </div>

            {/* Animated Hero Picture */}
            <div className="w-full flex justify-center mb-10 relative h-40">
              <div className="absolute inset-0 bg-orange-100/30 rounded-[64px] blur-3xl"></div>
              <div className="relative flex items-center justify-center">
                <div className="text-9xl animate-float">🌟</div>
                <div className="absolute -top-4 -right-4 text-4xl animate-bounce">⚡️</div>
                <div className="absolute -bottom-4 -left-4 text-4xl animate-pulse">💎</div>
              </div>
            </div>

            <div className="w-full max-w-md space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] text-center mb-4">Challenges</p>
                <ChallengeCard 
                  title="Check Your Vibe" 
                  desc="Vibe Tune: Face 5 social threads."
                  emoji="💬"
                  color="bg-orange-500"
                  onClick={startVibeCheck}
                  primary
                />
                <ChallengeCard 
                  title="Tune Your Vibe" 
                  desc="Action: Collect mental health tools."
                  emoji="💎"
                  color="bg-violet-600"
                  onClick={startVibeTuning}
                />
              </div>

              <div className="pt-6 space-y-4">
                <button 
                  onClick={() => setModals({...modals, share: true})}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl transform active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Share With Friends</span>
                  <span className="text-xl">🔗</span>
                </button>

                <button 
                  onClick={() => setModals({...modals, faq: true})}
                  className="w-full py-4 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest opacity-80"
                >
                  FAQ & Guide
                </button>
                
                <div className="text-center p-6 bg-slate-50 rounded-[40px] border border-slate-100 mt-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Us</p>
                  <a href="https://www.vibecheckbot.com" target="_blank" rel="noreferrer" className="block text-slate-800 font-bold text-sm mb-1">www.vibecheckbot.com</a>
                  <a href="mailto:go@vibecheckbot.com" className="block text-orange-500 font-black text-sm">go@vibecheckbot.com</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- CHAT --- */}
        {gameState === 'chat' && (
          <div className="space-y-6">
            <div className="text-center py-2">
              <span className="px-4 py-1.5 bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                Thread {scenarioIndex + 1} of {scenarios.length}
              </span>
            </div>
            {transcript.map((entry, idx) => (
              <div key={idx} className={`flex ${entry.user === 'Player' ? 'justify-end' : 'justify-start'} animate-pop`}>
                <div className={`flex items-end space-x-2 max-w-[85%] ${entry.user === 'Player' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar who={entry.user === 'Player' ? 'you' : (scenarios.find(s => s.title === entry.scenario)?.exchangePool[0].who as any)} size="md" />
                  <div className={`px-5 py-4 rounded-[28px] text-sm font-bold shadow-lg ${entry.user === 'Player' ? 'bg-orange-500 text-white' : 'bg-white border border-slate-100 text-slate-800'}`}>
                    {entry.comment}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && <TypingIndicator />}
            {showChoices && (
              <div className="grid grid-cols-1 gap-4 mt-12 animate-pop">
                <p className="text-center text-[10px] font-black text-orange-400 uppercase tracking-[0.3em]">Choose Your Reaction</p>
                {shuffleArray([
                  { kind: 'prosocial', ...scenarios[scenarioIndex].exchangePool[0].prosocial },
                  { kind: 'mild', ...scenarios[scenarioIndex].exchangePool[0].mild },
                  { kind: 'negative', ...scenarios[scenarioIndex].exchangePool[0].negative }
                ]).map((opt, i) => (
                  <button key={i} onClick={() => handleChoice(opt as any)} className="p-6 text-left bg-white border-4 border-slate-50 hover:border-orange-500 hover:bg-orange-50 rounded-[32px] text-lg font-black transition-all shadow-xl active:scale-95">
                    {opt.text}
                  </button>
                ))}
              </div>
            )}
            <div ref={stageEndRef} />
          </div>
        )}

        {/* --- VIBE COMPLETE (INSTANT RESULT) --- */}
        {gameState === 'instant-result' && (
          <div className="flex flex-col items-center justify-center text-center animate-pop pt-10 space-y-12">
            <h2 className="text-7xl font-black text-slate-900 leading-[0.9] uppercase tracking-tighter">Vibe Check <br/>Complete</h2>
            
            <div className="bg-slate-950 text-white p-12 rounded-[56px] w-full max-w-sm shadow-2xl relative overflow-hidden border-4 border-slate-800">
               <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
              <div className="text-[10px] font-black text-slate-500 tracking-[0.4em] mb-4 uppercase">Kindness Score</div>
              <div className="text-[100px] font-black text-orange-500 leading-none">{analysis?.kindnessScore}%</div>
              <p className="text-xl font-black mt-6 uppercase text-slate-100">{getRank(analysis?.kindnessScore || 0)}</p>
            </div>

            <div className="w-full max-w-xs space-y-6">
              <button 
                onClick={() => setGameState('impact-details')} 
                className="w-full py-8 bg-orange-500 text-white rounded-[40px] font-black text-3xl uppercase shadow-2xl shadow-orange-500/20 active:scale-95 transition-all"
              >
                Results 🔍
              </button>

              <div className="pt-6 space-y-4">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Secondary Actions</p>
                <ChallengeCard 
                  title="Tune Your Vibe" 
                  desc="Action game training."
                  color="bg-violet-600"
                  onClick={startVibeTuning}
                  small
                />
                <ChallengeCard 
                  title="Home" 
                  desc="Main dashboard."
                  color="bg-slate-800"
                  onClick={() => setGameState('splash')}
                  small
                />
              </div>
            </div>
          </div>
        )}

        {/* --- DETAILED REVIEW (IMPACT) --- */}
        {gameState === 'impact-details' && (
          <div className="space-y-10 animate-pop">
            <div className="text-center py-6">
              <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Impact</h2>
              <p className="text-slate-400 font-bold">See exactly how you affected others.</p>
            </div>
            
            {metrics?.rows.map((row, idx) => {
              const negAttr = row.mappedAttrs?.find(a => NEGATIVE_SET.has(a));
              const posAttr = row.mappedAttrs?.find(a => PROSOCIAL_SET.has(a));
              return (
                <div key={idx} className="bg-white border-4 border-slate-50 p-8 rounded-[48px] shadow-2xl space-y-6 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-2 ${negAttr ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Your Message</p>
                    <p className="text-xl font-black text-slate-800 italic leading-tight">"{row.comment}"</p>
                  </div>

                  <div className={`p-5 rounded-[24px] border-2 flex items-center space-x-3 ${negAttr ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                    <div className="text-2xl">{negAttr ? '⚠️' : '✨'}</div>
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-wider ${negAttr ? 'text-red-500' : 'text-green-500'}`}>Vibe Detected</p>
                      <p className={`text-lg font-black ${negAttr ? 'text-red-800' : 'text-green-800'}`}>
                        {negAttr ? `Toxic: ${negAttr}` : `Friendly: ${posAttr || 'Kind'}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                    <Avatar who={row.target?.toLowerCase() as any} size="md" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact on {row.target}</p>
                      <p className="text-lg font-black text-slate-800 leading-tight">"{row.feeling}"</p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="w-full max-w-sm mx-auto space-y-6 pt-10">
              <button 
                onClick={() => setModals({ ...modals, share: true })} 
                className="w-full py-7 bg-slate-900 text-white rounded-[32px] font-black text-2xl uppercase shadow-2xl active:scale-95 transition-all"
              >
                Share Results 📤
              </button>

              <div className="space-y-3">
                <ChallengeCard 
                  title="Tune Your Vibe" 
                  desc="Action game training."
                  color="bg-violet-600"
                  onClick={startVibeTuning}
                  small
                />
                <ChallengeCard 
                  title="Check Vibe Again" 
                  desc="Practice Vibe Tune."
                  color="bg-orange-500"
                  onClick={startVibeCheck}
                  small
                />
                <ChallengeCard 
                  title="Home" 
                  desc="Return to dashboard."
                  color="bg-slate-800"
                  onClick={() => setGameState('splash')}
                  small
                />
              </div>
            </div>
          </div>
        )}

        {/* --- ACTION GAME --- */}
        {gameState === 'vibe-tuning' && (
          <VibeTuningGame onComplete={async (achievements) => {
            setMindAchievements(achievements);
            // Log game completion to Supabase
            logEvent('vibe_tuning_complete', { 
              tools_count: achievements.length,
              playCount: playCount + 1
            });
            setGameState('achievements');
          }} />
        )}

        {/* --- ACHIEVEMENTS --- */}
        {gameState === 'achievements' && (
          <div className="space-y-12 animate-pop pt-8">
            <div className="text-center">
              <h2 className="text-6xl font-black text-slate-900 uppercase tracking-tighter">Tools <br/>Mastered</h2>
              <p className="text-slate-400 font-bold">You earned {mindAchievements.length} tools.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
              {mindAchievements.map((item) => (
                <div key={item.id} className="bg-white border-2 border-violet-50 p-6 rounded-[32px] flex items-center space-x-5 shadow-lg">
                  <div className="text-4xl shrink-0">{item.emoji}</div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase tracking-tight">{item.label}</h4>
                    <p className="text-[10px] text-slate-400 font-bold leading-tight">{item.tip}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full max-w-sm mx-auto space-y-6 pt-8">
              <button 
                onClick={() => setModals({ ...modals, share: true })} 
                className="w-full py-7 bg-slate-900 text-white rounded-[32px] font-black text-2xl uppercase shadow-2xl"
              >
                Share Achievements 📤
              </button>
              <ChallengeCard 
                title="Practice" 
                desc="Apply your new tools."
                color="bg-orange-500"
                onClick={startVibeCheck}
                small
              />
              <ChallengeCard 
                title="Home" 
                desc="Return home."
                color="bg-slate-800"
                onClick={() => setGameState('splash')}
                small
              />
            </div>
          </div>
        )}
      </main>

      {/* --- MODALS --- */}
      <Modal isOpen={modals.faq} onClose={() => setModals({ ...modals, faq: false })} title="Vibe Quest FAQ & Guide">
        <div className="space-y-8 font-bold text-slate-700">
          <div className="bg-orange-50 p-8 rounded-[40px]">
            <h4 className="text-orange-600 text-2xl font-black mb-2 uppercase">💬 Vibe Tune</h4>
            <p className="text-sm">The digital quest. Face real comments. Empathy builds rank, toxicity destroys it.</p>
          </div>
          <div className="bg-violet-50 p-8 rounded-[40px]">
            <h4 className="text-violet-600 text-2xl font-black mb-2 uppercase">💎 Vibe Tuning</h4>
            <p className="text-sm">The game. Catch mental tools to sharpen your emotional control.</p>
          </div>
          <div className="text-center p-4">
            <p className="text-xs text-slate-400 italic">"Treat others how you'd want to be treated."</p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modals.share} onClose={() => setModals({ ...modals, share: false })} title="Share Vibe Quest">
        <div className="flex flex-col space-y-4 text-center">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(buildComprehensiveReport())}`, '_blank')} className="py-6 bg-black text-white rounded-[24px] font-black text-xl uppercase">X</button>
            <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(buildComprehensiveReport())}`, '_blank')} className="py-6 bg-[#25D366] text-white rounded-[24px] font-black text-xl uppercase">WhatsApp</button>
          </div>
          <button onClick={() => copyToClipboard(buildComprehensiveReport())} className="w-full py-6 bg-slate-900 text-white rounded-[24px] font-black text-sm uppercase">
            <span>{copyStatus || "📋 Copy to Clipboard"}</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
