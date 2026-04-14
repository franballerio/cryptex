import pg from 'pg';
import { db } from '../config/config.js'

const { Pool, client } = pg
export const pool = new Pool(db)

export const testConnection = async () => {
  const colors = await import("colors");
  try {
    const connection = new Pool(db)
    console.log(
      colors.default.bold.green(`2/2 `),
      "Conexión exitosa a la base de datos"
    );
    connection.end();
  } catch (error) {
    console.log(
      colors.default.bold.red(`5/6 `),
      "Error al conectar con la base de datos"
    );
    console.log(
      colors.default.red("No se pueden recibir consultar relacionadas con la BD")
    );
    console.log(error.message);
  }
};


