'use strict'

const route = require('express').Router()
const { addUserDetail } = require('../controllers/user.controller') // Call controller
const { uploadFiles, resizeUserPhoto } = require('../middleware/upload') // call those two middleware which we have created initially

// Here uploadFiles.single() will allow only one file/image
// if we want multiple files/images then we need to write it as
// uploadFiles.array('profileImage', 4), 4 is maximum allowed files
// if we will add 5 files it will accept first 4 only

// resizeUserPhoto is a middleware to reduce the size of image
route.post('/v1', uploadFiles.single('profileImage'), resizeUserPhoto, addUserDetail)

module.exports = route
