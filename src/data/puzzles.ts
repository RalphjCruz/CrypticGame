import type { Puzzle } from "../types/puzzle";

export const puzzles: Puzzle[] = [
  {
    id: 1,
    clue: "Broken tone creates a musical sign.",
    answer: "NOTE",
    difficulty: "Easy",
    type: "Anagram",
    hint: "The word 'broken' tells you to rearrange letters.",
    explanation:
      "'Tone' is rearranged to form 'note'. The word 'broken' is the anagram indicator.",
  },
  {
    id: 2,
    clue: "A tree is hiding inside camPINEr gear.",
    answer: "PINE",
    difficulty: "Easy",
    type: "Hidden Word",
    hint: "Look for consecutive letters inside the phrase.",
    explanation:
      "The letters P-I-N-E appear directly inside 'camPINEr'.",
  },
  {
    id: 3,
    clue: "Bark from a dog, or from a tree.",
    answer: "BARK",
    difficulty: "Easy",
    type: "Double Meaning",
    hint: "This answer has two common meanings.",
    explanation:
      "'Bark' is the sound a dog makes, and also the outer covering of a tree.",
  },
  {
    id: 4,
    clue: "Late, mixed, becomes a story.",
    answer: "TALE",
    difficulty: "Easy",
    type: "Anagram",
    hint: "The word 'mixed' signals an anagram.",
    explanation:
      "Rearranging L-A-T-E gives T-A-L-E, which means a story.",
  },
  {
    id: 5,
    clue: "A jewel appears in bRUBY red cloth.",
    answer: "RUBY",
    difficulty: "Easy",
    type: "Hidden Word",
    hint: "The answer is fully contained in one part of the clue.",
    explanation:
      "The letters R-U-B-Y are hidden in 'bRUBY'.",
  },
  {
    id: 6,
    clue: "Listen scrambled becomes quiet.",
    answer: "SILENT",
    difficulty: "Medium",
    type: "Anagram",
    hint: "Try rearranging the letters in 'listen'.",
    explanation:
      "'Listen' anagrams to 'silent'. 'Scrambled' is the anagram indicator.",
  },
  {
    id: 7,
    clue: "Small boat found in volCANOEs nearby.",
    answer: "CANOE",
    difficulty: "Medium",
    type: "Hidden Word",
    hint: "Check the middle of the word with unusual capitalization.",
    explanation:
      "C-A-N-O-E appears consecutively inside 'volCANOEs'.",
  },
  {
    id: 8,
    clue: "A match can light a candle or tie a game.",
    answer: "MATCH",
    difficulty: "Medium",
    type: "Double Meaning",
    hint: "One meaning is an object; the other is an event result.",
    explanation:
      "A 'match' can be a fire-lighting stick, or a game between opponents.",
  },
  {
    id: 9,
    clue: "Dirty room, strangely, becomes where you sleep.",
    answer: "DORMITORY",
    difficulty: "Medium",
    type: "Anagram",
    hint: "The phrase 'strangely' suggests letter rearrangement.",
    explanation:
      "Rearranging 'dirty room' gives 'dormitory'.",
  },
  {
    id: 10,
    clue: "A flower is tucked into micROSEcond timing.",
    answer: "ROSE",
    difficulty: "Medium",
    type: "Hidden Word",
    hint: "The answer sits inside one longer word.",
    explanation:
      "R-O-S-E appears in order inside 'micROSEcond'.",
  },
  {
    id: 11,
    clue: "Astronomer reworked becomes a moon watcher.",
    answer: "MOON STARER",
    difficulty: "Hard",
    type: "Anagram",
    hint: "Rearrange all letters in 'astronomer'.",
    explanation:
      "'Astronomer' is an anagram of 'moon starer'.",
  },
  {
    id: 12,
    clue: "A puzzle sits inside opENIGMAtic writing.",
    answer: "ENIGMA",
    difficulty: "Hard",
    type: "Hidden Word",
    hint: "Look across the split in the long word.",
    explanation:
      "E-N-I-G-M-A appears consecutively inside 'opENIGMAtic'.",
  },
  {
    id: 13,
    clue: "Current can mean happening now or flowing power.",
    answer: "CURRENT",
    difficulty: "Hard",
    type: "Double Meaning",
    hint: "One meaning is about time, one is about electricity.",
    explanation:
      "'Current' means present/ongoing, and it also means electrical flow.",
  },
  {
    id: 14,
    clue: "Conversation, disturbed, becomes ranting voices.",
    answer: "VOICES RANT ON",
    difficulty: "Hard",
    type: "Anagram",
    hint: "Use every letter from 'conversation'.",
    explanation:
      "'Conversation' rearranges to 'voices rant on'.",
  },
  {
    id: 15,
    clue: "A promise is hidden in comPLEDGEr notes.",
    answer: "PLEDGE",
    difficulty: "Hard",
    type: "Hidden Word",
    hint: "Read straight through the middle letters.",
    explanation:
      "P-L-E-D-G-E appears directly in 'comPLEDGEr'.",
  },
];
