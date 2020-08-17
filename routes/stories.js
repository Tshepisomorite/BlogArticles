const express = require('express')
const router = express.Router()
const { ensureGuest, ensureAuth } = require('../middleware/auth')
const { request } = require('express')
const Story = require('../models/story')
const story = require('../models/story')

//@desc Show add page
//@router GET / stories/add
//handling a get request
router.get('/add', ensureAuth, (req, res) => {
    res.render('Stories/add')
})

//@desc Process add form

//@router POST / stories
//handling a get request
router.post('/', ensureAuth, async (req, res) => {
try{
    req.body.user = req.user.id
await Story.create(req.body)
res.redirect('/dashboard')

}catch(err)
{
console.error(err)
res.render('error/500')
}

})

//@desc Show all stories

//@router GET / stories/add
router.get('/', ensureAuth, async (req, res) => {
    try{
        const stories = await Story.find({ status: 'public'})
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()

        res.render('stories/index', {
            stories,
        })

    }catch(err){
        console.error(err)
        res.render('error/500')
   } 
    
})
//@desc show single story
//@route GET /single/:id
router.get('/:id', ensureAuth, async(req, res) => {
  try{
    let story = await Story.findById(req.params.id)
    .populate('user')
    .lean()

    if(!story) {
      return res.render('error/404')
    }
    res.render('stories/show', {
      story
    })
  }catch (err) {
    console.error(err)
    res.render('error/404')

  }
})

    
    
    
//@router GET / stories/edit/id
//handling a get request
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {const story = await Story.findOne({
    _id: req.params.id
}).lean()

if(!story) {
    return res.render('error/404')
}

if(Story.user != req.id) {
    res.redirect('/stories')
} else {
    res.render('stories/edit', {
        story,
    })
}
}catch (err) {
  console.error(err)
  return res.render('error/500')
}
   
})

//@router GET / Update stories
//@route PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean()
  
      if (!story) {
        return res.render('error/404')
      }
  
      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })
  
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })
  
//@router Delete story
//@router Delete stories/:id

router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      await Story.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})
// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('stories/index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
    
  }
})


module.exports = router
