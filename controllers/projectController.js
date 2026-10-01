import { prisma } from '../lib/prisma.js';

export const getProjects = async (req, res) => {
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
          { title: { contains: req.query.search, mode: 'insensitive' } },
          { description: { contains: req.query.search, mode: 'insensitive' } }
        ]
      };
    }
    const [projects, total] = await Promise.all([
      prisma.project.findMany({ skip, take: limit, orderBy: { [sortBy]: sortOrder }, where, include: { coverMedia: true, skills: { include: { skill: true } } } }),
      prisma.project.count({ where })
    ]);
    return res.status(200).json({ success: true, message: 'Projects retrieved successfully', data: projects, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id }, include: { coverMedia: true, skills: { include: { skill: true } } } });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    return res.status(200).json({ success: true, message: 'Project retrieved', data: project });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    if (!req.body.title || !req.body.slug) return res.status(400).json({ success: false, message: 'Title and Slug are required' });
    const project = await prisma.project.create({ data: req.body });
    return res.status(201).json({ success: true, message: 'Project created', data: project });
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ success: false, message: `Duplicate entry for ${error.meta.target}` });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await prisma.project.update({ where: { id: req.params.id }, data: req.body });
    return res.status(200).json({ success: true, message: 'Project updated', data: project });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Project not found' });
    if (error.code === 'P2002') return res.status(400).json({ success: false, message: `Duplicate entry for ${error.meta.target}` });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Project not found' });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
