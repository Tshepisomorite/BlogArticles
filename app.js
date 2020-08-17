const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

const session = require('express-session')
const methodOverride = require('method-override')
const dotenv = require('dotenv')
const morgan = require('morgan')
const MongoStore = require('connect-mongo')(session)
const exphbs = require('express-handlebars')


const connectDB = require('./config/db')

//load config
dotenv.config({ path: './config/config.env' })

connectDB()

//passport config
require('./config/passport')(passport)


const app = express()

//Body Parser
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

//Logging
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'))
}

//Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs')

//setting up handlebars template engine
app.engine('.hbs',exphbs({ helpers: {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
}, defaultLayout: 'main',
    extname: '.hbs', })) 
app.set('view engine', '.hbs')



//sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
}),

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/Stories', require('./routes/stories'))




const PORT = process.env.PORT || 3000

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  )