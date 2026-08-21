import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, RefreshCw, CheckCircle2, HelpCircle, ArrowRight, ArrowLeft, VolumeX, Lightbulb, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SentenceData } from '../types';
import { SceneIllustration } from './illustrations/SceneIllustrations';
import { speechEngine, sfx } from '../utils/audio';
import { CVC_VOCABULARY } from '../data/sentences';

interface SentenceBuilderProps {
  sentenceData: SentenceData;
  currentIndex: number;
  totalSentences: number;
  speechRate: number;
  showTranslation: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSelectIndex: (idx: number) => void;
  onOpenPhonicsModal: (wordKey: string) => void;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  sentenceData,
  currentIndex,
  totalSentences,
  speechRate,
  showTranslation,
  onNext,
  onPrev,
  onSelectIndex,
  onOpenPhonicsModal,
}) => {
  // Current built sentence words in slots
  const [placedWords, setPlacedWords] = useState<(string | null)[]>([]);
  // Available words pool (scrambled)
  const [bankWords, setBankWords] = useState<{ id: string; word: string; originalIndex: number }[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [activeSpeakingWordIdx, setActiveSpeakingWordIdx] = useState<number | null>(null);
  const [isSpeakingSentence, setIsSpeakingSentence] = useState<boolean>(false);
  const [highlightWordInPic, setHighlightWordInPic] = useState<string | null>(null);

  // Initialize word bank and slots whenever sentenceData changes
  useEffect(() => {
    const words = sentenceData.words;
    setPlacedWords(new Array(words.length).fill(null));
    setIsCompleted(false);
    setErrorIndex(null);
    setActiveSpeakingWordIdx(null);
    setIsSpeakingSentence(false);

    // Create scrambled words pool
    const wordPool = words.map((w, idx) => ({
      id: `${w}-${idx}-${Math.random()}`,
      word: w,
      originalIndex: idx
    }));

    // Shuffle
    const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
    setBankWords(shuffled);

    // Automatically speak the target prompt slowly to guide the 7yo learner
    const timer = setTimeout(() => {
      speechEngine.speak(sentenceData.sentence, {
        rate: speechRate,
        onStart: () => setIsSpeakingSentence(true),
        onEnd: () => setIsSpeakingSentence(false)
      });
    }, 450);

    return () => {
      clearTimeout(timer);
      speechEngine.stop();
    };
  }, [sentenceData, speechRate]);

  // Handle clicking a word from the bank
  const handleBankWordClick = (bankItem: { id: string; word: string }, bankIdx: number) => {
    sfx.playPop();
    // Speak word slowly
    speechEngine.speak(bankItem.word, { rate: speechRate });

    // Find first empty slot
    const firstEmptyIndex = placedWords.findIndex(w => w === null);
    if (firstEmptyIndex === -1) return;

    const nextPlaced = [...placedWords];
    nextPlaced[firstEmptyIndex] = bankItem.word;
    setPlacedWords(nextPlaced);

    // Remove from bank
    const nextBank = bankWords.filter((_, idx) => idx !== bankIdx);
    setBankWords(nextBank);

    // Check if fully placed
    if (firstEmptyIndex === sentenceData.words.length - 1) {
      validateSentence(nextPlaced);
    }
  };

  // Handle clicking a placed word in slot (return back to bank)
  const handleSlotWordClick = (slotIdx: number) => {
    const word = placedWords[slotIdx];
    if (!word) return;

    sfx.playPop();
    speechEngine.speak(word, { rate: speechRate });

    const nextPlaced = [...placedWords];
    nextPlaced[slotIdx] = null;
    setPlacedWords(nextPlaced);

    // Return to bank
    setBankWords([...bankWords, { id: `${word}-${Math.random()}`, word, originalIndex: -1 }]);
    setIsCompleted(false);
    setErrorIndex(null);
  };

  // Validate the placed sentence
  const validateSentence = (placed: (string | null)[]) => {
    const expected = sentenceData.words;
    let isCorrect = true;

    for (let i = 0; i < expected.length; i++) {
      if (placed[i] !== expected[i]) {
        isCorrect = false;
        setErrorIndex(i);
        break;
      }
    }

    if (isCorrect) {
      setIsCompleted(true);
      setErrorIndex(null);
      sfx.playSuccess();
      sfx.playSparkle();

      // Trigger Confetti
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if not loaded
      }

      // Read completed sentence word by word slowly
      setTimeout(() => {
        readSentenceWithKaraoke();
      }, 500);
    } else {
      sfx.playGentleError();
    }
  };

  // Karaoke read-along with synchronized highlight
  const readSentenceWithKaraoke = () => {
    setIsSpeakingSentence(true);
    let currentWord = 0;
    const words = sentenceData.words;

    const speakNextWord = () => {
      if (currentWord >= words.length) {
        setActiveSpeakingWordIdx(null);
        setIsSpeakingSentence(false);
        return;
      }

      setActiveSpeakingWordIdx(currentWord);
      const wordToSpeak = words[currentWord];

      speechEngine.speak(wordToSpeak, {
        rate: speechRate,
        onEnd: () => {
          currentWord++;
          setTimeout(speakNextWord, 160);
        }
      });
    };

    speakNextWord();
  };

  // Reset current board
  const handleReset = () => {
    sfx.playPop();
    const words = sentenceData.words;
    setPlacedWords(new Array(words.length).fill(null));
    setIsCompleted(false);
    setErrorIndex(null);
    setActiveSpeakingWordIdx(null);

    const wordPool = words.map((w, idx) => ({
      id: `${w}-${idx}-${Math.random()}`,
      word: w,
      originalIndex: idx
    }));
    setBankWords([...wordPool].sort(() => Math.random() - 0.5));
  };

  // Interactive object click in picture
  const handlePictureObjectClick = (objName: string) => {
    setHighlightWordInPic(objName);
    const cvc = CVC_VOCABULARY[objName.toLowerCase()];
    if (cvc) {
      speechEngine.soundOutPhonics(cvc.word, cvc.phonemes);
    } else {
      speechEngine.speak(objName, { rate: speechRate });
    }
    setTimeout(() => setHighlightWordInPic(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 flex flex-col gap-5">
      {/* Top Header Bar & Level Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl shadow-sm border border-amber-200/60">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-400 text-amber-950 font-black text-lg shadow-inner">
            {currentIndex + 1}
          </div>
          <div>
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Задание {currentIndex + 1} из {totalSentences}
            </div>
            <div className="text-sm sm:text-base font-extrabold text-slate-800">
              Собери предложение по картинке
            </div>
          </div>
        </div>

        {/* Level Dots Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {Array.from({ length: totalSentences }).map((_, idx) => (
            <button
              key={idx}
              id={`nav-dot-${idx}`}
              onClick={() => {
                sfx.playPop();
                onSelectIndex(idx);
              }}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                idx === currentIndex
                  ? 'bg-amber-500 text-white scale-110 shadow-md ring-2 ring-amber-300'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Picture Card with Interactive Objects */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-3xl p-4 sm:p-5 shadow-md border-2 border-amber-100 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              Нажми на картинку, чтобы послушать
            </span>
            <button
              id="listen-picture-btn"
              onClick={() => speechEngine.speak(sentenceData.sentence, { rate: speechRate })}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors"
              title="Прослушать образец медленно"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* SVG Illustration Container */}
          <div className="flex-1 w-full min-h-[220px] sm:min-h-[260px] flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-200/80 p-2 relative group">
            <SceneIllustration
              imageKey={sentenceData.imageKey}
              onObjectClick={handlePictureObjectClick}
              isInteractive={true}
            />
            {highlightWordInPic && (
              <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-black animate-pop shadow-md">
                🔊 {highlightWordInPic.toUpperCase()}!
              </div>
            )}
          </div>

          {/* CVC Phonics Helpers Below Image */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div className="text-xs font-bold text-slate-500">CVC слова в уроке:</div>
            <div className="flex items-center gap-2">
              {sentenceData.cvcWords.map((cw) => {
                const cvcObj = CVC_VOCABULARY[cw];
                return (
                  <button
                    key={cw}
                    id={`cvc-btn-${cw}`}
                    onClick={() => {
                      sfx.playPop();
                      onOpenPhonicsModal(cw);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs border border-indigo-200 shadow-sm transition-transform active:scale-95"
                  >
                    <span>{cvcObj?.icon}</span>
                    <span className="underline decoration-indigo-300">{cw}</span>
                    <span className="text-[10px] text-indigo-400">({cvcObj?.rimeFamily})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sentence Construction Builder */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-amber-100 gap-5">
          {/* Target Prompt Audio & Russian Translation */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  id="play-slow-voice-btn"
                  onClick={() => {
                    sfx.playPop();
                    readSentenceWithKaraoke();
                  }}
                  disabled={isSpeakingSentence}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm transition-all shadow-sm ${
                    isSpeakingSentence
                      ? 'bg-amber-400 text-amber-950 scale-105 ring-4 ring-amber-200 animate-pulse'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 shadow hover:shadow-md'
                  }`}
                >
                  <Volume2 className="w-5 h-5 text-amber-900" />
                  <span>Послушать медленно (женский голос)</span>
                </button>
              </div>

              <button
                id="reset-builder-btn"
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Сбросить слова"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Russian Clue / Meaning for Kids & Parents */}
            {showTranslation && (
              <div className="bg-amber-50/80 border border-amber-200/70 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-amber-900 flex items-center gap-2">
                <span className="text-base">🇷🇺</span>
                <span>{sentenceData.translationRu}</span>
                <span className="text-xs text-amber-700/80 ml-auto">
                  (предлог: <strong className="text-amber-900">{sentenceData.preposition}</strong> = {sentenceData.prepositionRu})
                </span>
              </div>
            )}
          </div>

          {/* TARGET SLOTS ZONE */}
          <div className="flex flex-col gap-2.5 my-auto">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Расставь слова по порядку:</span>
              <span className="text-[11px] text-amber-700 font-medium">Нажми на слово, чтобы убрать</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-amber-50/50 border-2 border-dashed border-amber-300 min-h-[72px]">
              {sentenceData.words.map((expectedWord, slotIdx) => {
                const placedWord = placedWords[slotIdx];
                const isCurrentSpeaking = activeSpeakingWordIdx === slotIdx;
                const isError = errorIndex === slotIdx;

                return (
                  <div
                    key={slotIdx}
                    id={`slot-${slotIdx}`}
                    onClick={() => handleSlotWordClick(slotIdx)}
                    className={`min-w-[62px] sm:min-w-[76px] h-12 sm:h-14 px-3 sm:px-4 rounded-xl flex items-center justify-center font-extrabold text-base sm:text-lg cursor-pointer transition-all duration-200 select-none ${
                      placedWord
                        ? isCompleted
                          ? 'bg-emerald-500 text-white shadow-md border-2 border-emerald-600 scale-105'
                          : isError
                          ? 'bg-rose-100 text-rose-700 border-2 border-rose-400 animate-wiggle'
                          : isCurrentSpeaking
                          ? 'bg-amber-400 text-amber-950 scale-110 ring-4 ring-amber-300 shadow-lg'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow hover:scale-105 border-b-4 border-indigo-800'
                        : 'bg-white/80 border-2 border-dashed border-slate-300 text-slate-300 hover:border-amber-400'
                    }`}
                  >
                    {placedWord ? (
                      <span className="tracking-wide">{placedWord}</span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">{slotIdx + 1}</span>
                    )}
                  </div>
                );
              })}
              <span className="text-2xl font-black text-slate-500 select-none">.</span>
            </div>
          </div>

          {/* WORD BANK TILES */}
          <div className="flex flex-col gap-2.5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Слова для сборки (нажимай):</span>
              <span className="text-[11px] text-indigo-600 font-bold">Озвучка каждого слова при нажатии</span>
            </div>

            <div className="flex flex-wrap gap-2.5 p-3 sm:p-4 rounded-2xl bg-slate-100/80 border border-slate-200 min-h-[68px] items-center">
              {bankWords.length === 0 && !isCompleted && (
                <div className="text-xs font-bold text-slate-400 italic">Все слова расставлены! Проверяем...</div>
              )}
              {bankWords.length === 0 && isCompleted && (
                <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Отлично! Предложение собрано верно! 🎉</span>
                </div>
              )}
              {bankWords.map((item, bankIdx) => (
                <motion.button
                  key={item.id}
                  id={`bank-word-${item.word}-${bankIdx}`}
                  onClick={() => handleBankWordClick(item, bankIdx)}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-950 font-extrabold text-base sm:text-lg shadow-sm border-2 border-slate-200 hover:border-amber-400 active:border-amber-500 transition-colors"
                >
                  {item.word}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Bottom Action / Navigation Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-3">
            <button
              id="prev-sentence-btn"
              onClick={() => {
                sfx.playPop();
                onPrev();
              }}
              disabled={currentIndex === 0}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-colors ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>

            {isCompleted ? (
              <button
                id="next-sentence-btn"
                onClick={() => {
                  sfx.playSparkle();
                  onNext();
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all animate-bounce"
              >
                <span>{currentIndex === totalSentences - 1 ? 'Завершить игру! 🏆' : 'Следующее предложение'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                id="check-sentence-btn"
                onClick={() => validateSentence(placedWords)}
                disabled={placedWords.some(w => w === null)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all ${
                  placedWords.some(w => w === null)
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-md hover:scale-105'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Проверить</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
