import emailjs from '@emailjs/browser';

export const sendEmail = async (req, res) => {
  try {
    const { name, subject, email, message } = req.body;
    const emailData = {
      name,
      subject,
      email,
      message,
    };
    await emailjs.send('gmail', 'form_submission', emailData);
    res.status(200).json({ message: 'Form Submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send form' });
  }
};
