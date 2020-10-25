const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dynamoDb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamoDb.DocumentClient();
require('dotenv').config({path: './to-do-lambda/to-do-handlers/.env'})

const handler = async (event) => {
    if (event.httpMethod !=='GET') {
        throw new Error(`getAllCards only accepts GET methods, you tried ${event.httpMethod}`);
    }
    console.log('event: ' + JSON.stringify(event));

    const tableName = process.env.TABLE_NAME;

    try {
        const data = await docClient.scan(tableName).promise();
        const cards = data.Items;
        console.log(cards);
        let response = {
            statusCode: 200,
            body: JSON.stringify(cards)
        }
        return response;
    } catch (err) {
        console.log('getAllCards', err);
        throw new Error(err);
    }
}
module.exports = { handler };

