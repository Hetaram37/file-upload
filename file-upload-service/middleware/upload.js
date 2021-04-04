'use strict'

const multer = require('multer') // get multer module
const sharp = require('sharp') // Get sharp module
const AppError = require('./../utils/appError')

const multerStorage = multer.memoryStorage() // Storing file/image in memory

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) { // check if file is a image
    cb(null, true) // return callback if it is an image
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false) // throw error if it is not an image
  }
}

const uploadFiles = multer({
  storage: multerStorage, // get file from memory
  fileFilter: multerFilter
})

const resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next() // If there is no file then return to next middleware
  req.file.filename = `user-${new Date().getTime()}.jpeg` // rename file to make sure unique name

  await sharp(req.file.buffer) // use sharp module to process image for reducing size
    .resize(500, 500) // Fix size of all images of users
    .toFormat('jpeg')
    .jpeg({
      quality: 90 // This will insure the quality of image, will suggest to not reduce much
    })
    .toFile(`public/img/user/${req.file.filename}`) // Location where we want it to store in our project

  next() // Go to next middleware
}

module.exports = {
  uploadFiles,
  resizeUserPhoto
}
