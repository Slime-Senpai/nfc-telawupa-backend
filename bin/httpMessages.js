class HTTPMessages {}

HTTPMessages.Created = { code: 20100, val: 'Created!' };

HTTPMessages.BadRequest = { code: 40000, val: 'Bad Request!' };
HTTPMessages.Unauthorized = { code: 40100, val: 'Unauthorized!' };
HTTPMessages.NotFound = { code: 40400, val: 'Not found!' };
HTTPMessages.RoomNotFound = { code: 40401, val: 'Room not found!' };
HTTPMessages.UserNotFound = { code: 40402, val: 'User not found!' };

HTTPMessages.InternalServerError = { code: 50000, val: 'Internal Server Error!' };

module.exports = HTTPMessages;
