import { Router } from 'express';
//import multer from "multer";

const router = Router();
//const upload = multer({ dest: "uploads/" }); // stores files locally

/*router.post("/", upload.array("files"), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const parsedResults: any[] = [];

  console.log("Files uploaded:", req.files);

  res.json({ message: "Files uploaded successfully!", files: req.files });
});*/

router.get("/", (_req, res) => {
  res.json({ message: "Upload route is running!" });
});

export default router;