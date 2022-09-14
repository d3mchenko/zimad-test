import {diskStorage} from "multer";

export const storage = diskStorage({
    destination: './src/files/',
    filename: (req, file, callback) => {
        callback(null, generateFilename(file));
    }
});

const generateFilename = (file) => {
    return `${file.originalname}`
}