import emailjs from '@emailjs/browser';

import logger from '../config/logger.js';

export const sendEmail = async (req, res) => {
  logger.info('email.controller.js: Received email request');
  logger.debug('email.controller.js: Request body:', req.body);
  try {
    const { name, subject, email, message } = req.body;
    const emailData = {
      name,
      subject,
      email,
      message,
    };
    logger.debug('email.controller.js: Sending email');
    await emailjs.send('gmail', 'form_submission', emailData);
    res.status(200).json({ message: 'Form Submitted' });
  } catch (error) {
    logger.error('email.controller.js: Error sending email:', error);
    res.status(500).json({ message: 'Failed to send form' });
  }
};
