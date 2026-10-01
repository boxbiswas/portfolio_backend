import { prisma } from '../lib/prisma.js';

export const getBlogs = async (req, res) => {
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
          { content: { contains: req.query.search, mode: 'insensitive' } }
        ]
      };
    }
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({ skip, take: limit, orderBy: { [sortBy]: sortOrder }, where, include: { coverMedia: true, author: { select: { id: true, name: true, email: true } } } }),
      prisma.blog.count({ where })
    ]);
    return res.status(200).json({ success: true, message: 'Blogs retrieved successfully', data: blogs, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await prisma.blog.findUnique({ where: { id: req.params.id }, include: { coverMedia: true, author: { select: { id: true, name: true, email: true } } } });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    return res.status(200).json({ success: true, message: 'Blog retrieved', data: blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    if (!req.body.title || !req.body.slug || !req.body.authorId) return res.status(400).json({ success: false, message: 'Title, Slug, and Author are required' });
    const blog = await prisma.blog.create({ data: req.body });
    return res.status(201).json({ success: true, message: 'Blog created', data: blog });
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ success: false, message: `Duplicate entry for ${error.meta.target}` });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await prisma.blog.update({ where: { id: req.params.id }, data: req.body });
    return res.status(200).json({ success: true, message: 'Blog updated', data: blog });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Blog not found' });
    if (error.code === 'P2002') return res.status(400).json({ success: false, message: `Duplicate entry for ${error.meta.target}` });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    await prisma.blog.delete({ where: { id: req.params.id } });
    return res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Blog not found' });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
