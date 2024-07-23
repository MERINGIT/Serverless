const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const BUCKET_NAME = 's3bucketmerin1';//bucket name

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2)); // Log the received event

    try {
        const val=JSON.parse(event.body);
        const base64String = val.image; // base64 encoded image
        console.log('Base64 image string received.');

        const buffer = Buffer.from(base64String, 'base64');
        console.log('Buffer created from base64 string.');

        const fileName = `${Date.now()}.jpg`;
        console.log('Generated file name:', fileName);

        const params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
        };

        console.log('Uploading image to S3 with params:', JSON.stringify(params, null, 2));
        await s3.putObject(params).promise();
        console.log('Image successfully uploaded to S3.');

        const s3Url = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
        console.log('Generated S3 URL:', s3Url);

        return {
            statusCode: 200,
            body: JSON.stringify({ s3_url: s3Url }),
            headers: {//all cors headers
                'Access-Control-Allow-Origin': '*', 
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST', 
                'Access-Control-Allow-Credentials': true,
            }
        };
    } catch (error) {
        console.error('Error uploading image to S3:', error); 

        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
            headers: {//all cors headers
                'Access-Control-Allow-Origin': '*', 
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST', 
                'Access-Control-Allow-Credentials': true,
            }
        };
    }
};
