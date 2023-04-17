import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import pikachu from '../Char-pikachu.webp';

import styles from './ContactForm.module.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import InputMask from "react-input-mask";


const ContactForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 900px)" });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (formData) => {
    if (!phoneNumber.match(/^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/)) {
      setPhoneNumberError(true);
      return;
    }

    formData.phoneNumber = phoneNumber;

    dispatch({ type: 'SET_FORM_DATA', payload: formData });
    navigate('/pokemon-select');
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
        <div className={styles.contactFormContainer}>
          <h2>About You</h2>
          <Box onSubmit={handleSubmit(onSubmit)}
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '80%' },
            }}
            noValidate
            autoComplete="off">
            <TextField
              type="text"
              label="First Name:"
              required
              {...register("firstName", {
                required: true,
                maxLength: 20,
                pattern: /^[A-Za-z]+$/i
              })}
              error={!!errors?.firstName}
              helperText={(errors?.firstName?.type === "required" && "This field is required")
                || (errors?.firstName?.type === "maxLength" && "First name cannot exceed 20 characters")
                || (errors?.firstName?.type === "pattern" && "Alphabetical characters only")} />
            <TextField
              type="text"
              label="Last Name:"
              required
              {...register("lastName", {
                required: true,
                maxLength: 20,
                pattern: /^[A-Za-z]+$/i
              })}
              error={!!errors?.lastName}
              helperText={(errors?.lastName?.type === "required" && "This field is required")
                || (errors?.lastName?.type === "maxLength" && "Last name cannot exceed 20 characters")
                || (errors?.lastName?.type === "pattern" && "Alphabetical characters only")} />
            <InputMask
              mask="(999)999-9999"
              onChange={(e) => setPhoneNumber(e.target.value)}
            >
              {() => <TextField type="tel"
                label="Phone Number:"
                error={phoneNumberError}
                helperText={phoneNumberError ? "Invalid phone number" : null}
                required 
                />}
            </InputMask>
            <TextField
              label="Address:"
              required
              multiline
              maxRows={3}
              {...register("address", {
                required: true,
              })}
              error={!!errors?.address}
              helperText={(errors?.address?.type === "required" && "This field is required")}
            />

            <button className={styles.button} type="submit">Continue</button>
          </Box>
        </div>
        {isMobile ? null
          : <div className={styles.containerRight}>
            <img className={styles.image} alt="pikachu" src={pikachu} />
          </div>}
      </div>
    </div>
  );
};

export default ContactForm;
