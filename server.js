// server.js
//C:\Program Files\MongoDB\Server\3.0\bin
//C:\desarrollo\mashup\InsightApp
//
// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 5000;
var configDB = require('./config/database.js');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var mongojs  = require('mongojs');
var db 		 = mongojs('mongodb://admin:admin@ds057204.mongolab.com:57204/testinsight', ['jugadores','categorias'], {authMechanism: 'ScramSHA1'});
//var db 		 = mongojs('testinsight', ['jugadores','categorias'], {authMechanism: 'ScramSHA1'});

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');


// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.use(express.static(__dirname));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs'); // set up ejs for templating
app.set('view engine', 'html');
//app.set('views', __dirname + '/views');
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/jugadorRoute.js')(app,db,passport,mongojs);
require('./app/categoriasRoute.js')(app,db,passport,mongojs);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);