const vendorService = require('./vendor.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const listVendors = asyncHandler(async (req, res) => {
  const { vendors, meta } = await vendorService.listVendors(req.validatedQuery || req.query);
  return ApiResponse.success(res, 'Vendors retrieved successfully', vendors, meta);
});

const getVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.getVendorByIdOrSlug(req.params.idOrSlug);
  return ApiResponse.success(res, 'Vendor details retrieved successfully', vendor);
});

const createVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await vendorService.createVendorProfile(req.validatedBody, req.user?.id);
  return ApiResponse.created(res, 'Vendor profile created successfully', vendor);
});

const updateVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await vendorService.updateVendorProfile(req.params.id, req.validatedBody, req.user);
  return ApiResponse.success(res, 'Vendor profile updated successfully', vendor);
});

const deleteVendorProfile = asyncHandler(async (req, res) => {
  await vendorService.deleteVendorProfile(req.params.id, req.user);
  return ApiResponse.success(res, 'Vendor profile deleted successfully');
});

module.exports = {
  listVendors,
  getVendor,
  createVendorProfile,
  updateVendorProfile,
  deleteVendorProfile,
};
