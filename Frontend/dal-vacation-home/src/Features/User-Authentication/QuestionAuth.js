import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { respondToAuthChallenge } from '../../utils/Auth'; // Adjust import if necessary

function QuestionAuth({ onAnswer, result }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (result.challengeParameters.flow === "PROCEDURE_2") {
      setQuestion(result.userAttributes['custom:security-question'])
    } else {
      if (result && result.challengeParameters) {
        setQuestion(result.challengeParameters.question);
      }
    }
  }, [result]);

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleVerifyAnswer = async () => {
    console.log(result);
    if (result.challengeParameters.flow === "PROCEDURE_2") {
      result.challengeParameters = { "type" : "CAESAR_CIPHER_AUTH", "flow" : "PROCEDURE_2" }
      onAnswer(result);
    } else {
      try {  
        const response = await respondToAuthChallenge(result.cognitoUser.username, result.cognitoUser.Session, answer);

        if (response.success) {
          onAnswer(response);
        } else if (response.challengeName) {
          onAnswer(response);
        } else {
          console.error('Unexpected response:', response);
        }
      } catch (err) {
        console.error('Error verifying answer:', err);
      }
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <Typography variant="h4" className="login-title">
          <strong>Answer Question</strong>
        </Typography>

        <Typography sx={{ mt: 5 }}>
          {question}
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

export default QuestionAuth;
