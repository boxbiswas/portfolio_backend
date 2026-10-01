import { prisma } from '../lib/prisma.js';

export const getSettings = async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findFirst({
      include: { logoMedia: true, faviconMedia: true, resumeMedia: true }
    });
    return res.status(200).json({ success: true, message: 'Settings retrieved', data: settings || {} });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const data = req.body;
    let settings = await prisma.siteSettings.findFirst();
    if (settings) {
      settings = await prisma.siteSettings.update({ where: { id: settings.id }, data });
    } else {
      settings = await prisma.siteSettings.create({ data });
    }
    return res.status(200).json({ success: true, message: 'Settings updated successfully', data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
