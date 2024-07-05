import React, { useState } from 'react';
import { Button, FormHelperText, TextField, FormLabel, RadioGroup, Radio, FormControlLabel, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import './Signup.css';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { Link, useNavigate } from 'react-router-dom';

const userPoolData = {
  UserPoolId: process.env.REACT_APP_AUTH_USER_POOL_ID,
  ClientId: process.env.REACT_APP_AUTH_APP_CLIENT_ID
};

const userPool = new CognitoUserPool(userPoolData);

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answerError, setAnswerError] = useState("");
  const [word, setWord] = useState("");
  const [wordError, setWordError] = useState(false);
  const [profile, setProfile] = useState("");
  const [profileError, setProfileError] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [cognitoUser, setCognitoUser] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleProfileChange = (event) => {
    setProfile(event.target.value);
  };

  const handleQuestionChange = (event) => {
    if (question === "") {
      setQuestionError(true);
    } else {
      setQuestionError(false);
    }
    setQuestion(event.target.value);
  }

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  }

  const handleWordChange = (event) => {
    setWord(event.target.value);
  }

  const handleSubmit = async () => {
    if (!name) {
      setNameError(true);
    } else {
      setNameError(false);
    }

    if (!emailRegex.test(email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }

    if (!question) {
      setQuestionError(true);
    } else {
      setQuestionError(false);
    }

    if (!answer) {
      setAnswerError(true);
    } else {
      setAnswerError(false);
    }

    if (!word) {
      setWordError(true);
    } else {
      setWordError(false);
    }

    if (!profile) {
      setProfileError(true);
    } else {
      setProfileError(false);
    }

    if (nameError || emailError || (confirmPassword !== password) || questionError || answerError || wordError || profileError) {
      window.alert("Please fix all the errors");
    } else {
      const attributeList = [
        new CognitoUserAttribute({ Name: 'name', Value: name }),
        new CognitoUserAttribute({ Name: 'profile', Value: profile }),
        new CognitoUserAttribute({ Name: 'email', Value: email }),
        new CognitoUserAttribute({ Name: 'custom:security-question', Value: question }),
        new CognitoUserAttribute({ Name: 'custom:security-answer', Value: answer }),
        new CognitoUserAttribute({ Name: 'custom:ceaser-cypher', Value: word }),
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
    }
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
      window.alert("Signup confirmed! You can now log in.");
      navigate("/login");
    });
  };

  return (
    <div className="container">
      <div className="signup-box">
        <Typography variant="h4" className="signup-title">
          <strong>Sign Up</strong>
        </Typography>
        <TextField
          required
          id="outlined-required"
          label="Name"
          margin="normal"
          onChange={handleNameChange}
          error={nameError}
          helperText={nameError ? "Please enter a valid name" : ""}
          fullWidth
        />
        <TextField
          required
          id="outlined-required"
          label="Email"
          margin="normal"
          onChange={handleEmailChange}
          error={emailError}
          helperText={emailError ? "Invalid email address" : ""}
          fullWidth
        />
        <TextField
          required
          id="outlined-required"
          label="Password"
          type="password"
          margin="normal"
          onChange={handlePasswordChange}
          fullWidth
        />
        <TextField
          required
          id="outlined-required"
          label="Confirm Password"
          type="password"
          margin="normal"
          onChange={handleConfirmPasswordChange}
          fullWidth
        />
        <FormControl fullWidth sx={{ mt: 1 }}>
        <InputLabel id="demo-simple-select-label">Question *</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={question}
            label="Question *"
            onChange={handleQuestionChange}
            error={questionError}
            helperText={questionError ? "Select a question" : ""}
            fullWidth
          >
            <MenuItem value={"What is your father's middle name?"}>What is your father's middle name?</MenuItem>
            <MenuItem value={"What is the name of your first pet?"}>What is the name of your first pet?</MenuItem>
            <MenuItem value={"In what city were you born?"}>In what city were you born?</MenuItem>
            <MenuItem value={"What high school did you attend?"}>What high school did you attend?</MenuItem>
          </Select>
        </FormControl>
        <TextField
          required
          id="outlined-required"
          label="Answer"
          margin="normal"
          onChange={handleAnswerChange}
          error={answerError}
          helperText={answerError ? "Enter an answer" : ""}
          fullWidth
        />
        <TextField
          required
          id="outlined-required"
          label="Secret Word"
          margin="normal"
          onChange={handleWordChange}
          error={wordError}
          helperText={wordError ? "Enter a word" : ""}
          sx={{ mt: 1 }}
          fullWidth
        />
        <FormControl fullWidth>
          <FormLabel id="demo-row-radio-buttons-group-label">Role</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={handleProfileChange}
          >
            <FormControlLabel value="user" control={<Radio />} label="User" />
            <FormControlLabel value="property-agent" control={<Radio />} label="Property Agent" />
          </RadioGroup>
          <FormHelperText>{profileError ? "Select a profile": ""}</FormHelperText>
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
        <Link
          to="/login"
          className="login-link">
          Back to login
        </Link>
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
            id="name"
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
