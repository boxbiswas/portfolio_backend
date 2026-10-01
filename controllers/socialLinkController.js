import { prisma } from '../lib/prisma.js';

export const getSocialLinks = async (req, res) => {
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
          { platform: { contains: req.query.search, mode: 'insensitive' } },
          { label: { contains: req.query.search, mode: 'insensitive' } }
        ]
      };
    }
    const [socialLinks, total] = await Promise.all([
      prisma.socialLink.findMany({ skip, take: limit, orderBy: { [sortBy]: sortOrder }, where }),
      prisma.socialLink.count({ where })
    ]);
    return res.status(200).json({ success: true, message: 'Social links retrieved successfully', data: socialLinks, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getSocialLinkById = async (req, res) => {
  try {
    const socialLink = await prisma.socialLink.findUnique({ where: { id: req.params.id } });
    if (!socialLink) return res.status(404).json({ success: false, message: 'Social Link not found' });
    return res.status(200).json({ success: true, message: 'Social link retrieved', data: socialLink });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const createSocialLink = async (req, res) => {
  try {
    if (!req.body.platform || !req.body.label || !req.body.url) return res.status(400).json({ success: false, message: 'Platform, label and url are required' });
    const socialLink = await prisma.socialLink.create({ data: req.body });
    return res.status(201).json({ success: true, message: 'Social link created', data: socialLink });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const updateSocialLink = async (req, res) => {
  try {
    const socialLink = await prisma.socialLink.update({ where: { id: req.params.id }, data: req.body });
    return res.status(200).json({ success: true, message: 'Social link updated', data: socialLink });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Social Link not found' });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const deleteSocialLink = async (req, res) => {
  try {
    await prisma.socialLink.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true, message: 'Social link deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Social Link not found' });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
