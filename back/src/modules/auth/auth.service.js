import ldap from "ldapjs";
import { generarToken } from './JWT.js'

export class AuthService {
  constructor(repository) {
    this.repository = repository
  }

  async authenticate(user, password) {
    // vemos que el usuario sea valido en el AD
    await this.ldapAuth(user, password)
    // verificamos que este en nuestra db tambien (acceso a esta app)
    const userdb = await this.repository.findUserByUsername(user)
    if (!userdb || userdb.length <= 0) throw new Error('Usuario no identificado. Comuníquese con el Administrador.')
    if (userdb.hide === 1) throw new Error('Usuario deshabilitado')
    console.log('[AUTH SERVICE] User in db: ', userdb)

    // generamos el token
    const token = generarToken(userdb)

    return { token, user: userdb }
  }

  async ldapAuth(user, password) {
    return new Promise((resolve, reject) => {
      const user1 = `${user}@ciber.mil`;
      let client;

      // Crear la coneccion ldap (Login de CPS)
      const URL = process.env.LDAP_URL;
      client = ldap.createClient({
        url: URL
      });

      // Aca se muestra el error
      client.on("error", (err) => {
        console.log("Error en LDAP:", err);
        reject(err);
      });

      const DOMAIN_FQDN = process.env.DOMAIN_FQDN;
      const baseDNs = [
        `CN=Users,DC=${DOMAIN_FQDN.split(".").join(",DC=")}`,
        `OU=Users,OU=People,DC=${DOMAIN_FQDN.split(".").join(",DC=")}`,
      ];
      const options = {
        filter: "(cn=*)",
        scope: "sub",
      };
      //Hago la conexion con el usuario y la contraseña del CPS
      client.bind(user1, password, (err) => {
        if (err) {
          client.unbind()
          if (err.code === 532) return reject(new Error('La contraseña ha caducado'))
          if (err.code === 52) return reject(new Error('Usuario o contraseña incorrecto'))
          return reject(new Error('Error al autenticar'))
        }
        // Si no hubo un error realiza el search para ver si el usuario
        client.search(baseDNs[0], options, async (searchErr, searchRes) => {
          if (searchErr) {
            console.log("LDAP search error:", searchErr);
            client.unbind()
            return reject(new Error('LDAP search error'))
          }

          let foundEntry = null;

          searchRes.on('searchEntry', (entry) => {
            // Store the entry but don't close the connection yet
            if (!foundEntry) foundEntry = entry.object;
          })

          searchRes.on('end', () => {
            // Search is completely finished. Safe to unbind and resolve.
            client.unbind()
            resolve(foundEntry || true)
          })

          searchRes.on('error', (err) => {
            console.log("LDAP search result error:", err);
            client.unbind()
            reject(err)
          })
        })
      })
    });
  }
}
