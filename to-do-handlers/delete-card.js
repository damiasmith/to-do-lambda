const parameter = require('./parameter');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dynamoDb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamoDb.DocumentClient();

const handler = async (event) => {
    // if (event.httpMethod !=='DETETE') {
    //     throw new Error(`deleteCard only accepts 'DETETE' methods, you tried ${event.httpMethod}`);
    // }
    console.log('event: ' + JSON.stringify(event));

    const tableName = await parameter.getParameter('/to_do/table_name');

    const id = event.id;

    const params = {
        TableName: tableName,
        Key: { id }
    }

    try {
        const result = await docClient.delete(params).promise();

        let response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({'id': cardId})
        }
        return response;
    } catch (err) {
        console.log('deleteCard', err);
        throw new Error('card not deleted', err);
    }
}
module.exports = { handler };