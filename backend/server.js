const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
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

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

module.exports = app;