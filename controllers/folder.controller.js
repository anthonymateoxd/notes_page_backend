import { getConnection } from '../connection/connection.js';

export const getFolders = async (req, res) => {
  try {
    const userId = req.user.id;
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT f.id AS id, f.name AS name, f.color, COUNT(n.id) AS notes, f.created_at, f.updated_at FROM folders f LEFT JOIN notes n ON f.id = n.folder_id WHERE f.user_id = ? GROUP BY f.id, f.name;',
      [userId]
    );
    return res.status(200).json(rows || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

export const EditFolders = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario logueado
    const { id } = req.params;
    const { name, color } = req.body; // Datos que vienen del frontend

    const connection = await getConnection();

    // Actualizamos la carpeta específica del usuario
    const [result] = await connection.execute(
      'UPDATE folders SET name = ?, color = ? WHERE id = ? AND user_id = ?',
      [name, color, id, userId]
    );

    // Comprobamos si se actualizó algo
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    return res.status(200).json({ message: 'Succeed Folder updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating the file' });
  }
};

export const getFolderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const connection = await getConnection();

    const [rows] = await connection.execute(
      'SELECT * FROM folders WHERE user_id = ? AND id = ?',
      [userId, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User Not Found' });
    }
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

export const deleteFolderById = async (req, res) => {
  try {
    const userId = req.user.id; // usuario autenticado
    const { id } = req.params; // folder ID desde la URL

    const connection = await getConnection();

    // Eliminamos el folder si pertenece al usuario
    const [result] = await connection.execute(
      'DELETE FROM folders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    // Validamos si realmente se eliminó algo
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: 'Folder not found or not owned by user' });
    }

    return res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting the folder' });
  }
};

export const createFolder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, color } = req.body;

    const connection = await getConnection();

    // Verificar si ya existe carpeta
    const [existing] = await connection.execute(
      'SELECT id FROM folders WHERE user_id = ? AND name = ?',
      [userId, name]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Folder name already exists' });
    }

    // Crear carpeta
    const [result] = await connection.execute(
      'INSERT INTO folders (user_id, name, color) VALUES (?, ?, ?)',
      [userId, name, color]
    );

    return res.status(201).json({
      message: 'Folder created successfully',
      folderId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating folder' });
  }
};
