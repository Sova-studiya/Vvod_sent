import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, Settings2, X, Sliders, Check, Sparkles } from 'lucide-react';
import { speechEngine, sfx } from '../utils/audio';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  speechRate: number;
  onRateChange: (rate: number) => void;
  showTranslation: boolean;
  onToggleTranslation: (show: boolean) => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  speechRate,
  onRateChange,
  showTranslation,
  onToggleTranslation,
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedURI, setSelectedURI] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const vList = speechEngine.getVoices();
        setVoices(vList);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  if (!isOpen) return null;

  const handleTestVoice = (rateToTest = speechRate) => {
    sfx.playPop();
    speechEngine.speak('The cat is on the mat. The cup is on the rug.', {
      rate: rateToTest,
      pitch: 1.06
    });
  };

  const handleVoiceSelect = (uri: string) => {
    sfx.playPop();
    setSelectedURI(uri);
    speechEngine.setVoiceByURI(uri);
    handleTestVoice();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 15 }}
        className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-4 border-amber-300 flex flex-col gap-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-amber-950 font-black">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">Настройки озвучки</h3>
              <p className="text-xs text-slate-500 font-bold">Женский голос и темп для детей 7 лет</p>
            </div>
          </div>
          <button
            id="close-settings-btn"
            onClick={() => {
              sfx.playPop();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Speed presets */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Скорость озвучки (Темп):</span>
            <span className="text-amber-800 font-extrabold bg-amber-100 px-2 py-0.5 rounded-md text-xs">
              {Math.round(speechRate * 100)}%
            </span>
          </label>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '🐢 Очень медленно', rate: 0.62 },
              { label: '⭐ Рекомендуемая (0.72x)', rate: 0.72 },
              { label: '🐇 Обычная (0.9x)', rate: 0.90 },
            ].map((preset) => (
              <button
                key={preset.rate}
                id={`rate-preset-${preset.rate}`}
                onClick={() => {
                  sfx.playPop();
                  onRateChange(preset.rate);
                  handleTestVoice(preset.rate);
                }}
                className={`py-2.5 px-2 rounded-xl text-xs font-black border-2 transition-all text-center ${
                  Math.abs(speechRate - preset.rate) < 0.04
                    ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-md scale-102'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <input
            type="range"
            min="0.5"
            max="1.0"
            step="0.05"
            value={speechRate}
            onChange={(e) => onRateChange(parseFloat(e.target.value))}
            className="w-full accent-amber-500 mt-2 cursor-pointer"
          />
        </div>

        {/* Available Voice Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Доступные голоса синтезатора:
          </label>
          <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl p-2 flex flex-col gap-1 bg-slate-50">
            {voices.length === 0 ? (
              <div className="text-xs text-slate-500 p-2">Используется стандартный женский голос браузера</div>
            ) : (
              voices.map((v) => {
                const isSelected = selectedURI === v.voiceURI;
                const isFemaleName = /samantha|victoria|karen|moira|tessa|zira|female|woman|jenny|aria/i.test(v.name);
                return (
                  <button
                    key={v.voiceURI}
                    onClick={() => handleVoiceSelect(v.voiceURI)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-left transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-amber-950'
                        : 'hover:bg-white text-slate-700'
                    }`}
                  >
                    <span className="truncate">
                      {isFemaleName ? '👩 ' : '👤 '}
                      {v.name} ({v.lang})
                    </span>
                    {isFemaleName && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black ml-2">
                        Female
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Toggle Russian Translations */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200">
          <div>
            <div className="text-xs sm:text-sm font-black text-amber-950">
              🇷🇺 Подсказки и перевод на русский
            </div>
            <div className="text-[11px] text-amber-800/80 font-semibold">
              Показывать перевод предложений и предлогов
            </div>
          </div>
          <button
            id="toggle-translation-btn"
            onClick={() => {
              sfx.playPop();
              onToggleTranslation(!showTranslation);
            }}
            className={`w-12 h-7 rounded-full transition-colors flex items-center p-1 ${
              showTranslation ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                showTranslation ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Test Speech Button */}
        <button
          id="test-voice-btn"
          onClick={() => handleTestVoice()}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black text-sm shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
        >
          <Volume2 className="w-5 h-5" />
          <span>Проверить звучание (Test Voice)</span>
        </button>
      </motion.div>
    </div>
  );
};
