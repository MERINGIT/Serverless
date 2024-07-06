const AWS = require('aws-sdk');
const axios = require('axios');

// Initialize DynamoDB
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' }); // Ensure the region is correct

// Your Google Cloud API key
const API_KEY = 'AIzaSyAmOXlO5oxY5TvHoctOYzLRtyHilw0IyO0'; // Replace with your API key

// Function to analyze sentiment
const analyzeSentiment = async (text) => {
  const request = {
    document: {
      type: 'PLAIN_TEXT',
      content: text
    },
    encodingType: 'UTF8'
  };

  try {
    console.log('Analyzing sentiment for text:', text);
    const response = await axios.post(
      `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${API_KEY}`,
      request
    );
    const sentiment = response.data.documentSentiment;
    const sentimentType = sentiment.score > 0 ? 'positive' : sentiment.score < 0 ? 'negative' : 'neutral';
    console.log('Sentiment analysis result:', sentiment);

    return { score: sentiment.score, type: sentimentType };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw new Error('Sentiment analysis failed');
  }
};

// Function to create a review
const createReview = async (event) => {
  const { reviewid, comment, rating, userid, roomid,username } = event.body;
  console.log('Creating review with data:', { reviewid, comment, rating, userid, roomid });
  const { score, type } = await analyzeSentiment(comment);
  console.log(score);
  console.log(type);

  const params = {
    TableName: 'reviewtable', // Verify the table name is correct
    Item: {
      reviewid,
      comment,
      rating,
      userid,
      username,
      roomid,
      score,
      sentimenttype: type,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    console.log('Review created successfully:', params.Item);
    return { message: 'Review created successfully' };
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Error creating review');
  }
};

// Function to edit a review
const editReview = async (event) => {
  const { reviewid, comment, rating } = event.body;
  console.log('Editing review with data:', { reviewid, comment, rating });
  const { score, type } = await analyzeSentiment(comment);

  const params = {
    TableName: 'reviewtable', // Verify the table name is correct
    Key: { reviewid },
    UpdateExpression: 'set #c = :c, rating = :r, score = :s, sentimenttype = :st',
    ExpressionAttributeNames: {
      '#c': 'comment',
    },
    ExpressionAttributeValues: {
      ':c': comment,
      ':r': rating,
      ':s': score,
      ':st': type,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    const result = await dynamoDb.update(params).promise();
    console.log('Review edited successfully:', result.Attributes);
    return { message: 'Review edited successfully', updatedAttributes: result.Attributes };
  } catch (error) {
    console.error('Error editing review:', error);
    throw new Error('Error editing review');
  }
};

// Function to delete a review
const deleteReview = async (event) => {
  const { reviewid } = event.body;
  console.log('Deleting review with id:', reviewid);

  const params = {
    TableName: 'reviewtable', // Verify the table name is correct
    Key: { reviewid },
  };

  try {
    await dynamoDb.delete(params).promise();
    console.log('Review deleted successfully:', reviewid);
    return { message: 'Review deleted successfully' };
  } catch (error) {
    console.error('Error deleting review:', error);
    throw new Error('Error deleting review');
  }
};

// Function to get all reviews
const getAllReviews = async () => {
  const params = {
    TableName: 'reviewtable', // Verify the table name is correct
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    console.log('Retrieved all reviews successfully:', result.Items);
    return { reviews: result.Items };
  } catch (error) {
    console.error('Error retrieving reviews:', error);
    throw new Error('Error retrieving reviews');
  }
};

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': true,
  };

  try {
    let result;
    switch (event.httpMethod.toLowerCase()) {
      case 'post':
        result = await createReview(event);
        break;
      case 'put':
        result = await editReview(event);
        break;
      case 'delete':
        result = await deleteReview(event);
        break;
      case 'get':
        result = await getAllReviews();
        break;
      case 'options':
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'CORS preflight request successful' }),
        };
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid operation' }),
        };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
