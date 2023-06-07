import { Router } from 'express'

const ShellRoutes = Router()

ShellRoutes.get('/shell', (req, res) => {
  return res.json({ shell: true })
})

export default ShellRoutes
