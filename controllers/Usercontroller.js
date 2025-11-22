const express = require('express');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { firstName, lastName, number, password, address ,role,email} = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }   

    const newUser = new User ({
      firstName,
      lastName,
      email,
      number,
      password,
      address,
      role
    });
    await newUser.save(); // yehh save krta h user ko database me await matlab wait karega ki user save ho jaye
    res.status(201).json({ message: 'User registered successfully' });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(404).json({ message: 'Invalid user or password' });
    }

    // console.log(user);

    // Determine redirect path based on role
    let redirectUrl = '';
    switch (user.role) {
      case 'owner':
        redirectUrl = 'owner_dash.html';
        break;
      case 'customer':
        redirectUrl = 'customer_dash.html';
        break;
      case 'admin':
        redirectUrl = 'admin_dash.html';
        break;
      default:
        return res.status(400).json({ message: 'Invalid user role' });
    }

    // Send final successful response
    return res.status(200).json({
      message: 'Login successful',
      role: user.role,
      redirectUrl,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
