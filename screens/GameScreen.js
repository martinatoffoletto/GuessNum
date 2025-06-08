import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  BackHandler,
} from "react-native";
import GameLogic from "../GameLogic";


export default function GameScreen({ route, navigation }) {
  const { name, allowRepeat } = route.params;
  const [secret, setSecret] = useState("");
  const [final, setFinal] = useState("XXXX");
  const [attempt, setAttempt] = useState("");
  const [history, setHistory] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const generateNewSecret = () => {
    const newSecret = GameLogic.generateNumber(allowRepeat);
    console.log("secreto generado:", newSecret);
    setSecret(newSecret);
    setFinal("XXXX");
    setHistory([]);
    setAttempt("");
    setAttemptsLeft(10);
    setGameOver(false);
    setResultMessage("");
  };

  useEffect(() => {
    generateNewSecret();
  }, []);

  useEffect(() => {
    if (attempt.length === 4  && !gameOver) {
      handleGuess();
    }
  }, [attempt]);

  const handleGuess = () => {
    const result = GameLogic.checkGuess(secret, attempt);
    setHistory([{ guess: attempt, result }, ...history]);
    const newAttemptsLeft = attemptsLeft - 1;
    setAttemptsLeft(newAttemptsLeft);

    if (result.correct === 4) {
      setFinal(secret);
      setResultMessage(`¡Ganaste! El número era ${secret}`);
      GameLogic.updateRanking(name, true); //incrementa contador de ganados
      setGameOver(true);
      return;
    }

    if (newAttemptsLeft <= 0) {
      setFinal(secret);
      setResultMessage(`Perdiste. El número era ${secret}`);
      GameLogic.updateRanking(name, false); //incrementa contador de perdidos
      setGameOver(true);
      return;
    }

    setAttempt("");
  };

  return (
    <View style={styles.container}>
        <View style={styles.backButtonContainer}>
              <Button
                title="←"
                onPress={() => navigation.navigate("Tabs", { screen: "Home" })}
              />
        </View>
      <Text style={styles.title}>Número  {final}</Text>
      <Text style={styles.subtitle}>Jugador: {name}</Text>
      <Text style={styles.subtitle}>Intentos restantes: {attemptsLeft}</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingresa 4 cifras"
        keyboardType="numeric"
        maxLength={4}
        value={attempt}
        onChangeText={setAttempt}
        onChangeText={(text) => {
            if (/^\d*$/.test(text)) { //para choquiar q sean solo numeros
              setAttempt(text);
            } else {
              Alert.alert("Error", "Solo se permiten números.");
            }
          }}
        editable={!gameOver}
      />

      <FlatList
              data={history}
              keyExtractor={(_, i) => i.toString()}
              ListHeaderComponent={
                history.length > 0 && (
                  <Text style={styles.historyTitle}>Historial de Intentos</Text>
                )
              }
              renderItem={({ item, index }) => (
                <View style={styles.historyItem}>
                  <Text style={styles.historyGuess}>{history.length - index} - Número: {item.guess}</Text>
                  <Text style={styles.historyResult}>
                    Bien: {item.result.correct} | Regular: {item.result.regular} | Mal: {item.result.mal}
                  </Text>
                </View>
              )}
       />

      {gameOver && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{resultMessage}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Jugar otra vez" onPress={generateNewSecret} color="#28a745" />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Finalizar"
              onPress={() => BackHandler.exitApp()}
              color="#dc3545"
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
    marginTop:20
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 18,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    marginVertical: 5,
    alignSelf: "center",
    width: "60%",
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom:20,
    textAlign: "center",
  },
  historyItem: {
      padding: 10,
      backgroundColor: "#e9ecef",
      borderRadius: 5,
      marginTop: 10,
    },
    historyGuess: {
      fontSize: 16,
    },
    historyResult: {
      fontSize: 16,
      fontStyle: "italic",
    },
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resultText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  backButtonContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 40,
  },

});
