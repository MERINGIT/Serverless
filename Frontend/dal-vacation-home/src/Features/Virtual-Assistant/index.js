import React, {useEffect} from "react";

export default function Chatbot() {
  useEffect(() => {
    // Load the chatbot script
    const script = document.createElement('script');
    script.src = 'https://d2o8u5389xszhj.cloudfront.net/lex-web-ui-loader.min.js';
    script.async = true;

    script.onload = () => {
      // Initialize the chatbot once the script is loaded
      const loaderOpts = {
        baseUrl: 'https://d2o8u5389xszhj.cloudfront.net/',
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