class HTTPMessages {}

HTTPMessages.Created = { code: 20100, message: 'Created!' };

HTTPMessages.BadRequest = { code: 40000, message: 'Bad Request!' };
HTTPMessages.Unauthorized = { code: 40100, message: 'Unauthorized!' };
HTTPMessages.NotFound = { code: 40400, message: 'Not found!' };
HTTPMessages.RoomNotFound = { code: 40401, message: 'Room not found!' };
HTTPMessages.UserNotFound = { code: 40402, message: 'User not found!' };

HTTPMessages.InternalServerError = { code: 50000, message: 'Internal Server Error!' };

module.exports = HTTPMessages;
