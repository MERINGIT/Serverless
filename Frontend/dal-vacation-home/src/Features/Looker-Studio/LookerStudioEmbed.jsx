import React from 'react';
import './LookerStudioEmbed.css'; // Import your CSS file for styling

const LookerStudioEmbed = () => {
  return (
    <div className="looker-studio-embed">
      <iframe
        title="Looker Studio Embed"
        src="https://lookerstudio.google.com/embed/reporting/ba92c67b-72c7-436c-a012-cebb53826a91/page/CBV4D"
        frameBorder="0"
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      ></iframe>
    </div>
  );
};

export default LookerStudioEmbed;
