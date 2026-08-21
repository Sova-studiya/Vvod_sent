import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, CheckCircle, XCircle, ArrowRight, RotateCcw, Award, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SENTENCES, CVC_VOCABULARY } from '../data/sentences';
import { SceneIllustration } from './illustrations/SceneIllustrations';
import { speechEngine, sfx } from '../utils/audio';

interface QuizGameProps {
  speechRate: number;
  onBackToBuilder: () => void;
}

interface Question {
  type: 'picture-match' | 'fill-cvc' | 'preposition-match';
  targetSentenceId: number;
  questionTextRu: string;
  audioPrompt: string;
  options: {
    id: string;
    label: string;
    imageKey?: string;
    isCorrect: boolean;
  }[];
}

export const QuizGame: React.FC<QuizGameProps> = ({ speechRate, onBackToBuilder }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);

  // Generate engaging randomized questions
  useEffect(() => {
    const generatedQuestions: Question[] = [];

    // 1. Picture Match Questions (3 items)
    const shuffledSentences = [...SENTENCES].sort(() => Math.random() - 0.5);
    shuffledSentences.slice(0, 3).forEach((s) => {
      const wrongOptions = SENTENCES.filter(o => o.id !== s.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      const options = [
        { id: `opt-pic-${s.id}`, label: s.sentence, imageKey: s.imageKey, isCorrect: true },
        ...wrongOptions.map(wo => ({ id: `opt-pic-${wo.id}`, label: wo.sentence, imageKey: wo.imageKey, isCorrect: false }))
      ].sort(() => Math.random() - 0.5);

      generatedQuestions.push({
        type: 'picture-match',
        targetSentenceId: s.id,
        questionTextRu: 'Послушай и выбери подходящую картинку:',
        audioPrompt: s.sentence,
        options
      });
    });

    // 2. Fill-in-the-blank CVC word Questions (3 items)
    shuffledSentences.slice(3, 6).forEach((s) => {
      const targetCVC = s.cvcWords[0];
      const cvcObj = CVC_VOCABULARY[targetCVC];
      const maskedSentence = s.sentence.replace(new RegExp(`\\b${targetCVC}\\b`, 'i'), '_____');

      const wrongCVCs = Object.keys(CVC_VOCABULARY)
        .filter(w => w !== targetCVC && w !== s.cvcWords[1])
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      const options = [
        { id: `opt-cvc-${targetCVC}`, label: `${cvcObj?.icon || ''} ${targetCVC}`, isCorrect: true },
        ...wrongCVCs.map(wc => ({
          id: `opt-cvc-${wc}`,
          label: `${CVC_VOCABULARY[wc]?.icon || ''} ${wc}`,
          isCorrect: false
        }))
      ].sort(() => Math.random() - 0.5);

      generatedQuestions.push({
        type: 'fill-cvc',
        targetSentenceId: s.id,
        questionTextRu: `Какое CVC слово пропущено: "${maskedSentence}"?`,
        audioPrompt: s.sentence,
        options
      });
    });

    setQuestions(generatedQuestions);
    setCurrentQIndex(0);
    setScore(0);
    setIsQuizComplete(false);
    setSelectedOptionId(null);
    setIsAnswered(false);
  }, []);

  // Play question audio automatically when question changes
  useEffect(() => {
    if (questions.length > 0 && currentQIndex < questions.length && !isQuizComplete) {
      const q = questions[currentQIndex];
      const timer = setTimeout(() => {
        speechEngine.speak(q.audioPrompt, { rate: speechRate });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentQIndex, questions, isQuizComplete, speechRate]);

  const handleOptionSelect = (optionId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    if (isCorrect) {
      sfx.playSuccess();
      sfx.playSparkle();
      setScore(prev => prev + 1);
    } else {
      sfx.playGentleError();
    }
  };

  const handleNextQuestion = () => {
    sfx.playPop();
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      setIsQuizComplete(true);
      sfx.playSparkle();
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleRestart = () => {
    sfx.playPop();
    setCurrentQIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizComplete(false);
  };

  if (questions.length === 0) return null;

  if (isQuizComplete) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl border-4 border-amber-300 text-center flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 rounded-full bg-amber-400 flex items-center justify-center text-4xl shadow-inner animate-bounce">
            🏆
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black text-slate-800">Отличная работа!</h2>
            <p className="text-base text-slate-600 font-bold">
              Ты набрал <strong className="text-emerald-600 text-xl">{score}</strong> из {questions.length} звёзд!
            </p>
          </div>

          <div className="flex items-center gap-2 text-amber-400">
            {Array.from({ length: questions.length }).map((_, i) => (
              <Star
                key={i}
                className={`w-8 h-8 ${i < score ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <button
              id="quiz-play-again-btn"
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black shadow-md hover:scale-105 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Сыграть ещё раз</span>
            </button>
            <button
              id="quiz-back-builder-btn"
              onClick={onBackToBuilder}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-md hover:scale-105 transition-all"
            >
              <span>В конструктор предложений</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-5">
      {/* Quiz Top Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-amber-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 font-black text-amber-950 flex items-center justify-center">
            {currentQIndex + 1}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Викторина • Вопрос {currentQIndex + 1} из {questions.length}
            </div>
            <div className="text-sm sm:text-base font-extrabold text-slate-800">
              {currentQ.questionTextRu}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-black text-sm text-amber-900">{score}</span>
        </div>
      </div>

      {/* Audio Speaker Box */}
      <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-5 rounded-3xl text-amber-950 shadow-md flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            id="quiz-repeat-audio-btn"
            onClick={() => speechEngine.speak(currentQ.audioPrompt, { rate: speechRate })}
            className="w-12 h-12 rounded-2xl bg-white text-amber-900 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <div>
            <div className="text-xs font-black uppercase opacity-80">Нажми, чтобы послушать медленно:</div>
            <div className="text-lg sm:text-xl font-black">{currentQ.audioPrompt}</div>
          </div>
        </div>

        <button
          id="quiz-listen-again-btn"
          onClick={() => speechEngine.speak(currentQ.audioPrompt, { rate: speechRate })}
          className="px-4 py-2 rounded-xl bg-amber-950/10 hover:bg-amber-950/20 font-extrabold text-xs text-amber-950 transition-colors"
        >
          🔊 Повторить озвучку
        </button>
      </div>

      {/* Answer Options Stage */}
      {currentQ.type === 'picture-match' ? (
        /* 3 Picture Options */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <motion.button
                key={opt.id}
                id={opt.id}
                onClick={() => handleOptionSelect(opt.id, opt.isCorrect)}
                whileHover={{ scale: isAnswered ? 1 : 1.03 }}
                whileTap={{ scale: isAnswered ? 1 : 0.97 }}
                disabled={isAnswered}
                className={`flex flex-col items-center bg-white p-3 rounded-3xl border-4 transition-all duration-200 overflow-hidden shadow-md text-left ${
                  isAnswered
                    ? opt.isCorrect
                      ? 'border-emerald-500 ring-4 ring-emerald-200 bg-emerald-50'
                      : isSelected
                      ? 'border-rose-400 bg-rose-50 opacity-80'
                      : 'border-slate-200 opacity-40'
                    : 'border-slate-100 hover:border-amber-300'
                }`}
              >
                <div className="w-full h-44 rounded-2xl bg-slate-50 flex items-center justify-center p-1 relative">
                  {opt.imageKey && <SceneIllustration imageKey={opt.imageKey} isInteractive={false} />}
                  {isAnswered && opt.isCorrect && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  )}
                  {isAnswered && isSelected && !opt.isCorrect && (
                    <div className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full shadow">
                      <XCircle className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="mt-3 text-xs sm:text-sm font-extrabold text-slate-700 text-center px-2">
                  {opt.label}
                </div>
              </motion.button>
            );
          })}
        </div>
      ) : (
        /* Text / CVC Word Options */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <motion.button
                key={opt.id}
                id={opt.id}
                onClick={() => handleOptionSelect(opt.id, opt.isCorrect)}
                whileHover={{ scale: isAnswered ? 1 : 1.04 }}
                whileTap={{ scale: isAnswered ? 1 : 0.96 }}
                disabled={isAnswered}
                className={`py-8 px-6 rounded-3xl font-black text-2xl sm:text-3xl border-4 transition-all duration-200 shadow-md flex items-center justify-center gap-3 ${
                  isAnswered
                    ? opt.isCorrect
                      ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 scale-105'
                      : isSelected
                      ? 'bg-rose-100 text-rose-700 border-rose-400'
                      : 'bg-slate-100 text-slate-400 border-slate-200 opacity-40'
                    : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-200 hover:border-amber-400'
                }`}
              >
                <span>{opt.label}</span>
                {isAnswered && opt.isCorrect && <CheckCircle className="w-8 h-8 text-white" />}
                {isAnswered && isSelected && !opt.isCorrect && <XCircle className="w-8 h-8 text-rose-600" />}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Next Question / Feedback Bar */}
      {isAnswered && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-md border border-slate-200"
        >
          <div className="text-sm font-extrabold">
            {selectedOptionId && currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect ? (
              <span className="text-emerald-600 flex items-center gap-1.5">
                <Sparkles className="w-5 h-5" /> Правильно! Молодец!
              </span>
            ) : (
              <span className="text-rose-600">Попробуем ещё раз в следующий раз!</span>
            )}
          </div>

          <button
            id="quiz-next-question-btn"
            onClick={handleNextQuestion}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-sm shadow-md hover:scale-105 transition-all"
          >
            <span>{currentQIndex === questions.length - 1 ? 'Посмотреть результат' : 'Следующий вопрос'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
