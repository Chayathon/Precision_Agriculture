const express = require('express');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

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

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

module.exports = app;