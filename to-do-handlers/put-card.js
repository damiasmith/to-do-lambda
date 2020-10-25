const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dynamoDb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamoDb.DocumentClient();
require('dotenv').config({path: './to-do-lambda/to-do-handlers/.env'})
const {'v4': uuidv4} = require('uuid')

const handler = async (event) => {
    if (event.httpMethod !=='POST') {
        throw new Error(`putCard only accepts POST methods, you tried ${event.httpMethod}`);
    }
    console.log('event: ' + JSON.stringify(event));

    const body = JSON.parse(event.body);
    const cardId = uuidv4;
    const title = body.title;

    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            id: cardId,
            Title: title
        }
    }

    try {
        const result = await docClient.put(params).promise();

        let response = {
            statusCode: 200,
            body: JSON.stringify(cards)
        }
        return response;
    } catch (err) {
        console.log('putList', err);
        throw new Error(err);
    }
}
module.exports = { handler };