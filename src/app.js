const express = require('express');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth.route');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send('Welcome in the Social Media App');
});
app.use('/auth', authRoute);
module.exports = app;