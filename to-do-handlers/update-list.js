const parameter = require('./parameter');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dynamoDb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamoDb.DocumentClient();

const handler = async (event) => {
    // if (event.httpMethod !=='POST') {
    //     throw new Error(`updateList only accepts POST methods, you tried ${event.httpMethod}`);
    // }
    console.log('event: ' + JSON.stringify(event));

    const tableName = await parameter.getParameter('/to_do/table_name');

    const list_id = event.list_id;
    const id = event.id;

    const params = {
        TableName: tableName,
        Key: { id }
    }

    try {
        const data = await docClient.get(params).promise();
        console.log(data);
        let card = data.Item;
        let lists = card.lists;

        let newLists = []

        await lists.forEach(list => {
            if (list.list_id === list_id) {
                let completed = list.completed;
                if (completed === false) completed = true
                else completed = false
                list.completed = completed
                newLists.push(list);
            }
        })

        card.lists = newLists

        const cardParams = {
            TableName: tableName,
            Key: { id },
            Item: card
        }

        const update = await docClient.put(cardParams).promise();

        let response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(card)
        }
        return response;
    } catch (err) {
        console.log('updateList', err);
        throw new Error('list not updated', err);
    }
}
module.exports = { handler };
