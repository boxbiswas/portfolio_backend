import { prisma } from '../lib/prisma.js';

export const getServices = async (req, res) => {
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
    const [services, total] = await Promise.all([
      prisma.service.findMany({ skip, take: limit, orderBy: { [sortBy]: sortOrder }, where }),
      prisma.service.count({ where })
    ]);
    return res.status(200).json({ success: true, message: 'Services retrieved successfully', data: services, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    return res.status(200).json({ success: true, message: 'Service retrieved', data: service });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    if (!req.body.title || !req.body.shortDescription) return res.status(400).json({ success: false, message: 'Title and Short Description are required' });
    const service = await prisma.service.create({ data: req.body });
    return res.status(201).json({ success: true, message: 'Service created', data: service });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await prisma.service.update({ where: { id: req.params.id }, data: req.body });
    return res.status(200).json({ success: true, message: 'Service updated', data: service });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Service not found' });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Service not found' });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
