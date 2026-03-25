import { Router } from "express";
import { OrganizationController } from "../controllers/Organization.controller";
import { requireAuth, requireOrganization } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth);
router.use(requireOrganization);

router.get("/", OrganizationController.get);
router.get("/users", OrganizationController.listUsers);
router.post("/users", OrganizationController.addUser);
router.patch("/users/:membershipId/role", OrganizationController.updateUserRole);
router.patch("/users/:membershipId/status", OrganizationController.updateUserStatus);
router.delete("/users/:membershipId", OrganizationController.removeUser);

export default router;