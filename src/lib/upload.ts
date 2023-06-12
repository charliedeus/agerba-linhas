import multer from 'multer'

// Configuração do Multer
const storage = multer.diskStorage({
  destination: '/tmp',
  filename: (req, file, cb) => {
    // Defina um nome de arquivo único, se necessário
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  },
})

export const upload = multer({ storage })
