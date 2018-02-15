const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const keys = require('./config/keys');

require('./models/User');

mongoose.connect(keys.mongoURI);

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 3090;

app.listen(PORT);
console.log('Server listening on:', PORT);
