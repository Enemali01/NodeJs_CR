import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import route from './routes/routes.js'
import {connectDB} from './db_connection/db_config.js'
connectDB();

const app = express();
const PORT = 5500 || process.env.PORT;

// Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
  secret: "my secret key",
  saveUninitialized: true,
  resave: false,
}));

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// set template engine
app.set('view engine', 'ejs');

// This will make the images  display on the webbpage after uploading it form the forms
app.use(express.static('uploads'));

// routes prefix
app.use('', route );

app.listen(PORT, () => {
  console.log(`Project is listening at 5500`)
});