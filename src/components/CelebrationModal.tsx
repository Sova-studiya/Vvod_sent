import React from 'react';
import { motion } from 'motion/react';
import { Award, Star, RotateCcw, Sparkles, BookOpen, Volume2 } from 'lucide-react';
import { SENTENCES } from '../data/sentences';
import { speechEngine, sfx } from '../utils/audio';

interface CelebrationModalProps {
  isOpen: boolean;
  onRestart: () => void;
  onOpenPhonics: () => void;
  speechRate: number;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onRestart,
  onOpenPhonics,
  speechRate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-400 text-center flex flex-col items-center gap-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-5xl shadow-lg animate-bounce">
            🌟
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-md">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            Ура! Все 6 предложений собраны!
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-bold">
            Ты выучил CVC слова: <strong className="text-indigo-600">cup, rug, bug, sun, mug, kid, mum, cat, mat, bat, cap</strong>!
          </p>
        </div>

        {/* All Sentences Summary Checklist */}
        <div className="w-full bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 flex flex-col gap-2 text-left">
          <div className="text-xs font-black text-amber-900 uppercase tracking-wider mb-1">
            Изученные предложения:
          </div>
          {SENTENCES.map((s, idx) => (
            <div
              key={s.id}
              className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-100 shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                  ✓
                </span>
                <span className="font-bold text-slate-800 text-xs sm:text-sm">{s.displaySentence}</span>
              </div>
              <button
                onClick={() => {
                  sfx.playPop();
                  speechEngine.speak(s.sentence, { rate: speechRate });
                }}
                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors"
                title="Послушать"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <button
            id="celebration-restart-btn"
            onClick={() => {
              sfx.playPop();
              onRestart();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-sm shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Собрать снова</span>
          </button>

          <button
            id="celebration-phonics-btn"
            onClick={() => {
              sfx.playPop();
              onOpenPhonics();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Учить звуки (CVC)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
