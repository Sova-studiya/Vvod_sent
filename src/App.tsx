import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Puzzle, 
  BookOpen, 
  Volume2, 
  Sparkles, 
  Settings2, 
  HelpCircle, 
  RotateCcw,
  Languages,
  Award,
  Gamepad2,
  Heart
} from 'lucide-react';
import { SENTENCES, CVC_VOCABULARY } from './data/sentences';
import { SentenceBuilder } from './components/SentenceBuilder';
import { PhonicsExplorer } from './components/PhonicsExplorer';
import { QuizGame } from './components/QuizGame';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { CelebrationModal } from './components/CelebrationModal';
import { GameMode } from './types';
import { sfx } from './utils/audio';

export default function App() {
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(0);
  const [gameMode, setGameMode] = useState<GameMode>('builder');
  const [speechRate, setSpeechRate] = useState<number>(0.72); // Slow default for 7yo
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  
  // Modals
  const [isPhonicsOpen, setIsPhonicsOpen] = useState<boolean>(false);
  const [phonicsInitialWord, setPhonicsInitialWord] = useState<string>('cup');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);

  const currentSentence = SENTENCES[currentSentenceIdx];

  const handleNextSentence = () => {
    if (currentSentenceIdx < SENTENCES.length - 1) {
      setCurrentSentenceIdx(prev => prev + 1);
    } else {
      setIsCelebrationOpen(true);
    }
  };

  const handlePrevSentence = () => {
    if (currentSentenceIdx > 0) {
      setCurrentSentenceIdx(prev => prev - 1);
    }
  };

  const handleOpenPhonicsForWord = (wordKey: string) => {
    setPhonicsInitialWord(wordKey);
    setIsPhonicsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/40 to-amber-100/40 flex flex-col font-sans text-slate-800">
      {/* HEADER / NAVIGATION BAR */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b-2 border-amber-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-xl shadow-md border border-amber-300">
              🧩
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
                  English CVC Builder
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider">
                  Для детей 7 лет
                </span>
              </div>
              <p className="text-[11px] text-amber-800/80 font-bold hidden sm:block">
                Медленная женская озвучка • CVC слова & Предложения
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <button
              id="mode-builder-tab"
              onClick={() => {
                sfx.playPop();
                setGameMode('builder');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                gameMode === 'builder'
                  ? 'bg-amber-400 text-amber-950 shadow-md scale-102'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Puzzle className="w-4 h-4" />
              <span>Конструктор</span>
            </button>

            <button
              id="mode-phonics-tab"
              onClick={() => {
                sfx.playPop();
                setPhonicsInitialWord(currentSentence.cvcWords[0] || 'cup');
                setIsPhonicsOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm text-slate-600 hover:text-indigo-700 transition-all"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">CVC</span>
              <span>Звуки</span>
            </button>

            <button
              id="mode-quiz-tab"
              onClick={() => {
                sfx.playPop();
                setGameMode('quiz');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                gameMode === 'quiz'
                  ? 'bg-amber-400 text-amber-950 shadow-md scale-102'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Викторина</span>
            </button>
          </div>

          {/* Quick Voice Settings & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="quick-rate-btn"
              onClick={() => {
                sfx.playPop();
                setIsSettingsOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-amber-100/80 hover:bg-amber-200 text-amber-950 font-black text-xs border border-amber-300 flex items-center gap-1.5 transition-colors"
              title="Настроить темп и голос"
            >
              <Volume2 className="w-4 h-4 text-amber-800" />
              <span className="hidden md:inline">Женский голос</span>
              <span className="bg-white/80 px-1.5 py-0.5 rounded text-[10px]">
                {Math.round(speechRate * 100)}%
              </span>
            </button>

            <button
              id="header-settings-btn"
              onClick={() => {
                sfx.playPop();
                setIsSettingsOpen(true);
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Настройки"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEW CONTENT */}
      <main className="flex-1 flex flex-col justify-center py-2 sm:py-4">
        {gameMode === 'builder' && (
          <SentenceBuilder
            sentenceData={currentSentence}
            currentIndex={currentSentenceIdx}
            totalSentences={SENTENCES.length}
            speechRate={speechRate}
            showTranslation={showTranslation}
            onNext={handleNextSentence}
            onPrev={handlePrevSentence}
            onSelectIndex={(idx) => setCurrentSentenceIdx(idx)}
            onOpenPhonicsModal={handleOpenPhonicsForWord}
          />
        )}

        {gameMode === 'quiz' && (
          <QuizGame
            speechRate={speechRate}
            onBackToBuilder={() => setGameMode('builder')}
          />
        )}
      </main>

      {/* FOOTER BAR WITH TEACHER & PARENT PHONICS TIPS */}
      <footer className="w-full bg-white/70 border-t border-amber-200/60 py-3 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-amber-800">CVC слова:</span>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
              cup • rug • bug • sun • mug • kid • mum • cat • mat • bat • cap
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span>Предлоги: <strong>on</strong> (на), <strong>in</strong> (в), <strong>by</strong> (рядом с)</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <AnimatePresence>
        {isPhonicsOpen && (
          <PhonicsExplorer
            initialWord={phonicsInitialWord}
            onClose={() => setIsPhonicsOpen(false)}
            speechRate={speechRate}
          />
        )}

        {isSettingsOpen && (
          <VoiceSettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            speechRate={speechRate}
            onRateChange={(rate) => setSpeechRate(rate)}
            showTranslation={showTranslation}
            onToggleTranslation={(show) => setShowTranslation(show)}
          />
        )}

        {isCelebrationOpen && (
          <CelebrationModal
            isOpen={isCelebrationOpen}
            onRestart={() => {
              setCurrentSentenceIdx(0);
              setIsCelebrationOpen(false);
            }}
            onOpenPhonics={() => {
              setIsCelebrationOpen(false);
              setIsPhonicsOpen(true);
            }}
            speechRate={speechRate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
