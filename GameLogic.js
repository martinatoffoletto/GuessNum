import AsyncStorage from "@react-native-async-storage/async-storage";

const RANKING_KEY = "RANKING";

const GameLogic = {
  generateNumber(allowRepeat) { //genera num random entre 0 y 9
    let digits = [];
    while (digits.length < 4) {
      const n = Math.floor(Math.random() * 10);
      if (allowRepeat) { //si se permiten repetidos
        digits.push(n);
      } else { //no se permiten repetidos, pide otro
        if (!digits.includes(n)) {
          digits.push(n);
        }
      }
    }
    return digits.join("");
  },

  checkGuess(secret, guess) {
    let correct = 0;
    let regular = 0;
    let mal = 0;

    const secretArr = secret.split("");
    const guessArr = guess.split("");

    const secretCount = {};
    const guessCount = {};

    for (let i = 0; i < 4; i++) { //num q respetan posicion
      if (guessArr[i] === secretArr[i]) {
        correct++; //mismo num en misma posicion
      } else {
        secretCount[secretArr[i]] = (secretCount[secretArr[i]] || 0) + 1; //agrego a dict num y cantidad
        guessCount[guessArr[i]] = (guessCount[guessArr[i]] || 0) + 1;
      }
    }

    // num correcto pero pos incorrecta
    for (const d in guessCount) {
      if (secretCount[d]) {
        regular += Math.min(guessCount[d], secretCount[d]);
      }
    }

    mal = 4 - correct - regular;

    return { correct, regular, mal };
  },


  guardar: async (clave, valor) => {  //guarda con valor clave
    try {
      await AsyncStorage.setItem(clave, JSON.stringify(valor));
    } catch (error) {
      console.log("Error guardando datos:", error);
    }
  },

  recuperar: async (clave) => { //accede a el valor con la clave
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

  getRanking: async () => { //devuelve lista de diccionarios {nombre, victorias, perdidas} de ranking
    const ranking = await GameLogic.recuperar(RANKING_KEY);
    return ranking || [];
  },

  updateRanking: async (name, won) => {
    let ranking = await GameLogic.getRanking();

    const playerIndex = ranking.findIndex((p) => p.name === name); //buscar el indice de ese nombre en la lista

    if (playerIndex === -1) { //si no esta lo crea
      ranking.push({
        name,
        wins: won ? 1 : 0,
        losses: won ? 0 : 1,
      });
    } else { ///si esta incrementa dependiendo si gano o no
      if (won) ranking[playerIndex].wins++;
      else ranking[playerIndex].losses++;
    }

    await GameLogic.guardar(RANKING_KEY, ranking);
  },
};

export default GameLogic;
