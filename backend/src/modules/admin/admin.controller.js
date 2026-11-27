/**
 * Admin Controller
 */

const adminService = require('./admin.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const { VENUE_STATUS } = require('../../constants');

class AdminController {
  getStats = asyncHandler(async (req, res) => {
    const stats = await adminService.getPlatformStats();
    return ApiResponse.success(res, { stats }, 'Platform statistics retrieved successfully');
  });

  getUsers = asyncHandler(async (req, res) => {
    const users = await adminService.getUsers();
    return ApiResponse.success(res, { users }, 'Users list retrieved');
  });

  toggleUserStatus = asyncHandler(async (req, res) => {
    const user = await adminService.toggleUserStatus(req.params.id);
    return ApiResponse.success(res, { user }, `User status updated to ${user.isActive ? 'active' : 'suspended'}`);
  });

  approveVenue = asyncHandler(async (req, res) => {
    const venue = await adminService.setVenueStatus(req.params.id, VENUE_STATUS.APPROVED);
    return ApiResponse.success(res, { venue }, 'Venue approved for public listing');
  });

  rejectVenue = asyncHandler(async (req, res) => {
    const venue = await adminService.setVenueStatus(req.params.id, VENUE_STATUS.REJECTED, req.body.reason);
    return ApiResponse.success(res, { venue }, 'Venue listing rejected');
  });

  verifyVendor = asyncHandler(async (req, res) => {
    const vendor = await adminService.setVendorVerification(req.params.id, true);
    return ApiResponse.success(res, { vendor }, 'Vendor marked as verified');
  });

  getContacts = asyncHandler(async (req, res) => {
    const contacts = await adminService.getContactInquiries();
    return ApiResponse.success(res, { contacts }, 'Contact messages retrieved');
  });

  updateContact = asyncHandler(async (req, res) => {
    const contact = await adminService.updateContactStatus(
      req.params.id,
      req.body.status,
      req.body.adminNotes
    );
    return ApiResponse.success(res, { contact }, 'Inquiry status updated');
  });
}

module.exports = new AdminController();
