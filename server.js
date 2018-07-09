const express = require('express');
const path = require('path');
const app = express();
const appPort = process.env.PORT || 3000;

app.use('/libs', express.static('bower_components'));
app.use(express.static('public'));

app.listen(process.env.PORT || 3000, () => {
    console.log(`The server is up and running on ${appPort} port.`);
});