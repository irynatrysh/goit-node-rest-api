import multer from "multer";
import * as path from "node:path";

const tempDir = path.resolve("tmp");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log("Destination directory:", tempDir); 
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    console.log("Uploaded file:", file.originalname); 
    cb(null, file.originalname);
  }
})

export default multer({ storage });
