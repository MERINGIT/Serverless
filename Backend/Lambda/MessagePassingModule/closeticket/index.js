const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    if (event.httpMethod === 'OPTIONS') {
        console.log('Handling CORS preflight request');
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,PUT,GET,POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: 'CORS preflight response' }),
        };
    }

    try {
        const { enquiryid, comments, status, useremail, concern } = event;
        console.log(`Parsed body: enquiryid=${enquiryid}, comments=${comments}, status=${status}`);

        const params = {
            TableName: 'Enquiries',
            Key: { enquiryid },
            UpdateExpression: 'set #comments = :comments, #status = :status',
            ExpressionAttributeNames: {
                '#comments': 'comments',
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':comments': comments,
                ':status': status
            },
            ReturnValues: 'ALL_NEW'
        };

        console.log('Updating DynamoDB with params:', JSON.stringify(params, null, 2));
        const result = await dynamoDb.update(params).promise();
        console.log('Update successful:', JSON.stringify(result, null, 2));

        // Send email using Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'health.sync19@gmail.com',
                pass: 'lolhzlogakvdgtjb'
            }
        });

        const mailOptions = {
            from: 'health.sync19@gmail.com',
            to: useremail,
            subject: 'Ticket Resolved',
            text: `Hi, your Ticket ID: ${enquiryid} with concern: ${concern} has been resolved.\nComments: ${comments}`
        };

        console.log('Sending email with options:', JSON.stringify(mailOptions, null, 2));
        console.log('Before sending email');
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
        } catch (error) {
            console.error('Error sending email:', error);
        }
        
        console.log('After sending email');


        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,PUT,GET,POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: 'Ticket updated successfully', updatedAttributes: result.Attributes }),
        };
    } catch (error) {
        console.error('Error updating ticket:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,PUT,GET,POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: 'Failed to update ticket', error: error.message }),
        };
    }
};
