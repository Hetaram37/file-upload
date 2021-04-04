const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  profile_image: {
    type: String
  },
  created_by: {
    type: String,
    default: 'SYSTEM'
  },
  updated_by: {
    type: String,
    default: 'SYSTEM'
  }
}, {
  timestamps: {
    createdAt: 'created_on',
    updatedAt: 'updated_on'
  },
  collection: 'users'
})

module.exports = mongoose.model('users', userSchema)
