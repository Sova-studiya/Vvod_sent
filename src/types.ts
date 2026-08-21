export interface CVCWord {
  word: string;
  phonemes: string[]; // e.g. ["c", "u", "p"]
  sounds: string[]; // pronunciation helper e.g. ["k", "uh", "p"]
  rimeFamily: string; // e.g. "-up", "-ug", "-at", "-ap", "-un", "-id", "-um"
  translationRu: string;
  icon: string;
}

export interface SentenceData {
  id: number;
  sentence: string; // e.g. "The cup is on the rug"
  displaySentence: string; // "The cup is on the rug."
  words: string[]; // ["The", "cup", "is", "on", "the", "rug"]
  translationRu: string; // "Чашка на коврике"
  cvcWords: string[]; // ["cup", "rug"]
  preposition: string; // "on", "in", "by"
  prepositionRu: string; // "на", "в", "возле / рядом с"
  imageKey: string;
  themeColor: string; // Tailwind color class for cards
  sceneDescription: string;
}

export type GameMode = 'builder' | 'phonics' | 'quiz' | 'listen-match';

export interface AudioSettings {
  rate: number; // 0.65 to 1.0 (default 0.72)
  pitch: number; // 1.05 for clear friendly tone
  voiceURI: string | null;
  autoPlayOnSelect: boolean;
}
