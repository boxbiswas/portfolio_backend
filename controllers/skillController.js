import { prisma } from '../lib/prisma.js';

export const getSkills = async (req, res) => {
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
          { description: { contains: req.query.search, mode: 'insensitive' } }
        ]
      };
    }
    const [skills, total] = await Promise.all([
      prisma.skill.findMany({ skip, take: limit, orderBy: { [sortBy]: sortOrder }, where }),
      prisma.skill.count({ where })
    ]);
    return res.status(200).json({ success: true, message: 'Skills retrieved successfully', data: skills, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getSkillById = async (req, res) => {
  try {
    const skill = await prisma.skill.findUnique({ where: { id: req.params.id } });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    return res.status(200).json({ success: true, message: 'Skill retrieved', data: skill });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const createSkill = async (req, res) => {
  try {
    if (!req.body.name || !req.body.slug) return res.status(400).json({ success: false, message: 'Name and Slug are required' });
    const skill = await prisma.skill.create({ data: req.body });
    return res.status(201).json({ success: true, message: 'Skill created', data: skill });
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ success: false, message: `Duplicate entry for ${error.meta.target}` });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skill = await prisma.skill.update({ where: { id: req.params.id }, data: req.body });
    return res.status(200).json({ success: true, message: 'Skill updated', data: skill });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Skill not found' });
    if (error.code === 'P2002') return res.status(400).json({ success: false, message: `Duplicate entry for ${error.meta.target}` });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    await prisma.skill.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Skill not found' });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
