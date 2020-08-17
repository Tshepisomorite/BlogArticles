const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const { request } = require('express')
const Story = require('../models/story')

//@desc Login/Landing page

//@router GET / 
//handling a get request
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
      })
})

//@desc Dashboard

//@router GET / dashboard

router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
      const stories = await Story.find({ user: req.user.id }).lean()
      res.render('dashboard', {
        name: req.user.firstName,
        stories
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })

module.exports = router
