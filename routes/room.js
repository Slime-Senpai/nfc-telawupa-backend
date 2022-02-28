const express = require('express');
const router = express.Router();
const Room = require('../bin/db/model/Room.js');
const HTTPMessages = require('../bin/httpMessages.js');
const verifySecret = require('../bin/guards/verifySecret.js');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const rooms = await Room.find().lean().exec();

  res.status(200).json(rooms);
});

router.post('/', function (req, res, next) {
  if (!verifySecret(req.body.token)) {
    return res.status(401).json(HTTPMessages.Unauthorized);
  }

  if (!req.body.name || !req.body.cardId) {
    return res.status(400).json(HTTPMessages.BadRequest);
  }

  const room = new Room();

  room.name = req.body.name;
  room.cardId = req.body.cardId;

  const savedRoom = room.save();

  if (!savedRoom) {
    return res.status(500).json(HTTPMessages.InternalServerError);
  }

  res.status(201).json(HTTPMessages.Created);
});

router.get('/:id', async function (req, res, next) {
  const room = await Room.findById(req.params.id).lean().exec();

  res.status(200).json(room);
});

module.exports = router;
