const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScanSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  scannedAt: {
    type: Date,
    required: true
  },
  isEntry: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('Scan', ScanSchema);
