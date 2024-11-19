import sgMail from '@sendgrid/mail';
import express from 'express';
import cron from 'node-cron';

import { env } from '../config/env.js';
import { User } from '../models/user.model.js';

const { SG_API_KEY } = env;
sgMail.setApiKey(SG_API_KEY);

const sendemailRouter = express.Router();
const scheduledTasks = {};
const weeklyScheduledTasks = {};
const monthlyScheduledTasks = {};
const promotionScheduledTasks = {};

sendemailRouter.post('/confirmation', async (req, res) => {
  const { to, subject, text, html } = req.body;
  const msg = {
    to,
    from: {
      name: 'Polyglot',
      email: 'emmaemma0768@gmail.com',
    },
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send({ message: 'Email sent successfully!' });
  } catch (error) {
    console.log('Error sending email:', error);
    res.status(500).send({ error: error.message });
  }
});

sendemailRouter.post('/schedule-daily', (req, res) => {
  const { email } = req.body;

  if (scheduledTasks[email]) {
    return res
      .status(400)
      .send({ message: 'Daily reminder already scheduled.' });
  }

  const task = cron.schedule('*/2 * * * *', () => {
    User.findOne({ email: 'user3@example.com' })
      .then(async (user) => {
        const msg = {
          to: email,
          from: {
            name: 'Polyglot',
            email: 'emmaemma0768@gmail.com',
          },
          subject: 'Daily Reminder',
          text: 'This is your daily reminder:' + user.name,
          html: `<p>This is your daily reminder: ${user.name}</p>`,
        };

        try {
          await sgMail.send(msg);
          console.log('Daily reminder sent to:', email);
        } catch (error) {
          console.log('Error sending daily reminder:', error);
        }
      })
      .catch((error) => {
        console.log('Error fetching user:', error);
      });
  });

  scheduledTasks[email] = task;
  res.status(200).send({ message: 'Daily reminder scheduled successfully.' });
});

sendemailRouter.post('/unschedule-daily', (req, res) => {
  const { email } = req.body;

  if (!scheduledTasks[email]) {
    return res
      .status(400)
      .send({ message: 'No daily reminder scheduled for this email.' });
  }

  scheduledTasks[email].stop();
  delete scheduledTasks[email];
  res.status(200).send({ message: 'Daily reminder unscheduled successfully.' });
});

sendemailRouter.post('/schedule-weekly', (req, res) => {
  const { email } = req.body;

  if (weeklyScheduledTasks[email]) {
    return res
      .status(400)
      .send({ message: 'Weekly reminder already scheduled.' });
  }

  const task = cron.schedule('0 6 * * 1', async () => {
    const msg = {
      to: email,
      from: {
        name: 'Polyglot',
        email: 'emmaemma0768@gmail.com',
      },
      subject: 'Weekly Reminder',
      text: 'This is your weekly reminder.',
      html: '<p>This is your weekly reminder.</p>',
    };

    try {
      await sgMail.send(msg);
      console.log('Weekly reminder sent to:', email);
    } catch (error) {
      console.log('Error sending weekly reminder:', error);
    }
  });

  weeklyScheduledTasks[email] = task;
  res.status(200).send({ message: 'Weekly reminder scheduled successfully.' });
});

sendemailRouter.post('/unschedule-weekly', (req, res) => {
  const { email } = req.body;

  if (!weeklyScheduledTasks[email]) {
    return res
      .status(400)
      .send({ message: 'No weekly reminder scheduled for this email.' });
  }

  weeklyScheduledTasks[email].stop();
  delete weeklyScheduledTasks[email];
  res
    .status(200)
    .send({ message: 'Weekly reminder unscheduled successfully.' });
});

sendemailRouter.post('/schedule-monthly', (req, res) => {
  const { email } = req.body;

  if (monthlyScheduledTasks[email]) {
    return res
      .status(400)
      .send({ message: 'Monthly progress report already scheduled.' });
  }

  const task = cron.schedule('0 8 18 * *', async () => {
    const msg = {
      to: email,
      from: {
        name: 'Polyglot',
        email: 'emmaemma0768@gmail.com',
      },
      subject: 'Monthly Progress Report',
      text: 'This is your monthly progress report.',
      html: '<p>This is your monthly progress report.</p>',
    };

    try {
      await sgMail.send(msg);
      console.log('Monthly progress report sent to:', email);
    } catch (error) {
      console.log('Error sending monthly progress report:', error);
    }
  });

  monthlyScheduledTasks[email] = task;
  res
    .status(200)
    .send({ message: 'Monthly progress report scheduled successfully.' });
});

sendemailRouter.post('/unschedule-monthly', (req, res) => {
  const { email } = req.body;

  if (!monthlyScheduledTasks[email]) {
    return res.status(400).send({
      message: 'No monthly progress report scheduled for this email.',
    });
  }

  monthlyScheduledTasks[email].stop();
  delete monthlyScheduledTasks[email];
  res
    .status(200)
    .send({ message: 'Monthly progress report unscheduled successfully.' });
});

sendemailRouter.post('/schedule-promotion', (req, res) => {
  const { email } = req.body;

  if (promotionScheduledTasks[email]) {
    return res
      .status(400)
      .send({ message: 'Promotion alert already scheduled.' });
  }

  const task = cron.schedule('30 8 20 * *', async () => {
    const msg = {
      to: email,
      from: {
        name: 'Polyglot',
        email: 'emmaemma0768@gmail.com',
      },
      subject: 'Promotion Alert',
      text: 'This is the promotion email.',
      html: '<p>This is the promotion email.</p>',
    };

    try {
      await sgMail.send(msg);
      console.log('Promotion email sent to:', email);
    } catch (error) {
      console.log('Error sending promotion email:', error);
    }
  });

  promotionScheduledTasks[email] = task;
  res.status(200).send({ message: 'Promotion alert scheduled successfully.' });
});

sendemailRouter.post('/unschedule-promotion', (req, res) => {
  const { email } = req.body;

  if (!promotionScheduledTasks[email]) {
    return res
      .status(400)
      .send({ message: 'No promotion alert scheduled for this email.' });
  }

  promotionScheduledTasks[email].stop();
  delete promotionScheduledTasks[email];
  res
    .status(200)
    .send({ message: 'Promotion alert unscheduled successfully.' });
});

export default sendemailRouter;
