import { CVCWord, SentenceData } from '../types';

export const CVC_VOCABULARY: Record<string, CVCWord> = {
  cup: {
    word: 'cup',
    phonemes: ['c', 'u', 'p'],
    sounds: ['k', 'uh', 'p'],
    rimeFamily: '-up',
    translationRu: 'чашка',
    icon: '☕'
  },
  rug: {
    word: 'rug',
    phonemes: ['r', 'u', 'g'],
    sounds: ['r', 'uh', 'g'],
    rimeFamily: '-ug',
    translationRu: 'коврик',
    icon: '🧶'
  },
  bug: {
    word: 'bug',
    phonemes: ['b', 'u', 'g'],
    sounds: ['b', 'uh', 'g'],
    rimeFamily: '-ug',
    translationRu: 'жучок / жук',
    icon: '🪲'
  },
  sun: {
    word: 'sun',
    phonemes: ['s', 'u', 'n'],
    sounds: ['s', 'uh', 'n'],
    rimeFamily: '-un',
    translationRu: 'солнце',
    icon: '☀️'
  },
  mug: {
    word: 'mug',
    phonemes: ['m', 'u', 'g'],
    sounds: ['m', 'uh', 'g'],
    rimeFamily: '-ug',
    translationRu: 'кружка',
    icon: '🥛'
  },
  kid: {
    word: 'kid',
    phonemes: ['k', 'i', 'd'],
    sounds: ['k', 'ih', 'd'],
    rimeFamily: '-id',
    translationRu: 'малыш / ребёнок',
    icon: '👦'
  },
  mum: {
    word: 'mum',
    phonemes: ['m', 'u', 'm'],
    sounds: ['m', 'uh', 'm'],
    rimeFamily: '-um',
    translationRu: 'мама',
    icon: '👩'
  },
  cat: {
    word: 'cat',
    phonemes: ['c', 'a', 't'],
    sounds: ['k', 'ae', 't'],
    rimeFamily: '-at',
    translationRu: 'кот / кошка',
    icon: '🐱'
  },
  mat: {
    word: 'mat',
    phonemes: ['m', 'a', 't'],
    sounds: ['m', 'ae', 't'],
    rimeFamily: '-at',
    translationRu: 'коврик для кота',
    icon: '🟦'
  },
  bat: {
    word: 'bat',
    phonemes: ['b', 'a', 't'],
    sounds: ['b', 'ae', 't'],
    rimeFamily: '-at',
    translationRu: 'летучая мышь',
    icon: '🦇'
  },
  cap: {
    word: 'cap',
    phonemes: ['c', 'a', 'p'],
    sounds: ['k', 'ae', 'p'],
    rimeFamily: '-ap',
    translationRu: 'кепка',
    icon: '🧢'
  }
};

export const SENTENCES: SentenceData[] = [
  {
    id: 1,
    sentence: 'The cup is on the rug',
    displaySentence: 'The cup is on the rug.',
    words: ['The', 'cup', 'is', 'on', 'the', 'rug'],
    translationRu: 'Чашка стоит на коврике',
    cvcWords: ['cup', 'rug'],
    preposition: 'on',
    prepositionRu: 'на',
    imageKey: 'cup-rug',
    themeColor: 'sky',
    sceneDescription: 'Красивая чашка с узором стоит на ярком лоскутном коврике.'
  },
  {
    id: 2,
    sentence: 'The bug is in the cup',
    displaySentence: 'The bug is in the cup.',
    words: ['The', 'bug', 'is', 'in', 'the', 'cup'],
    translationRu: 'Жук сидит внутри чашки',
    cvcWords: ['bug', 'cup'],
    preposition: 'in',
    prepositionRu: 'в (внутри)',
    imageKey: 'bug-cup',
    themeColor: 'emerald',
    sceneDescription: 'Забавный жучок забрался в белую чашку с чаем.'
  },
  {
    id: 3,
    sentence: 'The sun is on the mug',
    displaySentence: 'The sun is on the mug.',
    words: ['The', 'sun', 'is', 'on', 'the', 'mug'],
    translationRu: 'Солнышко нарисовано на кружке',
    cvcWords: ['sun', 'mug'],
    preposition: 'on',
    prepositionRu: 'на',
    imageKey: 'sun-mug',
    themeColor: 'amber',
    sceneDescription: 'Белая кружка с зеленой ручкой и ярким желтым солнышком.'
  },
  {
    id: 4,
    sentence: 'The kid is by mum',
    displaySentence: 'The kid is by mum.',
    words: ['The', 'kid', 'is', 'by', 'mum'],
    translationRu: 'Малыш обнимает маму / рядом с мамой',
    cvcWords: ['kid', 'mum'],
    preposition: 'by',
    prepositionRu: 'возле / рядом с',
    imageKey: 'kid-mum',
    themeColor: 'rose',
    sceneDescription: 'Любящая мама нежно обнимает своего ребенка.'
  },
  {
    id: 5,
    sentence: 'The cat is on the mat',
    displaySentence: 'The cat is on the mat.',
    words: ['The', 'cat', 'is', 'on', 'the', 'mat'],
    translationRu: 'Кот лежит на коврике',
    cvcWords: ['cat', 'mat'],
    preposition: 'on',
    prepositionRu: 'на',
    imageKey: 'cat-mat',
    themeColor: 'indigo',
    sceneDescription: 'Пушистый котик с темным хвостиком лежит на синем коврике.'
  },
  {
    id: 6,
    sentence: 'The bat is on the cap',
    displaySentence: 'The bat is on the cap.',
    words: ['The', 'bat', 'is', 'on', 'the', 'cap'],
    translationRu: 'Летучая мышь нарисована на кепке',
    cvcWords: ['bat', 'cap'],
    preposition: 'on',
    prepositionRu: 'на',
    imageKey: 'bat-cap',
    themeColor: 'violet',
    sceneDescription: 'Красно-белая бейсболка с веселой летучей мышкой.'
  }
];
