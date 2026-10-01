import { prisma } from '../lib/prisma.js';

export const getExperience = async (req, res) => {
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
          { company: { contains: req.query.search, mode: 'insensitive' } },
          { role: { contains: req.query.search, mode: 'insensitive' } }
        ]
      };
    }
    const [experience, total] = await Promise.all([
      prisma.experience.findMany({ skip, take: limit, orderBy: { [sortBy]: sortOrder }, where }),
      prisma.experience.count({ where })
    ]);
    return res.status(200).json({ success: true, message: 'Experience retrieved successfully', data: experience, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getExperienceById = async (req, res) => {
  try {
    const experience = await prisma.experience.findUnique({ where: { id: req.params.id } });
    if (!experience) return res.status(404).json({ success: false, message: 'Experience not found' });
    return res.status(200).json({ success: true, message: 'Experience retrieved', data: experience });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const createExperience = async (req, res) => {
  try {
    if (!req.body.company || !req.body.role || !req.body.startDate || !req.body.employmentType) return res.status(400).json({ success: false, message: 'Company, role, startDate and employmentType are required' });
    const experience = await prisma.experience.create({ data: req.body });
    return res.status(201).json({ success: true, message: 'Experience created', data: experience });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const experience = await prisma.experience.update({ where: { id: req.params.id }, data: req.body });
    return res.status(200).json({ success: true, message: 'Experience updated', data: experience });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Experience not found' });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    await prisma.experience.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Experience not found' });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
