import AsyncStorage from "@react-native-async-storage/async-storage";

const RANKING_KEY = "RANKING";

const GameLogic = {
  generateNumber(allowRepeat) {
    let digits = [];
    while (digits.length < 4) {
      const n = Math.floor(Math.random() * 10);
      if (allowRepeat) {
        digits.push(n);
      } else {
        if (!digits.includes(n)) {
          digits.push(n);
        }
      }
    }
    return digits.join("");
  },

  checkGuess(secret, guess) {
    let correct = 0; // dígitos en la posición correcta
    let regular = 0; // dígitos existentes pero en otra posición
    let mal = 0;     // dígitos no existentes en secreto

    const secretArr = secret.split("");
    const guessArr = guess.split("");

    // Para evitar contar varias veces un dígito:
    const secretCount = {};
    const guessCount = {};

    // Contar correctos (posición y número)
    for (let i = 0; i < 4; i++) {
      if (guessArr[i] === secretArr[i]) {
        correct++;
      } else {
        secretCount[secretArr[i]] = (secretCount[secretArr[i]] || 0) + 1;
        guessCount[guessArr[i]] = (guessCount[guessArr[i]] || 0) + 1;
      }
    }

    // Contar regulares (número correcto pero posición incorrecta)
    for (const d in guessCount) {
      if (secretCount[d]) {
        regular += Math.min(guessCount[d], secretCount[d]);
      }
    }

    mal = 4 - correct - regular;

    return { correct, regular, mal };
  },

  // Guardar valor en AsyncStorage
  guardar: async (clave, valor) => {
    try {
      await AsyncStorage.setItem(clave, JSON.stringify(valor));
    } catch (error) {
      console.log("Error guardando datos:", error);
    }
  },

  // Recuperar valor de AsyncStorage
  recuperar: async (clave) => {
    try {
      const recuperado = await AsyncStorage.getItem(clave);
      if (recuperado != null) {
        return JSON.parse(recuperado);
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error recuperando datos:", error);
      return null;
    }
  },

  // Obtener ranking completo
  getRanking: async () => {
    const ranking = await GameLogic.recuperar(RANKING_KEY);
    return ranking || [];
  },

  // Actualizar ranking con resultado (true=ganó, false=perdió)
  updateRanking: async (name, won) => {
    let ranking = await GameLogic.getRanking();

    const playerIndex = ranking.findIndex((p) => p.name === name);

    if (playerIndex === -1) {
      ranking.push({
        name,
        wins: won ? 1 : 0,
        losses: won ? 0 : 1,
      });
    } else {
      if (won) ranking[playerIndex].wins++;
      else ranking[playerIndex].losses++;
    }

    await GameLogic.guardar(RANKING_KEY, ranking);
  },
};

export default GameLogic;
