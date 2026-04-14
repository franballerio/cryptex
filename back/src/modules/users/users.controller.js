export class UsersController {
  constructor(service) {
    this.service = service;
  }

  getUsersWithRol = async (req, res) => {
    try {
      const userRol = req.userDecoded.rol;
      const users = await this.service.getUsersWithRol(userRol);
      res.status(200).json(users);
    } catch (error) {
      console.error('[UsersController] Error in getUsersWithRol:', error);
      res.status(500).json({ Error: 'Error al obtener usuarios' });
    }
  };

  getUsers = async (req, res) => {
    try {
      const search = req.query.search || '';
      const result = await this.service.getUsers({ search });
      res.status(200).json(result);
    } catch (error) {
      console.error('[UsersController] Error in getUsers:', error);
      res.status(500).json({ Error: 'Error al obtener usuarios' });
    }
  };

  getOnlineUsers = async (req, res) => {
    try {
      const { user_id } = req.body;
      const onlineUsers = await this.service.getOnlineUsers({ user_id });
      res.status(200).json({ success: true, data: onlineUsers });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
