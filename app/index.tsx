import GameScreen from "./src/screens/GameScreen";
import { SafeAreaView } from "react-native";

export default function Index() {
  return (
    <SafeAreaView className="flex-1">
      <GameScreen />
    </SafeAreaView>
  );
}
