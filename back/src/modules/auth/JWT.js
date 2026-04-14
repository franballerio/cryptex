import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;

export async function verificarToken(req, res, next) {
  const token = req.cookies.access_cookie
  if (!token) {
    return res.status(403).json({ status: "Error", message: 'Token no proporcionado' });
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      console.log("Token no valido")
      return res.status(498).json({ error: 'Token no válido' });
    }

    req.userDecoded = decoded;
    /*User Decoded:  {
      _id: 'id de usuario'
      grado: 'VS',
      nombre: 'Santiago',
      apellido: 'Gorbea',
      usuario: 'sgorbea',
      hide: 0,
      permiso: '111111',
      rol: 0,
    } */
    next();
  });
}

export function getUserFromToken(token) {
  try {
    // const clean = token?.replace(/^Bearer\s+/i, ""); // por si viene "Bearer ..."
    const decoded = jwt.verify(token, secretKey); // ← SIN callback => sync
    console.log('[JWT] token decoded: ', decoded)
    return decoded; // devuelve el payload
  } catch (err) {
    console.log("Token no válido:", err.message);
    return null;
  }
}

export function generarToken(user) {
  const token = jwt.sign(user, secretKey, { expiresIn: '5h' });
  return token;
}


