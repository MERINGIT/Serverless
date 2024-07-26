import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';

function CypherAuth({ onSolve, result, toggleUpdated }) {
  const [actualAnswer, setActualAnswer] = useState("");
  const [answer, setAnswer] = useState("");
  const [cipher, setCipher] = useState("");

  const caesarCipher = (str) => {
    const shift = Math.floor(Math.random() * 25) + 1;
    const lowerCaseStr = str?.toLowerCase();
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let newStr = '';
  
    for (let i = 0; i < lowerCaseStr?.length; i++) {
      const currentLetter = lowerCaseStr[i];
      
      if (alphabet?.indexOf(currentLetter) === -1) {
        newStr += currentLetter;
        continue;
      }
  
      let currentIndex = alphabet.indexOf(currentLetter);
      let newIndex = currentIndex + shift;
  
      if (newIndex > 25) newIndex = newIndex - 26;
      if (newIndex < 0) newIndex = newIndex + 26;
  
      if (str[i] === str[i].toUpperCase()) {
        newStr += alphabet[newIndex].toUpperCase();
      } else {
        newStr += alphabet[newIndex];
      }
    }

    setCipher(newStr);
  }

  useEffect(() => {
    setActualAnswer(result.userAttributes["custom:caesar-cypher"]);
    caesarCipher(actualAnswer)
  }, [result, actualAnswer]);

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleVerifyAnswer = async () => {
    if (answer === actualAnswer) {
      result.challengeParameters = { "type" : "AUTHENTICATED", "flow" : "PROCEDURE_2" }
      toggleUpdated();
      onSolve(result)
    } else {
      console.log("Incorrect answer");
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <Typography variant="h4" className="login-title">
          <strong>Decrypt Cipher</strong>
        </Typography>

        <Typography sx={{ mt: 5 }}>
          {cipher}
        </Typography>

        <TextField
          required
          id="outlined-required"
          label="Answer"
          margin="normal"
          onChange={handleAnswerChange}
          fullWidth
        />

        <Button
          variant="contained"
          color="primary"
          size="large"
          className="login-button"
          onClick={handleVerifyAnswer}
          sx={{ mt: 3 }}
        >
          Submit Answer
        </Button>
      </div>
    </div>
  );
}

export default CypherAuth;
