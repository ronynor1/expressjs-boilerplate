const express = require("express");
const cors = require("cors");
const multer = require('multer');
const upload = multer();
const errorHandler = require('./src/middlewares/error-handler')

const app = express();

let corsOptions = {
    origin: ['http://localhost:8081', 'http://yourapp.com']
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Content-Type", "application/json");
    res.header("X-Content-Type-Options", "nosniff");
    res.header("Strict-Transport-Security", "max-age=31536000");
    res.header("Cache-Control", "no-store, no-cache, must-revalidate");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Express home"});
});

// Add routes
require("./src/app/unauthorized/unauthorized.routes.js")(app);
require("./src/app/tags/tags.routes.js")(app);
require("./src/app/users/users.routes.js")(app);
require("./src/portal/unauthorized/unauthorized.routes.js")(app);
require("./src/portal/tags/tags.routes.js")(app);
require("./src/portal/categories/categories.routes.js")(app);
require("./src/portal/artists/artists.routes.js")(app);
require("./src/portal/media/media.routes.js")(app);

require('dotenv').config();

// for catching errors
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
  