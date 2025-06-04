import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import GameLogic from "../GameLogic";

export default function RankingScreen({ navigation }) {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    (async () => {
      const r = await GameLogic.getRanking();
      setRanking(r || []);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Ranking de Jugadores</Text>

      {ranking.length === 0 ? (
        <Text style={styles.noData}>No hay datos aún.</Text>
      ) : (
        <FlatList
          data={ranking}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.statsRow}>
                <Text style={styles.stat}>✅ Ganados: {item.wins}</Text>
                <Text style={styles.stat}>❌ Perdidos: {item.losses}</Text>
              </View>
            </View>
          )}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
  noData: { textAlign: "center", color: "#999", fontSize: 16, marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 6, color: "#444" },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  stat: { fontSize: 16, color: "#555" },
  backButton: {
    marginTop: 20,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
