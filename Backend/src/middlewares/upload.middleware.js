import multer from 'multer'; //Dependencia para fotos
import path from 'path'; //utilizar path para crear carpeta upload
import fs from 'fs'; //nose
import { fileURLToPath } from 'url'; //tampoco se
import { fileTypeFromBuffer } from 'file-type';


//Se crea la ruta donde se creará la carpeta uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../../uploads');


//creacion de carpeta
try{
    if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('=> Carpeta uploads creada:', uploadsDir);
    }
} catch (error) {
    console.error('No se pudo crear caprpeta uploads:', error)
}

//Se crea el "HDD"
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}_${safeName}`);
  }
});

//se filtran las fotos con formatos que puede aguantar
function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Tipo de archivo no permitido'), false);
}

async function secureFileFilter(req, file, cb) {
  try {
    const chunks = [];
    file.stream.on('data', chunk => chunks.push(chunk));

    file.stream.on('end', async () => {
      const buffer = Buffer.concat(chunks);
      const detected = await fileTypeFromBuffer(buffer);

      const allowed = ['png', 'jpg', 'jpeg'];

      if (!detected || !allowed.includes(detected.ext)) {
        return cb(new Error('El archivo no corresponde a su tipo real'), false);
      }

      cb(null, true);
    });

  } catch (error) {
    cb(new Error('Error al validar archivo'), false);
  }
}


//condiciones que debe cumplir el archivo
export const upload = multer({
    storage,
    fileFilter: secureFileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

//nombre del archivo mas cantidad maxima
export const uploadFields = upload.fields([
  { name: 'foto', maxCount: 1 }
]);
