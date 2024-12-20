import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express();
const PORT = 3100;
app.use(express.json())
app.use(express.urlencoded({extended: true}))

function loadHost() {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    app.use(express.static(path.join(__dirname, 'public')))
    
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'))
    })

    app.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`)
    })
}
loadHost()