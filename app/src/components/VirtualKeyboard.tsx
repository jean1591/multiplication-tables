import { Text, TouchableOpacity, View } from "react-native";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function VirtualKeyboard({
  onKeyPress,
  onBackspace,
  onSubmit,
  disabled = false,
}: VirtualKeyboardProps) {
  const renderKey = (value: string) => (
    <TouchableOpacity
      className="w-28 h-14 bg-amber-50 border-2 border-blue-200 rounded-xl items-center justify-center m-1"
      onPress={() => onKeyPress(value)}
      disabled={disabled}
    >
      <Text className="text-2xl font-semibold text-gray-800">{value}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-row flex-wrap justify-center p-2">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((num) => (
        <View key={num} className="w-1/3 items-center">
          {renderKey(num)}
        </View>
      ))}
      <View className="w-1/3 items-center">
        <TouchableOpacity
          className="w-28 h-14 bg-red-100 border-2 border-red-300 rounded-xl items-center justify-center m-1"
          onPress={onBackspace}
          disabled={disabled}
        >
          <Text className="text-2xl font-semibold text-red-500">⌫</Text>
        </TouchableOpacity>
      </View>
      <View className="w-1/3 items-center">
        <TouchableOpacity
          className="w-28 h-14 bg-primary-500/30 border-2 border-primary-500/60 rounded-xl items-center justify-center m-1"
          onPress={onSubmit}
          disabled={disabled}
        >
          <Text className="text-2xl font-semibold text-white">✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
