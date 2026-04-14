import { pool } from '../../core/database/db.conn.js'

export class AuthRepository {
  async findUserByUsername(user) {
    try {
      const { rows } = await pool.query(`
        SELECT 
          u._id as _id,
          g.abreviatura as grado, 
          u.nombre, 
          u.apellido,
          u.usuario, 
          u.hide, 
          r.nombre as rol,
          r.permiso
        FROM usuarios as u 
        LEFT JOIN grados as g 
        ON u.id_grado = g._id
        LEFT JOIN roles as r
        ON u.id_rol = r._id 
        WHERE u.usuario = $1;`,
        [user]
      );
      return rows[0]
    } catch (error) {
      console.log(error);
    }
  }
}
