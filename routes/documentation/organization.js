import express from 'express'; 
import { addMembersToOrganization, addOrganization, getAllOrganizations, getOrganizationById, removeMembersFromOrganization, updateOrganization } from '../../controllers/documentation/organization.js';

const router = express.Router();

// Route to add a new organization
router.post('/add', addOrganization);

// Route to update an existing organization
router.put('/:id', updateOrganization);

// Route to add members to an organization
router.post('/:organizationId/members', addMembersToOrganization);

// Route to get all organizations
router.get('/getAll', getAllOrganizations);

// Route to get an organization by ID
router.get('/get/:id', getOrganizationById);

// Route to remove members from an organization
router.delete('/:organizationId/members', removeMembersFromOrganization);

export default router;
