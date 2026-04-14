export class UsersService {
  constructor(repository) {
    this.repository = repository;
  }

  async getUsersWithRol(userRol) {
    const users = await this.repository.getUsersWithRol(userRol);
    return users;
  }

  async getUsers({ search }) {
    const users = await this.repository.getUsers({ search });
    const headerUsuarios = [
      { title: "Grado", key: "grado" },
      { title: "Nombre", key: "nombre" },
      { title: "Usuario", key: "user" },
      { title: "Correo", key: "correo" },
      { title: "Permisos", key: "permiso" },
      { title: "Rol", key: "rol" },
      { title: "Oculto", key: "hide" },
    ];

    return {
      data: users,
      header: headerUsuarios,
    };
  }

  async getUser(id) {
    const user = await this.repository.findUserById(id)
    if (user.length === 0) return null
    return user
  }
}
