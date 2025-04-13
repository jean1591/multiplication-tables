import * as Haptics from "expo-haptics";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useCallback, useEffect, useState } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import VirtualKeyboard from "../components/VirtualKeyboard";
import { X } from "lucide-react-native";
import { useGameStore } from "../store/useGameStore";

const TIMER_DURATION = 10000;
const MAX_TRIES = 3;

const encouragingMessages = {
  success: ["Bravo !", "Excellent !", "Super !", "Bien joué !"],
  failure: ["Oh non, essaie encore !", "Pas tout à fait...", "Presque..."],
  timeOut: ["Le temps est écoulé !", "Plus de temps !"],
  finalFailure: ["Tu y arriveras la prochaine fois !", "Continue d'essayer !"],
};

export default function GameScreen() {
  const {
    currentNumber,
    multiplier,
    score,
    bestScore,
    remainingTries,
    timeLeft,
    gameOver,
    userInput,
    setUserInput,
    clearUserInput,
    setCurrentNumber,
    setMultiplier,
    incrementScore,
    decrementTries,
    setTimeLeft,
    setGameOver,
    loadBestScore,
    saveBestScore,
    resetGame,
  } = useGameStore();

  const [message, setMessage] = useState("");
  const [isTimerExpired, setIsTimerExpired] = useState(false);

  const buddyTranslateY = useSharedValue(200);
  const buddyScale = useSharedValue(0.8);
  const buddyOpacity = useSharedValue(0);

  const buddyStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: buddyTranslateY.value },
        { scale: buddyScale.value },
      ],
      opacity: buddyOpacity.value,
    };
  });

  const generateQuestion = useCallback(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCurrentNumber(num1);
    setMultiplier(num2);
    setTimeLeft(TIMER_DURATION);
    setGameOver(false);
    setMessage("");
    clearUserInput();
    buddyOpacity.value = 0;
    buddyTranslateY.value = 200;
    buddyScale.value = 0.8;
  }, []);

  const handleKeyPress = (key: string) => {
    if (gameOver) return;
    setUserInput(userInput + key);
  };

  const handleBackspace = () => {
    if (gameOver) return;
    setUserInput(userInput.slice(0, -1));
  };

  const handleSubmit = () => {
    if (gameOver) return;

    const correctAnswer = currentNumber * multiplier;
    const userAnswer = parseInt(userInput, 10);

    if (userAnswer === correctAnswer) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      buddyOpacity.value = withSpring(1);
      buddyTranslateY.value = withSpring(60, { damping: 12 });
      buddyScale.value = withSpring(1.4, { damping: 8 });

      setMessage(
        encouragingMessages.success[
          Math.floor(Math.random() * encouragingMessages.success.length)
        ]
      );
      incrementScore();
      saveBestScore(score + 1);

      setTimeout(() => {
        buddyOpacity.value = withSpring(0);
        buddyTranslateY.value = withSpring(200);
        buddyScale.value = withSpring(0.8);
        generateQuestion();
      }, 2000);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      decrementTries();

      if (remainingTries - 1 <= 0) {
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
        clearUserInput();
      }
    }
  };

  const startNewGame = () => {
    resetGame();
    generateQuestion();
  };

  useEffect(() => {
    loadBestScore();
    generateQuestion();
  }, []);

  useEffect(() => {
    if (isTimerExpired && !gameOver) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      decrementTries();

      if (remainingTries - 1 <= 0) {
        setGameOver(true);
        setMessage(
          `Le temps est écoulé ! La réponse était ${
            currentNumber * multiplier
          }. ${
            encouragingMessages.finalFailure[
              Math.floor(
                Math.random() * encouragingMessages.finalFailure.length
              )
            ]
          }`
        );
      } else {
        setMessage(
          `Le temps est écoulé ! ${
            encouragingMessages.failure[
              Math.floor(Math.random() * encouragingMessages.failure.length)
            ]
          }`
        );
        clearUserInput();
        generateQuestion();
      }
      setIsTimerExpired(false);
    }
  }, [
    isTimerExpired,
    gameOver,
    remainingTries,
    currentNumber,
    multiplier,
    generateQuestion,
  ]);

  useEffect(() => {
    if (gameOver) return;
    setIsTimerExpired(false);

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 100) {
          clearInterval(timer);
          setIsTimerExpired(true);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [currentNumber, multiplier, gameOver]);

  return (
    <View className="flex-1 bg-indigo-50">
      <ScrollView className="flex-1 p-4">
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
        <View className="items-center my-8">
          <Text className="text-7xl font-bold text-primary-500 mb-2.5">
            {`${currentNumber} × ${multiplier} = ${userInput || "?"}`}
          </Text>
        </View>

        {/* Buddy Animation Container */}
        <Animated.View
          style={[
            {
              position: "absolute",
              width: "100%",
              alignItems: "center",
              zIndex: 10,
            },
            buddyStyle,
          ]}
        >
          <Image
            source={require("../../../assets/images/buddy.png")}
            style={{ width: 160, height: 160 }}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Remaining Tries Dots */}
        <View className="flex-row justify-center mb-8">
          {Array.from({ length: MAX_TRIES }).map((_, index) => (
            <View key={index} className="mx-1">
              <X
                size={24}
                color={
                  index < MAX_TRIES - remainingTries ? "#EF4444" : "#E5E7EB"
                }
                strokeWidth={3}
              />
            </View>
          ))}
        </View>

        {/* Message */}
        {message && (
          <Text className="text-2xl text-center my-5 text-primary-600 font-semibold">
            {message}
          </Text>
        )}
      </ScrollView>

      {/* Fixed Bottom Section */}
      <View className="p-4 bg-white border-t rounded-t-3xl border-gray-200">
        {/* Virtual Keyboard */}
        <VirtualKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onSubmit={handleSubmit}
          disabled={gameOver}
        />

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
          className={`p-4 rounded-xl items-center mt-4 ${
            gameOver ? "bg-primary-500/75" : "bg-gray-300"
          }`}
          onPress={startNewGame}
          disabled={!gameOver}
        >
          <Text
            className={`text-lg font-semibold ${
              gameOver ? "text-white" : "text-gray-500"
            }`}
          >
            Recommencer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
