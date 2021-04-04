'use strict'

const config = require('config') // To access default.json file
const CONTROLLER_CONS = 'FUS_UC_' // Help to debug in which controller we got error
const Users = require('../model/users') // User model to process DB operation

const addUserDetail = async (req, res) => {
  try {
    if (req.file) { // Check if there is any file in request
      req.body.profile_image = req.file.filename // add file name in body so we can save it in our DB
    }
    const userDetails = await Users.create(req.body) // Save Data in DB
    userDetails.profile_image = `${config.protocol}://${config.host}:${config.port}/public/img/user/${userDetails.profile_image}` // Prepare URL for our image, so we can render it at UI or access it.
    // URL will be i.e. http://127.0.0.1:9000/public/img/user/user-125415484451.jpeg which we can access direct in browser
    res.status(201).json({ // Prepare final response
      data: userDetails,
      status_code: CONTROLLER_CONS + 201,
      status_message: 'User added successfully.',
      errors: null
    })
  } catch (error) {
    // In case of any error
    console.error('Error while adding users details: %s %j', error, error)
    res.status(500).json({
      data: null,
      status_code: CONTROLLER_CONS + 500,
      status_message: 'Server error',
      errors: error
    })
  }
}

module.exports = {
  addUserDetail
}
