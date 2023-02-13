import path from 'path'
import { fileURLToPath } from 'url'

export const __dirname = (url) => {
  const __filename = fileURLToPath(url)
  const __dirname = path.dirname(__filename)
  return __dirname
}
