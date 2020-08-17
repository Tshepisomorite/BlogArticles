const express = require('express')
const passport = require('passport')
const router = express.Router()

//@desc Auth with google

//@router GET / auth/google
//handling a get request
router.get('/google', passport.authenticate('google',
{
  scope: ['profile']  
}))


//@desc Google callback

//@router GET / auth/google/callback

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/dashboard')
})

//@desc Logout User
//@route /auth/google
router.get('/logout', (req,res) => {
    req.logOut()
    res.redirect('/')
})


module.exports = router


