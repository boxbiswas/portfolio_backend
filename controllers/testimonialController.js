import { prisma } from '../lib/prisma.js';

export const getTestimonials = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
    let where = {};
    if (req.query.search) {
      where = {
        OR: [
          { name: { contains: req.query.search, mode: 'insensitive' } },
          { company: { contains: req.query.search, mode: 'insensitive' } }
        ]
      };
    }
    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({ skip, take: limit, orderBy: { [sortBy]: sortOrder }, where, include: { avatarMedia: true } }),
      prisma.testimonial.count({ where })
    ]);
    return res.status(200).json({ success: true, message: 'Testimonials retrieved successfully', data: testimonials, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await prisma.testimonial.findUnique({ where: { id: req.params.id }, include: { avatarMedia: true } });
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    return res.status(200).json({ success: true, message: 'Testimonial retrieved', data: testimonial });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    if (!req.body.name || !req.body.role || !req.body.message) return res.status(400).json({ success: false, message: 'Name, Role, and Message are required' });
    const testimonial = await prisma.testimonial.create({ data: req.body });
    return res.status(201).json({ success: true, message: 'Testimonial created', data: testimonial });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await prisma.testimonial.update({ where: { id: req.params.id }, data: req.body });
    return res.status(200).json({ success: true, message: 'Testimonial updated', data: testimonial });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Testimonial not found' });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Testimonial not found' });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
