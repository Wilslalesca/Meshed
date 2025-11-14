import { Router } from "express";
import multer from "multer";
import { UploadController } from "../controllers/UploadController";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.array("files"), UploadController.uploadICS);
router.get("/", UploadController.health);

export default router;
