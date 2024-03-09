const express = require('express');
const sequelize = require('./config/database');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet')
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const fs = require('fs');

const userRoute =  require('./routes/userRoute')
const expenseRoute = require('./routes/expenseRoute');
const paymentRoute = require('./routes/paymentRoute');
const premiumRoute = require('./routes/premiumFeature');
const passwordRoute = require('./routes/forgotRoute');

const User = require('./models/userModel');
const Expense = require('./models/expenseModel');
const Order = require('./models/orderModel');
const ForgotPasswordRequests = require('./models/passwordModel');

const accessLogStream = fs.createWriteStream(
    path.join(__dirname , 'aceess.log'),
    {flags : 'a'}
);

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "view")));
app.use(helmet());
app.use(compression());

app.use(morgan('combine' , {stream : accessLogStream}) )

app.use('/user' , userRoute);
app.use('/expense' , expenseRoute);
app.use('/payment' , paymentRoute);
app.use('/premium' , premiumRoute);
app.use('/password' , passwordRoute);


//relations

  User.hasMany(Expense); 
  Expense.belongsTo(User);

  User.hasMany(Order); 
  Order.belongsTo(User);

  User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);



// Sync database
sequelize.sync({force : false})
.then(() => {
    console.log('DB synced');
})
.catch(err => {
    console.error('Error syncing  database: ', err);
});

app.listen(process.env.PORT || 5000 , ()=>{
    console.log('working on 5000.........');
})
