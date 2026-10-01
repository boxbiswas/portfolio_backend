import { prisma } from '../lib/prisma.js';
import nodemailer from 'nodemailer';

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// PUBLIC ENDPOINT - POST /api/contact
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // 1. Validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    // 2. Save to PostgreSQL Database
    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, subject: subject || 'New Portfolio Contact', message }
    });

    // 3. Send Email Notification
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await transporter.sendMail({
          from: `"${name}" <${process.env.SMTP_USER}>`,
          replyTo: email,
          to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
          subject: `Portfolio Contact: ${subject || 'New Message'}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        });
      } catch (emailError) {
        console.error('Email failed to send, but message saved to DB:', emailError);
      }
    }

    return res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ADMIN ENDPOINTS
export const getMessages = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    let where = {};
    if (req.query.status) {
      where.status = req.query.status;
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        skip, take: limit,
        where,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contactMessage.count({ where })
    ]);

    return res.status(200).json({
      success: true, message: 'Messages retrieved', data: messages,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getMessageById = async (req, res) => {
  try {
    const message = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    
    // Auto-mark as read if it was new
    if (message.status === 'new') {
      await prisma.contactMessage.update({
        where: { id: req.params.id },
        data: { status: 'read' }
      });
    }

    return res.status(200).json({ success: true, message: 'Message retrieved', data: message });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { 
        status, 
        adminNotes,
        repliedAt: status === 'replied' ? new Date() : undefined
      }
    });
    return res.status(200).json({ success: true, message: 'Message updated', data: message });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Message not found' });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Message not found' });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
