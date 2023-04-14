import React, { useEffect } from 'react';
// import { store, persistor } from './redux/store';
import { Route, Routes } from 'react-router-dom';
import ContactForm from './components/ContactForm';
import PokemonSelect from './components/PokemonSelect';
import Review from './components/Review';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<ContactForm />} />
        <Route exact path="/pokemon-select" element={<PokemonSelect />} />
        <Route exact path="/review" element={<Review />} />
      </Routes>
    </div>
  );
}

export default App;
