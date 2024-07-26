import React from 'react';
import './LookerStudioEmbed.css'; // Import your CSS file for styling

const LookerStudioEmbed = () => {
  return (
    <div className="looker-studio-embed">
      <iframe
        title="Looker Studio Embed"
        src="https://lookerstudio.google.com/embed/reporting/23be2032-cf22-4f84-9966-4f730362e97a/page/wAb6D"
        frameBorder="0"
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      ></iframe>
    </div>
  );
};

export default LookerStudioEmbed;
