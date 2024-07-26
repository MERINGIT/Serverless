import React, { useState } from 'react';
import Login from './Login';
import QuestionAuth from './QuestionAuth';
import CypherAuth from './CypherAuth';

import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AUTH_STAGES = {
  LOGIN: 'LOGIN',
  QUESTION_AUTH: 'QUESTION_AUTH',
  CAESAR_CIPHER_AUTH: 'CAESAR_CIPHER_AUTH',
  AUTHENTICATED: 'AUTHENTICATED'
};

const LoginFlow = ({toggleUpdated}) => {
  const [currentStage, setCurrentStage] = useState(AUTH_STAGES.LOGIN);
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  const determineNextStage = (result) => {
    switch (result.challengeParameters.type) {
      case 'QUESTION_AUTH':
        setResult(result);
        return AUTH_STAGES.QUESTION_AUTH;
      case 'CAESAR_CIPHER_AUTH':
        setResult(result);
        return AUTH_STAGES.CAESAR_CIPHER_AUTH;
      case 'AUTHENTICATED':
        Cookies.set('jwtToken', result.session);
        Cookies.set('user_id', result.userAttributes.sub);
        Cookies.set('email', result.userAttributes.email);
        Cookies.set('name', result.userAttributes.name);
        Cookies.set('profile', result.userAttributes.profile);

        axios.post("https://ewo9dzucpl.execute-api.us-east-1.amazonaws.com/test/signin", {
          "userEmail": result.userAttributes.email,
          "notificationType": "login"
        })

        navigate("/");
        break;
      default:
        return AUTH_STAGES.LOGIN;
    }
  };

  const handleLogin = (result) => {
    const nextStage = determineNextStage(result);
    setCurrentStage(nextStage);
  };

  return (
    <div>
      {currentStage === AUTH_STAGES.LOGIN && <Login onLogin={handleLogin} />}
      {currentStage === AUTH_STAGES.QUESTION_AUTH && <QuestionAuth onAnswer={handleLogin} result={result} />}
      {currentStage === AUTH_STAGES.CAESAR_CIPHER_AUTH && <CypherAuth onSolve={handleLogin} result={result} toggleUpdated={toggleUpdated} />}
    </div>
  );
};

export default LoginFlow;
