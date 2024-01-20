import multer from 'multer';

const storage = multer.memoryStorage();

export const signleUpload = multer({storage}).single('file');