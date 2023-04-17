import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { InputAdornment, TextField, Alert, AlertTitle } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import queryString from 'query-string';

import Overlay from './Overlay';
import CopyLink from './CopyLink';
import SearchIcon from "@mui/icons-material/Search"; import Trie from "../Trie";
import styles from './PokemonSelect.module.css';
import questionBall from '../Question_Ball.png';

const PokemonSelect = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { pokemonList } = props;
    const [suggestions, setSuggestions] = useState([]);
    const [pokemonImageUrls, setPokemonImageUrls] = useState({});
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [selectedPokemonData, setSelectedPokemonData] = useState({});
    const [trie, setTrie] = useState(new Trie());
    const [isContinue, setIsContinue] = useState(false);
    const [searchText, setSearchText] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [currentUrl, setCurrentUrl] = useState("");
    const [formDataError, setFormDataError] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const preselectedPokemon = useSelector(state => state.selectedPokemon);
    
    const isMobile = useMediaQuery({ query: "(max-width: 900px)" });
    const params = queryString.parse(window.location.search);
    let formData = useSelector(state => state.formData);

    useEffect(() => {
        const newTrie = new Trie();
        for (const pokemon in pokemonList) {
            newTrie.insert(pokemon);
        }
        setTrie(newTrie);

    }, [pokemonList]);

    useEffect(() => {
        if (preselectedPokemon) {
            searchPokemon(preselectedPokemon);
            setSelectedPokemon(preselectedPokemon);
            selectPokemon(preselectedPokemon);
        }

        if (window.location.search) {
            formData = {};

            formData.firstName = params.firstName;
            formData.lastName = params.lastName;
            formData.phoneNumber = params.phoneNumber;
            formData.address = params.address;

            if (validateContactForm(formData)) {
                dispatch({ type: 'SET_FORM_DATA', payload: formData });
            }

            if (params.favouritePokemon) {
                if (pokemonList[params.favouritePokemon]) {
                    searchPokemon(params.favouritePokemon);
                    setSelectedPokemon(params.favouritePokemon);
                    selectPokemon(params.favouritePokemon);

                    dispatch({ type: 'SET_SELECTED_POKEMON', payload: params.favouritePokemon });
                }
            }
        }

        if (!validateContactForm(formData)) {
            setFormDataError(true);
        }
    }, [trie]);

    const validateContactForm = (form) => {
        if (!form) {
            return false;
        }

        if (!form.firstName || form.firstName.length > 20 || !form.firstName.match(/^[A-Za-z]+$/)) {
            return false;
        }

        if (!form.lastName || form.lastName.length > 20 || !form.lastName.match(/^[A-Za-z]+$/)) {
            return false;
        }

        if (!form.phoneNumber || !form.phoneNumber.match(/^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/)) {
            return false;
        }

        if (!form.address) {
            return false;
        }

        return true;
    }

    const handleInputChange = (event) => {
        const input = event.target.value;

        if (input !== "") {
            searchPokemon(input);
        }
    };

    const searchPokemon = (name) => {
        setSearchText(name);

        const autoCompleteSuggestions = trie.autoComplete(name.toLowerCase());
        autoCompleteSuggestions.forEach(suggestion => {
            fetchPokemonImage(suggestion);
        });

        setSuggestions(autoCompleteSuggestions);
    }

    const fetchPokemonImage = async (name) => {
        try {
            const response = await fetch(pokemonList[name].url);
            const data = await response.json();
            const imageUrl = data.sprites.front_default;

            setPokemonImageUrls(prevState => ({ ...prevState, [name]: imageUrl }));
        } catch (ignored) { }
    };

    const selectPokemon = async (name) => {
        if (!name || !pokemonList) {
            return;
        }

        setSelectedPokemon(name);
        try {
            const response = await fetch(pokemonList[name].url);
            const data = await response.json();
            const imageUrl = data.sprites.other["official-artwork"]?.front_default;
            const weight = `${data.weight / 10} kg`;
            const height = `${data.height / 10} m`;

            setSelectedPokemonData({ name: name, imageUrl: imageUrl, weight: weight, height: height });
        } catch (ignored) { }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!isContinue) {
            if (!selectedPokemon) {
                return;
            }
            setIsContinue(true);
        } else {
            if (!validateContactForm(formData) || !selectedPokemon) {
                return;
            }

            setSubmitted(true);
            console.log("first name: " + formData.firstName);
            console.log("last name: " + formData.lastName);
            console.log("phone number: " + formData.phoneNumber);
            console.log("address: " + formData.address);
            console.log("favourite pokemon: " + selectedPokemon);
        }
    };

    const handleBack = (event) => {
        event.preventDefault();
        if (isContinue) {
            setIsContinue(false);
        } else {
            navigate('/');
        }
    };

    const toggleOverlay = () => {
        if (!showOverlay) {
            let url = window.location.origin;
            url += "/pokemon-select?firstName=";
            url += formData.firstName;
            url += "&lastName=";
            url += formData.lastName;
            url += "&phoneNumber=";
            url += formData.phoneNumber;
            url += "&address=";
            url += formData.address;

            if (selectedPokemon) {
                url += "&favouritePokemon=";
                url += selectedPokemon;
            }

            setCurrentUrl(url);
        }

        setShowOverlay(!showOverlay);
    };

    const handlePokemonClick = (pokemon) => {
        if (pokemon === selectedPokemon) {
            setSelectedPokemon(null);
            dispatch({ type: 'SET_SELECTED_POKEMON', payload: null });
        } else {
            selectPokemon(pokemon);
            dispatch({ type: 'SET_SELECTED_POKEMON', payload: pokemon });
        }
    };

    return (
        <div className={`${styles.wrapper}`}>
            {submitted ? <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                <strong>Congratulations!</strong> You have submitted your favourite Pokemon
            </Alert> : null}
            {formDataError ? <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                Seems like you haven't completed the contact form — <strong className={styles.errorLink} onClick={() => navigate('/')}>Click me to return</strong>
            </Alert> : null}
            {showOverlay ? <Overlay>
                <div className={`${styles.linkContainer} roundedCorner`}>
                    <h3>Your url with current state</h3>
                    <CopyLink link={currentUrl}></CopyLink>
                    <button onClick={toggleOverlay}>Close</button>
                </div>
            </Overlay> : null}
            <h1>{isContinue ? "Confirm your input" : "Select your favourite Pokemon"}</h1>
            <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
                <div className={`${styles.leftContainer} roundedCorner ${isMobile ? styles.mobile : ""}`} >
                    {selectedPokemon ? (
                        <div className={styles.selectedPokemon}>
                            <h2 className={styles.selectedPokemonName}>{selectedPokemon}</h2>
                            <img className={`${styles.pokemonImage} ${isMobile ? styles.mobile : ""}`} alt={selectedPokemon} src={selectedPokemonData.imageUrl} />
                            <div className={styles.informationContainer}>
                                <div>Weight: {selectedPokemonData.weight}</div>
                                <div>Height: {selectedPokemonData.height}</div>
                            </div>
                        </div>)
                        : (<div>
                            <img className={`${styles.questionBall} ${isMobile ? styles.mobile : ""}`} alt="Question ball" src={questionBall} />
                        </div>)}
                </div>
                <div className={`${styles.rightContainer} ${isMobile ? styles.mobile : ""}`}>
                    {!isContinue ? <div >
                        <div className={`${styles.pokemonSelectContainer} ${styles.noSelect} ${isMobile ? styles.mobile : ""}`}>
                            <TextField
                                id="search"
                                type="search"
                                label="Search"
                                defaultValue={preselectedPokemon ? preselectedPokemon : null}
                                onChange={handleInputChange}
                                sx={{ width: "100%" }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon />
                                        </InputAdornment>),
                                }} />
                            {!!suggestions.length || searchText ? <div className={styles.suggestionsContainer}>
                                <ul>{suggestions.map((suggestion) => (
                                    pokemonImageUrls[suggestion] && (
                                        <li
                                            key={suggestion}
                                            className={`${styles.suggestionSquare} ${selectedPokemon === suggestion ? styles.selected : ''
                                                }`}
                                            onClick={() => handlePokemonClick(suggestion)
                                            }>
                                            <img
                                                src={pokemonImageUrls[suggestion]}
                                                alt={suggestion} />
                                            <div className={styles.suggestionName}>{suggestion}</div>
                                        </li>)))}</ul> </div> : null}
                        </div>
                    </div > :
                        <div className={`${styles.reviewForm} ${isMobile ? styles.mobile : ""}`}>
                            <TextField
                                size="large"
                                sx={{ width: "370px", margin: "15px 90px" }}
                                id="selectedPokemon"
                                defaultValue={selectedPokemon}
                                label="Selected Pokemon"
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard" />
                            <div className={`${styles.nameContainer} ${isMobile ? styles.mobile : ""}`}>
                                <TextField
                                    id="firstName"
                                    sx={{ width: isMobile ? "370px" : "180px", margin: isMobile ? "15px 90px" : "15px 0px 15px 0px" }}
                                    defaultValue={formData.firstName}
                                    label="First Name"
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    variant="standard" />
                                <TextField
                                    id="lastName"
                                    sx={{ width: isMobile ? "370px" : "180px", margin: isMobile ? "15px 90px" : "15px 0px 15px 10px" }}
                                    defaultValue={formData.lastName}
                                    label="Last Name"
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    variant="standard" />
                            </div>
                            <div>
                                <TextField
                                    id="phoneNumber"
                                    sx={{ width: "370px", margin: "15px 90px" }}
                                    defaultValue={formData.phoneNumber}
                                    label="Phone Number"
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    variant="standard" />

                            </div>
                            <TextField
                                id="address"
                                sx={{ width: "370px", margin: "15px 90px" }}
                                defaultValue={formData.address}
                                maxRows={3}
                                multiline
                                label="Address"
                                InputProps={{
                                    readOnly: true
                                }}
                                variant="standard" />
                        </div>
                    }
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button onClick={handleBack} className={styles.backButton}>Back</button>
                <button onClick={toggleOverlay} disabled={formDataError} className={styles.saveButton}>Save</button>
                <button onClick={handleSubmit} disabled={formDataError || submitted || !selectedPokemon} className={styles.continueButton}>{isContinue ? "Submit" : "Continue"}</button>
            </div>
        </div>
    );
};

export default PokemonSelect;