const parameter = require('./parameter');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dynamoDb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamoDb.DocumentClient();

const handler = async (event) => {
    // if (event.httpMethod !=='GET') {
    //     throw new Error(`getAllCards only accepts GET methods, you tried ${event.httpMethod}`);
    // }
    console.log('event: ' + JSON.stringify(event));

    const tableName = await parameter.getParameter('/to_do/table_name')

    const params = {
        TableName: tableName
    }

    try {
        const data = await docClient.scan(params).promise();
        const cards = data.Items;

        let response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(cards)
        }
        return response;
    } catch (err) {
        console.log('getAllCards', err);
        throw new Error(err);
    }
}
module.exports = { handler };

