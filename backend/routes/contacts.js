const express = require('express');
const jwt = require('jsonwebtoken');
const Contact = require('../models/Contact');
const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Token ausente');
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Token inválido');
    req.userId = decoded.id;
    next();
  });
}

router.get('/', auth, async (req, res) => {
  const contacts = await Contact.find({ ownerId: req.userId });
  res.json(contacts);
});

router.post('/', auth, async (req, res) => {
  const { name, phone, tags } = req.body;
  const newContact = new Contact({ name, phone, tags, ownerId: req.userId });
  await newContact.save();
  res.status(201).json(newContact);
});

module.exports = router;
