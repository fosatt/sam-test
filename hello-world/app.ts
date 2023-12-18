import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import fs from 'fs';
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
type eventBody = {
    first_name: string,
    last_name: string,
    revDate: string,
    elementString:string
}



export const lambdaHandler = async (event: eventBody): Promise<APIGatewayProxyResult> => {

    const first_name: string = event.first_name;
    const last_name: string = event.last_name;
    const revDate: string = event.revDate;
    var date = new Date();
    var dateString = date.toISOString().split('T')[0];

    try {
        const fileName = '.events/event.json';
        var file_content = fs.readFileSync(fileName);
        var content  = JSON.parse(file_content);
        content.revDate=dateString;
        var elements = content.elementString.split(" ");
        const randomNumber = Math.floor((Math.random() *elements.length)+1);

        fs.writeFile(fileName, JSON.stringify(content), function writeJSON(err) {
            if (err) return console.log(err);
            console.log(JSON.stringify(content));
            console.log('writing to ' + fileName);
        });
        return {
            statusCode: 200,
            body: JSON.stringify({
               message: `hello ${first_name} ${last_name}, your last revisit date is ${revDate}\n\n The Element for today is: ${elements[randomNumber]}`,
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
