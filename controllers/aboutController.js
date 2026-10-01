import { prisma } from '../lib/prisma.js';

export const getAbout = async (req, res) => {
  try {
    const about = await prisma.about.findFirst({
      include: { profileMedia: true }
    });
    return res.status(200).json({ success: true, message: 'About retrieved', data: about || {} });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const updateAbout = async (req, res) => {
  try {
    const data = req.body;
    let about = await prisma.about.findFirst();
    if (about) {
      about = await prisma.about.update({ where: { id: about.id }, data });
    } else {
      about = await prisma.about.create({ data });
    }
    return res.status(200).json({ success: true, message: 'About updated successfully', data: about });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
