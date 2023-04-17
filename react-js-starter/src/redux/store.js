import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
  formData: null,
  selectedPokemon: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return {
        ...state,
        formData: action.payload,
      };
    case 'SET_SELECTED_POKEMON':
      return {
        ...state,
        selectedPokemon: action.payload,
      };
    default:
      return state;
  }
};

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer);

const persistor = persistStore(store);

export { store, persistor };
