const users = {};

// respond with JSON: take request, response, status code, and obj to send
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  // Headers contain our metadata. Here
  // see format of data and how big data
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  };

  const responseData = JSON.stringify(content);

  // send response with json object
  response.writeHead(status, headers);

  // get metadata back
  if (request.method !== 'HEAD') {
    response.write(responseData);
  }

  response.end();
};

// send status
const respondMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// /getUsers: GET retrieves 200 success with results
// /getUsers: HEAD retrieves 200 success without results
const getUsers = (request, response) => {
  const responseJSON = { users };

  if (request.method === 'HEAD') {
    return respondMeta(request, response, 200);
  }

  return respondJSON(request, response, 200, responseJSON);
};

// /notReal: GET retrieves 404 not found with error message
// /notReal: HEAD retrieves 404 not found without error message
const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  if (request.method === 'HEAD') {
    return respondMeta(request, response, 404);
  }
  return respondJSON(request, response, 404, responseJSON);
};

// other pages with 404
const notFound = (request, response) => {
  const statusResponse = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, statusResponse);
};

// /addUser: Should return a
// 201 status code when adding a new user,
// 204 when updating the age of an existing user
// 400 if the request is missing a name, age, or both
const addUser = (request, response) => {
  // default json message
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  const { name, age } = request.body;

  if (!name || !age) {
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 204 updated
  let responseCode = 204;

  // If the user doesn't exist yet
  if (!users[name]) {
    // Set the status code to 201 (created) and create an empty user
    responseCode = 201;
    users[name] = {
      name,
    };
  }

  users[name].age = age;

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSON(request, response, responseCode, {});
};

module.exports = {
  getUsers,
  notReal,
  addUser,
  notFound,
};
