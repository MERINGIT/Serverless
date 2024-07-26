import React, {useEffect} from "react";

export default function Chatbot() {
  useEffect(() => {
    // Load the chatbot script
    const script = document.createElement('script');
    script.src = 'https://d3mhw9852f278w.cloudfront.net/lex-web-ui-loader.min.js';
    script.async = true;

    script.onload = () => {
      // Initialize the chatbot once the script is loaded
      const loaderOpts = {
        baseUrl: 'https://d3mhw9852f278w.cloudfront.net/',
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