import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, Sparkles, X, BookOpen, Music, Check } from 'lucide-react';
import { CVC_VOCABULARY } from '../data/sentences';
import { speechEngine, sfx } from '../utils/audio';

interface PhonicsExplorerProps {
  initialWord?: string;
  onClose: () => void;
  speechRate: number;
}

export const PhonicsExplorer: React.FC<PhonicsExplorerProps> = ({
  initialWord = 'cup',
  onClose,
  speechRate,
}) => {
  const [selectedWordKey, setSelectedWordKey] = useState<string>(initialWord.toLowerCase());
  const [activePhonemeIdx, setActivePhonemeIdx] = useState<number | null>(null);
  const [isSoundingOut, setIsSoundingOut] = useState<boolean>(false);

  const currentCVC = CVC_VOCABULARY[selectedWordKey] || CVC_VOCABULARY['cup'];

  // Sound out letter by letter and blend
  const handleSoundOut = () => {
    if (isSoundingOut) return;
    setIsSoundingOut(true);

    speechEngine.soundOutPhonics(
      currentCVC.word,
      currentCVC.phonemes,
      (idx) => setActivePhonemeIdx(idx >= 0 ? idx : null),
      () => {
        setIsSoundingOut(false);
        setActivePhonemeIdx(null);
        sfx.playSparkle();
      }
    );
  };

  // Sound out an individual letter phoneme
  const handleLetterClick = (letter: string, idx: number) => {
    sfx.playPop();
    setActivePhonemeIdx(idx);
    speechEngine.speak(letter, {
      rate: 0.65,
      pitch: 1.1,
      onEnd: () => setTimeout(() => setActivePhonemeIdx(null), 300)
    });
  };

  // Rhyme families for exploration
  const wordFamilies = [
    { family: '-ug', title: '-UG слова', words: ['bug', 'rug', 'mug'], bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    { family: '-at', title: '-AT слова', words: ['cat', 'mat', 'bat'], bg: 'bg-blue-100 text-blue-900 border-blue-300' },
    { family: '-up', title: '-UP слова', words: ['cup'], bg: 'bg-amber-100 text-amber-900 border-amber-300' },
    { family: '-un', title: '-UN слова', words: ['sun'], bg: 'bg-orange-100 text-orange-900 border-orange-300' },
    { family: '-ap', title: '-AP слова', words: ['cap'], bg: 'bg-purple-100 text-purple-900 border-purple-300' },
    { family: '-id', title: '-ID слова', words: ['kid'], bg: 'bg-pink-100 text-pink-900 border-pink-300' },
    { family: '-um', title: '-UM слова', words: ['mum'], bg: 'bg-rose-100 text-rose-900 border-rose-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border-4 border-amber-300 flex flex-col gap-6 max-h-[92vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-400 text-amber-950 font-black">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                Учим CVC слова и звуки
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold">
                Нажимай на буквы, чтобы услышать звуки и соединить слово
              </p>
            </div>
          </div>
          <button
            id="close-phonics-modal-btn"
            onClick={() => {
              sfx.playPop();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {Object.keys(CVC_VOCABULARY).map((wordKey) => {
            const item = CVC_VOCABULARY[wordKey];
            const isSelected = wordKey === selectedWordKey;
            return (
              <button
                key={wordKey}
                id={`select-cvc-${wordKey}`}
                onClick={() => {
                  sfx.playPop();
                  setSelectedWordKey(wordKey);
                  speechEngine.speak(item.word, { rate: speechRate });
                }}
                className={`px-3.5 py-1.5 rounded-xl font-black text-sm whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-amber-950 shadow-md scale-105 ring-2 ring-amber-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.word}</span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE WORD INTERACTIVE PHONICS STAGE */}
        <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-200 gap-4 text-center">
          <div className="text-5xl sm:text-6xl animate-gentle-bounce">{currentCVC.icon}</div>
          
          {/* Big Phoneme Letter Blocks */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 my-2">
            {currentCVC.phonemes.map((phoneme, idx) => {
              const isHighlight = activePhonemeIdx === idx;
              const isVowel = phoneme === 'a' || phoneme === 'e' || phoneme === 'i' || phoneme === 'o' || phoneme === 'u';
              return (
                <motion.button
                  key={idx}
                  id={`phoneme-block-${phoneme}-${idx}`}
                  onClick={() => handleLetterClick(phoneme, idx)}
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.92 }}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center font-black text-3xl sm:text-4xl shadow-md transition-all border-b-4 ${
                    isHighlight
                      ? 'bg-amber-400 text-amber-950 scale-115 ring-4 ring-amber-300 border-amber-600 shadow-xl'
                      : isVowel
                      ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-700'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-800'
                  }`}
                >
                  <span>{phoneme}</span>
                  <span className="text-[10px] sm:text-xs font-bold opacity-80 mt-1">
                    /{currentCVC.sounds[idx]}/
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Translation & Info */}
          <div className="flex flex-col gap-1 items-center">
            <div className="text-lg font-extrabold text-slate-800">
              🇷🇺 {currentCVC.translationRu}
            </div>
            <div className="text-xs font-bold text-amber-800 bg-amber-200/60 px-3 py-1 rounded-full">
              Семья рифмы: <strong className="text-indigo-700">{currentCVC.rimeFamily}</strong>
            </div>
          </div>

          {/* Blend & Pronounce Action Button */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <button
              id="sound-out-phonics-btn"
              onClick={handleSoundOut}
              disabled={isSoundingOut}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-base shadow-lg transition-all ${
                isSoundingOut
                  ? 'bg-amber-300 text-amber-900 animate-pulse cursor-wait'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 hover:scale-105 shadow-amber-500/20'
              }`}
            >
              <Music className="w-5 h-5" />
              <span>Прочитать по звукам (Blend!)</span>
            </button>

            <button
              id="speak-cvc-whole-btn"
              onClick={() => speechEngine.speak(currentCVC.word, { rate: speechRate })}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm border-2 border-slate-200 shadow-sm"
            >
              <Volume2 className="w-5 h-5 text-indigo-600" />
              <span>Целиком</span>
            </button>
          </div>
        </div>

        {/* Word Families Grouping */}
        <div className="flex flex-col gap-2.5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Рифмованные группы слов (Word Families):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {wordFamilies.map((fam) => (
              <div
                key={fam.family}
                className={`p-3 rounded-2xl border-2 flex flex-col gap-1.5 ${fam.bg}`}
              >
                <div className="text-xs font-black uppercase tracking-wider">{fam.title}</div>
                <div className="flex flex-wrap gap-1">
                  {fam.words.map((w) => (
                    <button
                      key={w}
                      id={`family-word-${w}`}
                      onClick={() => {
                        sfx.playPop();
                        setSelectedWordKey(w);
                        speechEngine.speak(w, { rate: speechRate });
                      }}
                      className="px-2 py-0.5 rounded-md bg-white/90 hover:bg-white text-slate-900 font-extrabold text-xs shadow-xs transition-transform active:scale-95"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
