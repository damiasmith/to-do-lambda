const parameter = require('./parameter');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dynamoDb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamoDb.DocumentClient();

const handler = async (event) => {
    // if (event.httpMethod !=='POST') {
    //     throw new Error(`putCard only accepts POST methods, you tried ${event.httpMethod}`);
    // }
    console.log('event: ' + JSON.stringify(event));

    const tableName = await parameter.getParameter('/to_do/table_name');

    const cardId = Math.random().toString().substring(2, 15) + Math.random().toString().substring(2, 15);
    const title = event.title;

    const params = {
        TableName: tableName,
        Item: {
            id: cardId,
            Title: title
        }
    }

    try {
        const result = await docClient.put(params).promise();

        let response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({'Title': title, 'id': cardId})
        }
        return response;
    } catch (err) {
        console.log('putList', err);
        throw new Error(err);
    }
}
module.exports = { handler };