const venueService = require('./venue.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const listVenues = asyncHandler(async (req, res) => {
  const { venues, meta } = await venueService.listVenues(req.validatedQuery || req.query);
  return ApiResponse.success(res, 'Venues retrieved successfully', venues, meta);
});

const getVenue = asyncHandler(async (req, res) => {
  const venue = await venueService.getVenueByIdOrSlug(req.params.idOrSlug);
  return ApiResponse.success(res, 'Venue details retrieved successfully', venue);
});

const createVenue = asyncHandler(async (req, res) => {
  const venue = await venueService.createVenue(req.validatedBody, req.user?.id);
  return ApiResponse.created(res, 'Venue created successfully', venue);
});

const updateVenue = asyncHandler(async (req, res) => {
  const venue = await venueService.updateVenue(req.params.id, req.validatedBody, req.user);
  return ApiResponse.success(res, 'Venue updated successfully', venue);
});

const deleteVenue = asyncHandler(async (req, res) => {
  await venueService.deleteVenue(req.params.id, req.user);
  return ApiResponse.success(res, 'Venue deleted successfully');
});

module.exports = {
  listVenues,
  getVenue,
  createVenue,
  updateVenue,
  deleteVenue,
};

