export class FileController {
  constructor(service) {
    this.service = service
  }

  upload = async (req, res) => {
    const files = req.files
    if (!files || files.length === 0) return res.status(400).json({ success: false, message: 'No se enviaron archivos' })

    try {
      // subimos archivos uno por uno (nos permite usar upload como promesa)
      const upload = files.map(file => {
        return this.service.saveFile(file.buffer, file.originalname, file.mimetype)
      })

      // promise.all hace que esperemos a que se guarden todos los archivos al mismo "tiempo" usando concurrencia
      // de otra manera usariamos un for y perderiamos velocidad 
      const urls = await Promise.all(upload)
      return res.status(200).json({ success: true, data: urls })
    } catch (error) {
      return res.status(500).json({ success: false, message: `Error guardando archivos: ${error}` })
    }
  }
}