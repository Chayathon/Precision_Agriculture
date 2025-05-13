const express = require('express');
const app = express();
const serverless = require('serverless-http');

app.get('/', (req, res) => {
  res.send('Hello from Express on Vercel!');
});

app.use('/api', require('./router/auth'));
app.use('/api', require('./router/address'));
app.use('/api', require('./router/user'));
app.use('/api', require('./router/admin'));
app.use('/api', require('./router/role'));
app.use('/api', require('./router/plant'));
app.use('/api', require('./router/plant_variable'));
app.use('/api', require('./router/factor_nutrient'));

module.exports.handler = serverless(app);