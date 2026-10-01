import { prisma } from '../lib/prisma.js';

export const addSkillToProject = async (req, res) => {
  try {
    const { projectId, skillId, sortOrder } = req.body;
    if (!projectId || !skillId) return res.status(400).json({ success: false, message: 'projectId and skillId are required' });
    const relation = await prisma.projectSkill.create({ data: { projectId, skillId, sortOrder: sortOrder || 0 } });
    return res.status(201).json({ success: true, message: 'Skill added to project', data: relation });
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ success: false, message: 'This skill is already attached to this project' });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const removeSkillFromProject = async (req, res) => {
  try {
    const { projectId, skillId } = req.params;
    await prisma.projectSkill.delete({ where: { projectId_skillId: { projectId, skillId } } });
    return res.status(200).json({ success: true, message: 'Skill removed from project' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Relation not found' });
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
