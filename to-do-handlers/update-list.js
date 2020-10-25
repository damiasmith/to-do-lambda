const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dynamoDb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamoDb.DocumentClient();
require('dotenv').config({path: './to-do-lambda/to-do-handlers/.env'})

const handler = async (event) => {
    if (event.httpMethod !=='POST') {
        throw new Error(`updateList only accepts POST methods, you tried ${event.httpMethod}`);
    }
    console.log('event: ' + JSON.stringify(event));

    const body = JSON.parse(event.body);
    const list_id = body.list_id;
    const id = body.id;

    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {id}
    }

    try {
        const data = await docClient.get(params).promise();
        let card = data.Item;
        console.log(card);
        let lists = card.lists;

        for (let i = 0; i <lists.length; i++){
            if (lists[i].list_id === list_id) {
                let completed = list[i].completed;
                console.log(completed);
                if (completed === false) {
                    completed = true
                } else completed = false
                cards.list[i].completed = completed
                console.log('card: ', card)
            }
        }

        const cardParams = {
            TableName: process.env.TABLE_NAME,
            Key: {id},
            Item: card
        }

        const update = await docClient.put(cardParams).promise();

        let response = {
            statusCode: 200,
            body: JSON.stringify(cards)
        }
        return response;
    } catch (err) {
        console.log('updateList', err);
        throw new Error(err);
    }
}
module.exports = { handler };
