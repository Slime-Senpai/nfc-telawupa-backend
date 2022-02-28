const express = require('express');
const router = express.Router();
const User = require('../bin/db/model/User.js');
const verifySecret = require('../bin/guards/verifySecret.js');
const HTTPMessages = require('../bin/httpMessages.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Scan = require('../bin/db/model/Scan.js');

const saltRounds = 10;

const generateToken = () => {
  return crypto.randomBytes(48).toString('hex');
};

/* GET users listing. */
router.post('/', function (req, res, next) {
  if (!verifySecret(req.body.secret)) {
    return res.status(401).json(HTTPMessages.Unauthorized);
  }

  if (!req.body.name || !req.body.password) {
    return res.status(400).json(HTTPMessages.BadRequest);
  }

  try {
    const hashedPwd = bcrypt.hashSync(req.body.password, saltRounds);
    const user = new User();

    user.name = req.body.name;
    user.password = hashedPwd;
    user.token = generateToken();

    const savedUser = user.save();

    if (!savedUser) {
      return res.status(500).json(HTTPMessages.InternalServerError);
    }

    return res.status(201).json({ name: savedUser.name, token: savedUser.token, id: savedUser._id });
  } catch (err) {
    console.error(err);

    return res.status(500).json(HTTPMessages.InternalServerError);
  }
});

router.get('/:id', async function (req, res, next) {
  const user = await User.findById(req.params.id).lean().exec();

  const answer = {
    name: user.name
  };

  res.status(200).json(answer);
});

router.post('/login', async function (req, res, next) {
  if (!req.body.name || !req.body.password) {
    return res.status(400).json(HTTPMessages.BadRequest);
  }

  const user = await User.findOne({ name: req.body.name }).lean().exec();

  if (!user) {
    return res.status(400).json(HTTPMessages.BadRequest);
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(400).json(HTTPMessages.BadRequest);
  }

  res.status(200).json({ name: user.name, token: user.token, id: user._id });
});

router.get('/user/:token/scans', async function (req, res, next) {
  if (!req.params.token) {
    return res.status(400).json(HTTPMessages.BadRequest);
  }

  const user = await User.findOne({ token: req.params.token }).lean().exec();

  if (!user) {
    return res.status(400).json(HTTPMessages.BadRequest);
  }

  const scans = await Scan.find({ user: user }).populate('user').populate('room').lean().exec();

  if (!scans || scans.length === 0) {
    return res.status(400).json(HTTPMessages.BadRequest);
  }

  return res.status(200).json(scans);
});

module.exports = router;
