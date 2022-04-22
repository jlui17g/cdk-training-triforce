const AWS = require('aws-sdk');

exports.main = async (event, context) => {
  // const method = event.httpMethod;

  // if (method === "GET") {
  console.log('hello world !');
  const body = {message: 'hello world !'};
  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(body)
  }
}

  // const body = {message: 'not a get request'};
  // return {
  //   statusCode: 200,
  //   headers: {},
  //   body: JSON.stringify(body)
  // }
// }
