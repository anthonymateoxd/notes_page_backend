import { TOKEN_SECRET } from '../config.js';
import { getConnection } from '../connection/connection.js';
import { createAccessToken } from '../libs/jwt.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mostrar Todos los Usuarios
// export const getUsers = async (req, res) => {
//   try {
//     const connection = await getConnection();
//     const [rows] = await connection.execute('SELECT * FROM users');
//     return res.json(rows);
//   } catch (error) {
//     console.log('Error: ', error);
//     res.status(500).json({ message: 'Error fetching usuarios' });
//   }
// };

// Traer un usuario con el Id
export const getUserById = async (req, res) => {
  try {
    const userId = req.user.id;
    const connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    return res.json(rows[0] || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Crear un usuario
export const createUser = async (req, res) => {
  try {
    const { email, password, name, description } = req.body;
    const connection = await getConnection();

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.execute(
      'INSERT INTO users (email, password, name, description) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, description]
    );

    const token = await createAccessToken({ id: result.insertId });

    res.cookie('token', token);

    return res.json({ id: result.insertId, email, name, description });
  } catch (error) {
    // console.error(error);
    // res.status(500).json({ message: 'Error creating user' });
    console.error('Database error:', error.message);
    res.status(500).json({
      message: 'Error creating user',
      error: error.sqlMessage || error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await getConnection();

    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'User not dound' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    const token = await createAccessToken({ id: user.id });

    res.cookie('token', token);
    console.log(token);

    return res.status(200).json({ id: user.id, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en login' });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      expires: new Date(0),
    });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
};

export const verifyToken = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Unauthorized' });

      const connection = await getConnection();
      const [rows] = await connection.execute(
        'SELECT id, email FROM users WHERE id = ?',
        [decoded.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Aquí respondemos directo en vez de usar next()
      return res.json({ user: rows[0] });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error verifying token' });
  }
};

export const getFilesAndNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const connection = await getConnection();

    const [rows] = await connection.execute(
      'SELECT  u.id AS user_id, (SELECT COUNT(*) FROM folders f WHERE f.user_id = u.id) AS total_folders, (SELECT COUNT(*) FROM notes n JOIN folders f ON n.folder_id = f.id WHERE f.user_id = u.id) AS total_notes,(SELECT MAX(f.created_at) FROM folders f WHERE f.user_id = u.id) AS last_folder_created_at, (SELECT MAX(n.created_at)FROM notes n JOIN folders f ON n.folder_id = f.id WHERE f.user_id = u.id) AS last_note_created_at FROM users u WHERE u.id = ?;',
      [userId]
    );

    return res.status(200).json(rows[0] || {});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Serveral error' });
  }
};

export const editUser = async (req, res) => {
  try {
    const id = req.user.id;
    const { name, description } = req.body;

    const connection = await getConnection();

    await connection.execute(
      'UPDATE users SET name = ?, description = ? WHERE id = ?;',
      [name, description, id]
    );

    return res.status(200).json({ message: 'User Updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Several Error' });
  }
};
