import React, { useState } from 'react';
import {
  Button, FormHelperText, TextField, FormLabel, RadioGroup, Radio, FormControlLabel,
  Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import axios from 'axios';

const userPoolData = {
  UserPoolId: process.env.REACT_APP_AUTH_USER_POOL_ID,
  ClientId: process.env.REACT_APP_AUTH_APP_CLIENT_ID
};

const userPool = new CognitoUserPool(userPoolData);

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    question: "",
    answer: "",
    word: "",
    profile: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    question: false,
    answer: false,
    word: false,
    profile: false,
  });

  const [open, setOpen] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [cognitoUser, setCognitoUser] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === "question" && value === "") {
      setErrors({ ...errors, question: true });
    } else {
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleSubmit = async () => {
    const {
      name, email, password, confirmPassword, question, answer, word, profile
    } = formData;

    const newErrors = {
      name: !name,
      email: !emailRegex.test(email),
      question: !question,
      answer: !answer,
      word: !word,
      profile: !profile,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error) || confirmPassword !== password) {
      window.alert("Please fix all the errors");
      return;
    }

    const attributeList = [
      new CognitoUserAttribute({ Name: 'name', Value: name }),
      new CognitoUserAttribute({ Name: 'profile', Value: profile }),
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'custom:security-question', Value: question }),
      new CognitoUserAttribute({ Name: 'custom:security-answer', Value: answer }),
      new CognitoUserAttribute({ Name: 'custom:caesar-cypher', Value: word }),
    ];

    userPool.signUp(email, password, attributeList, null, async (err, result) => {
      if (err) {
        console.error("Error signing up:", err);
        window.alert(`Issue during Signup:\r\n${err.message || JSON.stringify(err)}`);
        return;
      }

      setCognitoUser(result.user);
      setOpen(true);
    });
  };

  const handleConfirmSignup = () => {
    if (!cognitoUser) {
      window.alert("No user to confirm");
      return;
    }

    cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
      if (err) {
        console.error("Error confirming signup:", err);
        window.alert(`Issue during Signup confirmation:\r\n${err.message || JSON.stringify(err)}`);
        return;
      }
      console.log('Confirmation result:', result);
      setCognitoUser(cognitoUser);
      setOpen(false);

      axios.post("https://ewo9dzucpl.execute-api.us-east-1.amazonaws.com/test/subscribe", {
        "userEmail": formData.email,
        "notificationType": "Registration"
      });

      window.alert("Signup confirmed! You can now log in.");
      navigate("/login");
    });
  };

  return (
    <div className="container">
      <div className="signup-box">
        <Typography variant="h4" className="signup-title"><strong>Sign Up</strong></Typography>
        <TextField
          required
          label="Name"
          margin="normal"
          name="name"
          onChange={handleChange}
          error={errors.name}
          helperText={errors.name ? "Please enter a valid name" : ""}
          fullWidth
        />
        <TextField
          required
          label="Email"
          margin="normal"
          name="email"
          onChange={handleChange}
          error={errors.email}
          helperText={errors.email ? "Invalid email address" : ""}
          fullWidth
        />
        <TextField
          required
          label="Password"
          type="password"
          margin="normal"
          name="password"
          onChange={handleChange}
          fullWidth
        />
        <TextField
          required
          label="Confirm Password"
          type="password"
          margin="normal"
          name="confirmPassword"
          onChange={handleChange}
          fullWidth
        />
        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel>Question *</InputLabel>
          <Select
            name="question"
            value={formData.question}
            onChange={handleChange}
            error={errors.question}
          >
            <MenuItem value={"What is your father's middle name?"}>What is your father's middle name?</MenuItem>
            <MenuItem value={"What is the name of your first pet?"}>What is the name of your first pet?</MenuItem>
            <MenuItem value={"In what city were you born?"}>In what city were you born?</MenuItem>
            <MenuItem value={"What high school did you attend?"}>What high school did you attend?</MenuItem>
          </Select>
          <FormHelperText>{errors.question ? "Select a question" : ""}</FormHelperText>
        </FormControl>
        <TextField
          required
          label="Answer"
          margin="normal"
          name="answer"
          onChange={handleChange}
          error={errors.answer}
          helperText={errors.answer ? "Enter an answer" : ""}
          fullWidth
        />
        <TextField
          required
          label="Secret Word"
          margin="normal"
          name="word"
          onChange={handleChange}
          error={errors.word}
          helperText={errors.word ? "Enter a word" : ""}
          sx={{ mt: 1 }}
          fullWidth
        />
        <FormControl fullWidth>
          <FormLabel>Role</FormLabel>
          <RadioGroup
            row
            name="profile"
            onChange={handleChange}
          >
            <FormControlLabel value="user" control={<Radio />} label="User" />
            <FormControlLabel value="property-agent" control={<Radio />} label="Property Agent" />
          </RadioGroup>
          <FormHelperText>{errors.profile ? "Select a profile" : ""}</FormHelperText>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className="signup-button"
          sx={{ mt: 3 }}
          onClick={handleSubmit}
          fullWidth
        >
          Sign Up
        </Button>
        <Link to="/login" className="login-link">Back to login</Link>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Signup</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the confirmation code sent to your email.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Confirmation Code"
            type="text"
            fullWidth
            variant="standard"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmSignup}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Signup;
