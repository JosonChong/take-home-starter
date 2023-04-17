import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import ContactForm from './components/ContactForm';
import PokemonSelect from './components/PokemonSelect';

function App() {
  const [pokemonList, setPokemonList] = useState({});

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=5000");
        const data = await response.json();
        const newPokemonList = {};

        for (const pokemon of data.results) {
          newPokemonList[pokemon.name] = {
            name: pokemon.name,
            url: pokemon.url
          };
        }
        setPokemonList(newPokemonList);
      } catch (error) {
        console.error("Failed to fetch Pokemon list:", error);
      }
    };

    fetchPokemonList();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" rel="stylesheet" href="components/ContactForm.css" element={<ContactForm />} />
        <Route exact path="/pokemon-select" element={<PokemonSelect pokemonList={pokemonList} />} />
      </Routes>
    </div>
  );
}

export default App;