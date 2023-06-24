

// CSS

import './App.css';


// REACT
import {useCallback, useEffect, useState} from "react";


// Data
import { wordsList } from './Data/Words';


// Components


import StartScreen from './Components/StartScreen';
import Game from './Components/Game';
import Over from './Components/Over';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

const guessesNumber = 5

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [Words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGesses] = useState(5)
  const [score, setScore] = useState(0)

  //

  const pickWordAndPickCategory = useCallback(() => {
    // Pick a random category
    const categories = Object.keys(Words);
    //para pegar uma palavra aleatoria
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    console.log(category);

    // Pick a random word
    const word = Words[category][Math.floor(Math.random() * Words[category].length)];

    console.log(word);

      return{word, category}
  }, [Words])

    // starts the secret word game
  const startGame = useCallback(() => {

    //clear all letters
    clearLetterState();




    // criar função pickword e pickcategory
  const{ word, category } = pickWordAndPickCategory();


  // 3 - create an array of letters
  let wordLetters = word.split("");
 
  wordLetters = wordLetters.map((l) => l.toLowerCase());
  


  console.log(word, category);
  console.log(wordLetters);

  // 4 - fill states
  setPickedWord(word);
  setPickedCategory(category);
  setLetters(wordLetters);


    setGameStage(stages[1].name)
  }, [pickWordAndPickCategory]);

  // Process the letter input
  const verifyLetter = (letter) => {
    
    const normalizarLetra = letter.toLowerCase();

    // check if letter has alredy been utilized

    if(guessedLetters.includes(normalizarLetra) || 
       wrongLetters.includes(normalizarLetra)
       ) {
        return;
      }

      // push guessed letter of remove a guess
    if (letters.includes(normalizarLetra)) {
        setGuessedLetters((actualGuessedLetters) => [
          ...actualGuessedLetters,
          letter,
        ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
          ...actualWrongLetters,
          normalizarLetra,
      ])

      setGesses((actualGuesses) => actualGuesses - 1)
    }    
  };

  console.log(wrongLetters);

  // para iniciar o jogo com as tentativas com 3
  const clearLetterState = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  //monitora dados
  useEffect(() => {
    if(guesses === 0) {
      // reset all states
      clearLetterState()

      setGameStage(stages[2].name)
    }
  }, [guesses]);

  // check win condition
  useEffect(() => {

    const uniqueLetters = [...new Set(letters)];

    //win condition
    if(guessedLetters.length === uniqueLetters.length) {
      // add score
      setScore((actualScore) => actualScore += 50)
      setGesses(5)

      // restart game with new word
      startGame()
    }

  }, [guessedLetters, letters, startGame ])

  // Restart the game
  const retry = () => {
    setScore(0);
    setGesses(5);

    setGameStage(stages[0].name)
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && (
      <Game 
      verifyLetter={verifyLetter} 
      pickedWord={pickedWord} 
      pickedCategory={pickedCategory} 
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}     
      />
    )}
      
      {gameStage === "end" && <Over retry={retry} score={score} />}
    </div>
  );
}

export default App;
