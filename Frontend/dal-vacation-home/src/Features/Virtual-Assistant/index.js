import React, {useEffect} from "react";
import { useLocation } from "react-router-dom";

export default function Chatbot() {
  const location = useLocation();
  useEffect(() => {
    if(location.pathname === '/login' || location.pathname ==="/signup"){
      return 0;
    }
    // Load the chatbot script
    const script = document.createElement('script');
    script.src = 'https://d37ivrc17jbha3.cloudfront.net/lex-web-ui-loader.min.js';
    script.async = true;

    script.onload = () => {
      // Initialize the chatbot once the script is loaded
      const loaderOpts = {
        baseUrl: 'https://d37ivrc17jbha3.cloudfront.net/',
        shouldLoadMinDeps: true
      };
      const loader = new window.ChatBotUiLoader.IframeLoader(loaderOpts);
      loader.load().catch((error) => {
        console.error(error);
      });
    };

    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return <div id="chatbot-container"></div>;
}