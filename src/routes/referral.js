const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { sendEmail } = require('../utils/gmailService');

const prisma = new PrismaClient();
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, refereeName, refereeEmail } = req.body;

  if (!name || !email || !refereeName || !refereeEmail) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const referral = await prisma.referral.create({
      data: { name, email, refereeName, refereeEmail },
    });

    const subject = 'Referral Program';
    const text = `Hello ${refereeName},\n\n${name} has referred you to our program.`;

    await sendEmail(refereeEmail, subject, text);

    res.status(200).json({ message: 'Referral submitted and email sent', referral });
  } catch (error) {
    res.status(500).json({ error: 'Error saving referral' });
  }
});

module.exports = router;
