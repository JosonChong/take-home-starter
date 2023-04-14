
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import Trie from "../Trie";

const PokemonSelect = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [pokemonList, setPokemonList] = useState([]);
    const [pokemonImageUrls, setPokemonImageUrls] = useState({});
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [trie, setTrie] = useState(new Trie());

    useEffect(() => {
        const newTrie = new Trie();

        // Fetch the Pokemon list from PokeAPI
        const fetchPokemonList = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=5000");
                const data = await response.json();
                for (const pokemon of data.results) {

                    pokemonList[pokemon.name] = {
                        name: pokemon.name,
                        url: pokemon.url
                    };

                    newTrie.insert(pokemon.name);
                }

                // add pokemon name to trie
                setTrie(newTrie);
                setPokemonList(pokemonList);
            } catch (error) {
                console.error("Failed to fetch Pokemon list:", error);
            }
        };
        fetchPokemonList();

    }, [pokemonList]);


    const handleInputChange = (event) => {
        const input = event.target.value;
        setSearchTerm(input);

        if (input === "") {
            setSuggestions([]);
        } else {
            const autoCompleteSuggestions = trie.autoComplete(input.toLowerCase());
            autoCompleteSuggestions.forEach(suggestion => {
                fetchPokemonImage(suggestion);
            });

            setSuggestions(autoCompleteSuggestions);
        }
    };


    const fetchPokemonImage = async (name) => {
        try {
            const response = await fetch(pokemonList[name].url);
            const data = await response.json();
            const imageUrl = data.sprites.front_default;

            setPokemonImageUrls(prevState => ({ ...prevState, [name]: imageUrl }));
        } catch (error) {
            console.error("Failed to fetch Pokemon image:", error);
        }
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        
        dispatch({ type: 'SET_SELECTED_POKEMON', payload: selectedPokemon });

        navigate('/review');
    };


    const handlePokemonClick = (pokemon) => {
        setSelectedPokemon(pokemon);
    };

    const clearSelectedPokemon = () => {
        setSelectedPokemon(null);
    };


    return (
        <div>
            <h1>Pokemon Select</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                <button
                    type="submit"
                    disabled={!selectedPokemon}
                    style={{
                        backgroundColor: selectedPokemon ? '' : 'grey',
                        color: selectedPokemon ? '' : 'white',
                        cursor: selectedPokemon ? 'pointer' : 'default'
                      }}
                >
                    {selectedPokemon ? 'Review' : 'Select a Pokemon to continue'}
                </button>

            </form>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "5px",
                    margin: "-5px",
                }}
            >
                {suggestions.map((suggestion) => (
                    pokemonImageUrls[suggestion] && <div
                        key={suggestion}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            margin: "5px",
                            flexBasis: "100px",
                        }}

                        onClick={() =>
                            selectedPokemon === suggestion
                                ? clearSelectedPokemon()
                                : handlePokemonClick(suggestion)
                        }
                    >
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                height: "100%",
                                overflow: "hidden",
                            }}
                        >
                            <img
                                key={`${suggestion}-image`}
                                src={pokemonImageUrls[suggestion]}
                                alt={suggestion}
                                width="96"
                                height="96"
                                style={{
                                    marginBottom: "5px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    borderWidth: "3px",
                                    borderColor:
                                        selectedPokemon === suggestion ? "green" : "transparent",
                                }}
                            />
                            {selectedPokemon === suggestion ? (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        fontSize: "36px",
                                        color: "green",
                                    }}
                                >
                                    &#10003;
                                </div>
                            ) : null}
                        </div>
                        <span
                            style={{
                                fontSize: "18px",
                                textAlign: "center",
                            }}
                        >
                            {suggestion}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

};


export default PokemonSelect;
