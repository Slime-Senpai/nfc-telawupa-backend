const express = require('express');
const Room = require('../bin/db/model/Room.js');
const router = express.Router();
const Scan = require('../bin/db/model/Scan.js');
const User = require('../bin/db/model/User.js');
const HTTPMessages = require('../bin/httpMessages.js');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const scans = await Scan.find()
    .populate('user', { name: 1 })
    .populate('room', { name: 1 })
    .lean()
    .exec();

  if (!scans || scans.length === 0) {
    return res.status(404).json(HTTPMessages.NotFound);
  }

  res.status(200).json(scans);
});

router.get('/:id', async function (req, res, next) {
  const scan = await Scan.findById(req.params.id)
    .populate('user', { name: 1 })
    .populate('room', { name: 1 })
    .lean()
    .exec();

  if (!scan) {
    return res.status(404).json(HTTPMessages.NotFound);
  }

  res.status(200).json(scan);
});

router.post('/add', async function (req, res, next) {
  if (!req.body.token || !req.body.cardId) {
    return res.status(400).json(HTTPMessages.BadRequest);
  }

  const user = await User.findOne({ token: req.body.token }).lean().exec();

  if (!user) {
    return res.status(404).json(HTTPMessages.UserNotFound);
  }

  const room = await Room.findOne({ cardId: req.body.cardId }).lean().exec();

  if (!room) {
    return res.status(404).json(HTTPMessages.RoomNotFound);
  }

  const scan = new Scan();

  scan.user = user;
  scan.room = room;
  scan.scannedAt = new Date();

  let lastScan = await Scan.findOne({ user: user })
    .sort({ scannedAt: -1 })
    .lean()
    .exec();

  // Is the last scan is an entry and we changed room, we forgot to scan the exit
  if (
    lastScan &&
    lastScan.isEntry &&
    lastScan.room &&
    lastScan.room._id !== room._id
  ) {
    const forgottenScan = new Scan();

    forgottenScan.user = user;
    forgottenScan.room = lastScan.room;
    forgottenScan.scannedAt = new Date();
    forgottenScan.isEntry = false;

    lastScan = await forgottenScan.save();
  }

  scan.isEntry = !lastScan || !lastScan.isEntry;

  const savedScan = await scan.save();

  if (!savedScan) {
    return res.status(500).json(HTTPMessages.InternalServerError);
  }

  res.status(201).json(HTTPMessages.Created);
});

module.exports = router;
