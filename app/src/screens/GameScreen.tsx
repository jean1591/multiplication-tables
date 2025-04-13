import * as Haptics from "expo-haptics";

import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { useCallback, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfettiCannon from "react-native-confetti-cannon";
import { LinearGradient } from "expo-linear-gradient";

const TIMER_DURATION = 15000;
const MAX_TRIES = 3;

const encouragingMessages = {
  success: ["Bravo !", "Excellent !", "Super !", "Bien joué !"],
  failure: ["Oh non, essaie encore !", "Pas tout à fait...", "Presque..."],
  timeOut: ["Le temps est écoulé !", "Plus de temps !"],
  finalFailure: ["Tu y arriveras la prochaine fois !", "Continue d'essayer !"],
};

export default function GameScreen() {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [remainingTries, setRemainingTries] = useState(MAX_TRIES);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const loadBestScore = async () => {
    try {
      const savedScore = await AsyncStorage.getItem("bestScore");
      if (savedScore) {
        setBestScore(parseInt(savedScore, 10));
      }
    } catch (error) {
      console.error("Error loading best score:", error);
    }
  };

  const saveBestScore = async (newScore: number) => {
    try {
      if (newScore > bestScore) {
        await AsyncStorage.setItem("bestScore", newScore.toString());
        setBestScore(newScore);
      }
    } catch (error) {
      console.error("Error saving best score:", error);
    }
  };

  const generateQuestion = useCallback(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 * num2;

    let wrongAnswers = new Set<number>();
    while (wrongAnswers.size < 3) {
      const wrong = Math.floor(Math.random() * 100) + 1;
      if (wrong !== correctAnswer) {
        wrongAnswers.add(wrong);
      }
    }

    const allOptions = [...Array.from(wrongAnswers), correctAnswer];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

    setCurrentNumber(num1);
    setMultiplier(num2);
    setOptions(shuffledOptions);
    setTimeLeft(TIMER_DURATION);
    setGameOver(false);
    setMessage("");
  }, []);

  const handleAnswer = (selectedAnswer: number) => {
    if (gameOver) return;

    const correctAnswer = currentNumber * multiplier;

    if (selectedAnswer === correctAnswer) {
      setShowConfetti(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setMessage(
        encouragingMessages.success[
          Math.floor(Math.random() * encouragingMessages.success.length)
        ]
      );
      setScore((prev) => prev + 1);
      saveBestScore(score + 1);
      setTimeout(() => {
        setShowConfetti(false);
        generateQuestion();
      }, 2000);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const newRemainingTries = remainingTries - 1;
      setRemainingTries(newRemainingTries);

      if (newRemainingTries <= 0) {
        setGameOver(true);
        setMessage(
          `La réponse était ${correctAnswer}. ${
            encouragingMessages.finalFailure[
              Math.floor(
                Math.random() * encouragingMessages.finalFailure.length
              )
            ]
          }`
        );
      } else {
        setMessage(
          encouragingMessages.failure[
            Math.floor(Math.random() * encouragingMessages.failure.length)
          ]
        );
      }
    }
  };

  const startNewGame = () => {
    setScore(0);
    setRemainingTries(MAX_TRIES);
    generateQuestion();
  };

  useEffect(() => {
    loadBestScore();
    generateQuestion();
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(timer);
          setGameOver(true);
          setMessage(
            `Le temps est écoulé ! La réponse était ${
              currentNumber * multiplier
            }.`
          );
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentNumber, multiplier, gameOver]);

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold text-center text-primary-500 mt-10 mb-5">
        Tables de Multiplication
      </Text>

      {/* Timer Bar */}
      <View className="h-2 bg-primary-100 rounded overflow-hidden mb-10">
        <LinearGradient
          colors={
            timeLeft <= 5000 ? ["#FED7D7", "#FEB2B2"] : ["#E9D5FF", "#C4B5FD"]
          }
          className="h-full rounded"
          style={{ width: `${(timeLeft / TIMER_DURATION) * 100}%` }}
        />
      </View>

      {/* Question */}
      <View className="items-center mb-10">
        <Text className="text-5xl font-bold text-primary-600 mb-2.5">
          {`${currentNumber} × ${multiplier} = ?`}
        </Text>
        <Text className="text-lg text-gray-500">
          Combien font {currentNumber} multiplié par {multiplier} ?
        </Text>
      </View>

      {/* Options */}
      <View className="flex-row flex-wrap justify-between mb-8">
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            className={`w-[48%] p-5 rounded-xl mb-4 items-center ${
              gameOver && option === currentNumber * multiplier
                ? "bg-green-500"
                : "bg-gray-100"
            }`}
            onPress={() => handleAnswer(option)}
            disabled={gameOver}
          >
            <Text
              className={`text-2xl font-semibold ${
                gameOver && option === currentNumber * multiplier
                  ? "text-white"
                  : "text-gray-800"
              }`}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Message */}
      {message && (
        <Text className="text-lg text-center my-5 text-primary-600 font-semibold">
          {message}
        </Text>
      )}

      {/* Score Section */}
      <View className="flex-row justify-around mt-auto mb-5">
        <View className="items-center">
          <Text className="text-base text-gray-500 mb-1">Score</Text>
          <Text className="text-2xl font-bold text-primary-600">{score}</Text>
        </View>
        <View className="items-center">
          <Text className="text-base text-gray-500 mb-1">Meilleur</Text>
          <Text className="text-2xl font-bold text-primary-600">
            {bestScore}
          </Text>
        </View>
      </View>

      {/* New Game Button */}
      <TouchableOpacity
        className="bg-primary-500 p-4 rounded-xl items-center mb-5"
        onPress={startNewGame}
      >
        <Text className="text-white text-lg font-semibold">Nouveau jeu</Text>
      </TouchableOpacity>

      {showConfetti && (
        <ConfettiCannon
          count={50}
          origin={{
            x: Dimensions.get("window").width / 2,
            y: Dimensions.get("window").height,
          }}
          autoStart={true}
          fadeOut={true}
        />
      )}
    </View>
  );
}
