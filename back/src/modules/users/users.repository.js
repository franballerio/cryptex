import { pool } from '../../core/database/db.conn.js'

export class UsersRepository {
  async getUsersWithRol(userRol) {
    try {
      const { rows } = await pool.query(`
        SELECT
          g.abreviatura as grado,
          r.nombre as rol, 
          u.id_rol as rol_id,
          CASE 
            WHEN g.abreviatura = 'Nodo' THEN u.nombre || ' ' || u.apellido
            ELSE g.abreviatura || ' ' || u.nombre || ' ' || u.apellido
          END as title, 
          u.usuario as value,
          u._id as _id
        FROM 
          usuarios as u
        JOIN 
          grados as g on u.id_grado = g._id
        JOIN
          roles as r on u.id_rol = r._id
        WHERE
          u.hide = 0 AND u.id_rol >= $1
        ORDER BY g._id;`,
        [userRol]
      );
      return rows;
    } catch (error) {
      console.error('[UsersRepository] Error in getUsersWithRol:', error);
      throw error;
    }
  }

  async getUsers({ search = '' }) {
    try {
      const baseQuery = `
        FROM usuarios as u
        LEFT JOIN grados as g on u.id_grado = g._id
        LEFT JOIN roles as r on r.permiso = u.permiso
      `;

      let whereClause = '';
      let searchParams = [];

      if (search && search.trim() !== '') {
        whereClause = `
          WHERE (
            u.usuario ILIKE $1 OR 
            u.nombre ILIKE $2 OR 
            u.apellido ILIKE $3 OR 
            r.nombre ILIKE $4 OR 
            g.abreviatura ILIKE $5
          )
        `;
        const searchString = `%${search}%`;
        searchParams = [searchString, searchString, searchString, searchString, searchString];
      }

      const sqlData = `
        SELECT 
          u._id,
          g.abreviatura as grado, 
          u.nombre || ' ' || u.apellido as nombre, 
          u.usuario as user,  
          u.usuario || '@ejercito.mi.ar' as correo, 
          u.permiso, 
          r.nombre as rol, 
          u.hide 
        ${baseQuery}
        ${whereClause}
        ORDER BY u._id DESC;
      `;

      const { rows } = await pool.query(sqlData, searchParams);
      return rows;
    } catch (error) {
      console.error('[UsersRepository] Error in getUsers:', error);
      throw error;
    }
  }

  async findUserById(userId) {
    try {
      const { rows } = await pool.query('SELECT * FROM usuarios WHERE _id = $1', [userId]);
      return rows[0];
    } catch (error) {
      console.error('[UsersRepository] Error in findUserById:', error);
      throw error;
    }
  }
}
