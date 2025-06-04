import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList } from "react-native";
import GameLogic from "../GameLogic";

export default function GameScreen({ route, navigation }) {
  const { name, allowRepeat } = route.params;

  const [secret, setSecret] = useState("");
  const [attempt, setAttempt] = useState("");
  const [history, setHistory] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const newSecret = GameLogic.generateNumber(allowRepeat);
    setSecret(newSecret);
  }, []);

  const handleGuess = () => {
    if (attempt.length !== 4 || !/^\d{4}$/.test(attempt)) {
      Alert.alert("Error", "Ingresa un número válido de 4 cifras.");
      return;
    }

    const result = GameLogic.checkGuess(secret, attempt);
    setHistory([{ guess: attempt, result }, ...history]);
    setAttemptsLeft(attemptsLeft - 1);

    if (result.correct === 4) {
      Alert.alert("¡Ganaste!", `Felicidades, adivinaste el número ${secret}`, [
        {
          text: "OK",
          onPress: async () => {
            await GameLogic.updateRanking(name, true);
            navigation.navigate("Tabs");
          },
        },
      ]);
      setGameOver(true);
      return;
    }

    if (attemptsLeft - 1 <= 0) {
      Alert.alert("Perdiste", `Se te acabaron los intentos. El número era: ${secret}`, [
        {
          text: "OK",
          onPress: async () => {
            await GameLogic.updateRanking(name, false);
            navigation.navigate("Tabs");
          },
        },
      ]);
      setGameOver(true);
      return;
    }

    setAttempt("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Jugador: {name}</Text>
      <Text style={styles.subtitle}>Intentos restantes: {attemptsLeft}</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingresa 4 cifras"
        keyboardType="numeric"
        maxLength={4}
        value={attempt}
        onChangeText={setAttempt}
        editable={!gameOver}
      />

      <View style={styles.buttonContainer}>
        <Button title="Intentar" onPress={handleGuess} disabled={gameOver} color="#007bff" />
      </View>

      <FlatList
        data={history}
        keyExtractor={(_, i) => i.toString()}
        ListHeaderComponent={
          history.length > 0 && (
            <Text style={styles.historyTitle}>Historial de Intentos</Text>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.historyGuess}>Número: {item.guess}</Text>
            <Text style={styles.historyResult}>
              ✅ Correctos: {item.result.correct} | 🟡 Regular: {item.result.regular} | ❌ Mal: {item.result.mal}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8", padding: 20, paddingTop: 50 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10, color: "#333" },
  subtitle: { fontSize: 16, marginBottom: 10, color: "#666" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    marginVertical: 12,
    borderRadius: 10,
    overflow: "hidden",
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    color: "#444",
  },
  historyItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  historyGuess: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#222",
  },
  historyResult: {
    fontSize: 14,
    color: "#555",
  },
});
