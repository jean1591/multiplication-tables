import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface GameState {
  currentNumber: number;
  multiplier: number;
  score: number;
  bestScore: number;
  remainingTries: number;
  timeLeft: number;
  gameOver: boolean;
  userInput: string;
  setUserInput: (input: string) => void;
  clearUserInput: () => void;
  setCurrentNumber: (num: number) => void;
  setMultiplier: (num: number) => void;
  incrementScore: () => void;
  decrementTries: () => void;
  setTimeLeft: (time: number | ((prev: number) => number)) => void;
  setGameOver: (over: boolean) => void;
  loadBestScore: () => Promise<void>;
  saveBestScore: (score: number) => Promise<void>;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentNumber: 0,
  multiplier: 0,
  score: 0,
  bestScore: 0,
  remainingTries: 3,
  timeLeft: 15000,
  gameOver: false,
  userInput: "",

  setUserInput: (input: string) => set({ userInput: input }),
  clearUserInput: () => set({ userInput: "" }),

  setCurrentNumber: (num: number) => set({ currentNumber: num }),
  setMultiplier: (num: number) => set({ multiplier: num }),

  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  decrementTries: () =>
    set((state) => ({ remainingTries: state.remainingTries - 1 })),

  setTimeLeft: (time: number | ((prev: number) => number)) =>
    set((state) => ({
      timeLeft: typeof time === "function" ? time(state.timeLeft) : time,
    })),
  setGameOver: (over: boolean) => set({ gameOver: over }),

  loadBestScore: async () => {
    try {
      const savedScore = await AsyncStorage.getItem("bestScore");
      if (savedScore) {
        set({ bestScore: parseInt(savedScore, 10) });
      }
    } catch (error) {
      console.error("Error loading best score:", error);
    }
  },

  saveBestScore: async (score: number) => {
    try {
      const { bestScore } = get();
      if (score > bestScore) {
        await AsyncStorage.setItem("bestScore", score.toString());
        set({ bestScore: score });
      }
    } catch (error) {
      console.error("Error saving best score:", error);
    }
  },

  resetGame: () =>
    set({
      score: 0,
      remainingTries: 3,
      timeLeft: 15000,
      gameOver: false,
      userInput: "",
    }),
}));
