import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState("");
  const [allowRepeat, setAllowRepeat] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Adivina el Número</Text>

      <Text style={styles.label}> Ingresa tu nombre:</Text>
      <TextInput
        style={styles.input}
        placeholder="Tu nombre"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>¿Jugar con repetición de cifras?</Text>

      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.option, allowRepeat && styles.optionActiveYes]}
          onPress={() => setAllowRepeat(true)}
        >
          <Text style={allowRepeat ? styles.textActive : styles.textInactive}>Si</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, !allowRepeat && styles.optionActiveNo]}
          onPress={() => setAllowRepeat(false)}
        >
          <Text style={!allowRepeat ? styles.textActive : styles.textInactive}>No</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.buttonContainer}>
        <Button
          title="Jugar"
          disabled={!name.trim()}
          onPress={() => navigation.navigate("Game", { name, allowRepeat })}
          color="#007bff"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f4f6f8',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#2c3e50',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#34495e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 30,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#e0e0e0',
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionActiveNo: {
    backgroundColor: '#e53935', // rojo vivo
  },
  optionActiveYes: {
    backgroundColor: '#4CAF50', // verde (como antes)
  },
  textActive: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInactive: {
    color: '#555',
    textAlign: 'center',
  },
  buttonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
});
