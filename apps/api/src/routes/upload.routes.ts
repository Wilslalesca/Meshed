import { Router } from 'express';
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" }); // stores files locally

router.post("/", upload.array("files"), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  console.log("Files uploaded:", req.files);

  res.json({ message: "Files uploaded successfully!", files: req.files });
});

export default router;