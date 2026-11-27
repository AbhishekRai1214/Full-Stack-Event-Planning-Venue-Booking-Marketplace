/**
 * Admin Routes
 *
 * All endpoints require authentication and ADMIN role.
 * - GET   /api/v1/admin/stats
 * - GET   /api/v1/admin/users
 * - PATCH /api/v1/admin/users/:id/status
 * - PATCH /api/v1/admin/venues/:id/approve
 * - PATCH /api/v1/admin/venues/:id/reject
 * - PATCH /api/v1/admin/vendors/:id/verify
 * - GET   /api/v1/admin/contacts
 * - PATCH /api/v1/admin/contacts/:id
 */

const express = require('express');
const adminController = require('./admin.controller');
const { authenticate } = require('../../middleware/authenticate');
const { authorize } = require('../../middleware/authorize');
const { ROLES } = require('../../constants');

const router = express.Router();

router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.toggleUserStatus);

router.patch('/venues/:id/approve', adminController.approveVenue);
router.patch('/venues/:id/reject', adminController.rejectVenue);
router.patch('/vendors/:id/verify', adminController.verifyVendor);

router.get('/contacts', adminController.getContacts);
router.patch('/contacts/:id', adminController.updateContact);

module.exports = router;
