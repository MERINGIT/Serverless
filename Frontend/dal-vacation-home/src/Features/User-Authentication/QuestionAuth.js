import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

function QuestionAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const userAttributes = location.state?.userAttributes || {};
  const sessionDetails = location.state?.sessionDetails || {};
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    setQuestion(userAttributes['custom:security-question']);
  }, [userAttributes]);

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleVerifyAnswer = async () => {
    if (answer === userAttributes['custom:security-answer']) {
      console.log("Verified");
      navigate('/cypher-auth', { state: {
        userAttributes: userAttributes,
        sessionDetails: sessionDetails
      } });
    } else {
      console.log("Incorrect answer");
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
