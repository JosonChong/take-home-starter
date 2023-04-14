import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
  formData: null,
  selectedPokemon: null,
  pokemonList: {},
  pokemonImageUrls: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_SELECTED_POKEMON':
      return {
        ...state,
        selectedPokemon: action.payload,
      };
    case 'SET_POKEMON_LIST':
      return {
        ...state,
        pokemonList: action.payload,
      };
    default:
      return state;
  }
};

// Action creator function for setting pokemonList
export const setPokemonList = (pokemonList) => ({
  type: 'SET_POKEMON_LIST',
  payload: pokemonList,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer);

const persistor = persistStore(store);


export { store, persistor };
