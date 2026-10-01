import express from 'express';
import * as contactCtrl from '../controllers/contactController.js';
import * as settingsCtrl from '../controllers/settingsController.js';
import * as aboutCtrl from '../controllers/aboutController.js';
import * as projectCtrl from '../controllers/projectController.js';
import * as skillCtrl from '../controllers/skillController.js';
import * as experienceCtrl from '../controllers/experienceController.js';
import * as serviceCtrl from '../controllers/serviceController.js';
import * as testimonialCtrl from '../controllers/testimonialController.js';
import * as blogCtrl from '../controllers/blogController.js';
import * as socialLinkCtrl from '../controllers/socialLinkController.js';

const router = express.Router();

// Public Portfolio Endpoints
router.post('/contact', contactCtrl.submitContact);
router.get('/settings', settingsCtrl.getSettings);
router.get('/about', aboutCtrl.getAbout);
router.get('/projects', projectCtrl.getProjects);
router.get('/skills', skillCtrl.getSkills);
router.get('/experience', experienceCtrl.getExperience);
router.get('/services', serviceCtrl.getServices);
router.get('/testimonials', testimonialCtrl.getTestimonials);
router.get('/blogs', blogCtrl.getBlogs);
router.get('/social-links', socialLinkCtrl.getSocialLinks);

export default router;
