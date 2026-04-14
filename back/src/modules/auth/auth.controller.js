import "dotenv/config";
import { getUserFromToken } from './JWT.js';

export class AuthController {
  constructor(service) {
    this.service = service
  }

  login = async (req, res) => {
    const { user, password } = req.body

    if (!user || !password) {
      return res.status(400).json({ Error: "Debe completar todos los campos" });
    }

    try {
      const auth = await this.service.authenticate(user, password)

      return res
        .cookie('access_cookie', auth.token, {
          httpOnly: true,
          // secure: process.env.NODE_ENV === 'production',
          secure: false,
          sameSite: 'strict',
          maxAge: 1000 * 60 * 15 // 15 mins
        })
        .status(200)
        .json(auth.user);
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  };

  me = async (req, res) => {
    const token = req.cookies.access_cookie;
    if (!token) {
      return res.status(401).json({ Error: "No autenticado" });
    }

    try {
      const decoded = getUserFromToken(token);
      if (!decoded) {
        return res.status(401).json({ Error: "Token inválido" });
      }
      return res.status(200).json(decoded);
    } catch (error) {
      return res.status(401).json({ Error: "Token inválido" });
    }
  };

  token = (req, res) => {
    const token = req.cookies.access_cookie;
    if (!token) {
      return res.status(401).json({ Error: "No autenticado" });
    }
    return res.status(200).json({ token: token });
  };
}
