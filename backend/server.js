const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use('/api', require('./router/auth'));
app.use('/api', require('./router/address'));
app.use('/api', require('./router/user'));
app.use('/api', require('./router/admin'));
app.use('/api', require('./router/role'));
app.use('/api', require('./router/plant'));
app.use('/api', require('./router/plant_variable'));
app.use('/api', require('./router/factor_nutrient'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;