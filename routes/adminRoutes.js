import express from 'express';

// Import controllers
import * as settingsCtrl from '../controllers/settingsController.js';
import * as aboutCtrl from '../controllers/aboutController.js';
import * as projectCtrl from '../controllers/projectController.js';
import * as projectSkillCtrl from '../controllers/projectSkillController.js';
import * as skillCtrl from '../controllers/skillController.js';
import * as blogCtrl from '../controllers/blogController.js';
import * as experienceCtrl from '../controllers/experienceController.js';
import * as testimonialCtrl from '../controllers/testimonialController.js';
import * as serviceCtrl from '../controllers/serviceController.js';
import * as socialLinkCtrl from '../controllers/socialLinkController.js';
import * as mediaCtrl from '../controllers/mediaController.js';
import * as contactCtrl from '../controllers/contactController.js';

// Authentication middleware
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply authentication to all admin routes
router.use(authenticate);

// Settings
router.route('/settings')
  .get(settingsCtrl.getSettings)
  .put(settingsCtrl.updateSettings);

// About
router.route('/about')
  .get(aboutCtrl.getAbout)
  .put(aboutCtrl.updateAbout);

// Projects
router.route('/projects')
  .get(projectCtrl.getProjects)
  .post(projectCtrl.createProject);
router.route('/projects/:id')
  .get(projectCtrl.getProjectById)
  .put(projectCtrl.updateProject)
  .delete(projectCtrl.deleteProject);

// Project Skills
router.route('/project-skills')
  .post(projectSkillCtrl.addSkillToProject);
router.route('/project-skills/:projectId/:skillId')
  .delete(projectSkillCtrl.removeSkillFromProject);

// Skills
router.route('/skills')
  .get(skillCtrl.getSkills)
  .post(skillCtrl.createSkill);
router.route('/skills/:id')
  .get(skillCtrl.getSkillById)
  .put(skillCtrl.updateSkill)
  .delete(skillCtrl.deleteSkill);

// Blogs
router.route('/blogs')
  .get(blogCtrl.getBlogs)
  .post(blogCtrl.createBlog);
router.route('/blogs/:id')
  .get(blogCtrl.getBlogById)
  .put(blogCtrl.updateBlog)
  .delete(blogCtrl.deleteBlog);

// Experience
router.route('/experience')
  .get(experienceCtrl.getExperience)
  .post(experienceCtrl.createExperience);
router.route('/experience/:id')
  .get(experienceCtrl.getExperienceById)
  .put(experienceCtrl.updateExperience)
  .delete(experienceCtrl.deleteExperience);

// Testimonials
router.route('/testimonials')
  .get(testimonialCtrl.getTestimonials)
  .post(testimonialCtrl.createTestimonial);
router.route('/testimonials/:id')
  .get(testimonialCtrl.getTestimonialById)
  .put(testimonialCtrl.updateTestimonial)
  .delete(testimonialCtrl.deleteTestimonial);

// Services
router.route('/services')
  .get(serviceCtrl.getServices)
  .post(serviceCtrl.createService);
router.route('/services/:id')
  .get(serviceCtrl.getServiceById)
  .put(serviceCtrl.updateService)
  .delete(serviceCtrl.deleteService);

// Social Links
router.route('/social-links')
  .get(socialLinkCtrl.getSocialLinks)
  .post(socialLinkCtrl.createSocialLink);
router.route('/social-links/:id')
  .get(socialLinkCtrl.getSocialLinkById)
  .put(socialLinkCtrl.updateSocialLink)
  .delete(socialLinkCtrl.deleteSocialLink);

// Admin Media Routes
router.route('/media')
  .get(mediaCtrl.getMedia);
router.route('/media/upload')
  .post(mediaCtrl.uploadMedia);
router.route('/media/:id')
  .delete(mediaCtrl.deleteMedia);

// Admin Messages Routes
router.route('/messages')
  .get(contactCtrl.getMessages);
router.route('/messages/:id')
  .get(contactCtrl.getMessageById)
  .put(contactCtrl.updateMessage)
  .delete(contactCtrl.deleteMessage);

export default router;
