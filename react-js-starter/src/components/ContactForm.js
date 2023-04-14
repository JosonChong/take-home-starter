import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './ContactForm.css';

const ContactForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform form validation
    if (!firstName || !lastName || !phoneNumber || !address) {
      setFormError('All fields are required');
      return;
    }

    const formData = {
      firstName,
      lastName,
      phoneNumber,
      address,
    };

    console.log(formData);

    dispatch({ type: 'SET_FORM_DATA', payload: { formData } });
    navigate('/pokemon-select');
  };

  return (
    <div className="contact-form-container">
      <h2>Contact Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />

        <label htmlFor="address">Address:</label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        ></textarea>

        <button type="submit">Continue</button>
        {formError && <p className="form-error">{formError}</p>}
      </form>
    </div>
  );
};

export default ContactForm;
