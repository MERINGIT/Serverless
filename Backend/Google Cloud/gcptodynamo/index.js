const axios = require('axios');

exports.processPubSubMessage = async (event, context) => {
 const eventData = JSON.parse(Buffer.from(event.data, 'base64').toString('utf-8'));
  console.log("hi",eventData);
  const userId = eventData.message.userId;
  const bookingReference = eventData.message.bookingReference;
  const concern = eventData.message.concern;

  // AWS API Gateway endpoint URL
  //const apiGatewayUrl = 'api-url'; // Replace with your AWS API Gateway endpoint URL

  // Payload to send to AWS API Gateway
  const payload = {
    userId: userId,
    bookingReference: bookingReference,
    concern: concern
    // Add any other parameters needed by Lambda
  };
  console.log("hi",payload)

  try {
    const response = await axios.post(apiGatewayUrl, { data: payload } );
    console.log('Response from Lambda via API Gateway:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error calling Lambda via API Gateway:', error);
    throw new Error('Error calling Lambda via API Gateway');
  }
};