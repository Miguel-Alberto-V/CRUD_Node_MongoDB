const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const router = express.Router();
const saltRounds = 10; 

async function cifrarContraseña(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

router.get('/', async (req, res) => {
  const users = await User.find();
  res.render('index', { users });
});

router.post('/', async (req, res) => {
    console.log(req.body);
  const names = (req.body.name);
  const emails = (req.body.email);
  const password = (req.body.password);
  const hashedPassword = await cifrarContraseña(password);
  const data = new User({
    name: names,
    email: emails,
    password: hashedPassword
  })
  await data.save();
  res.redirect('/users');
    
  
  
});

router.get('/edit/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render('partials/edit', { user });
});

router.post('/update/:id', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/users');
});

router.get('/delete/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/users');
});

module.exports = router;
