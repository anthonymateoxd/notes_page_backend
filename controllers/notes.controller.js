import { getConnection } from '../connection/connection.js';

export const getAllNotes = async (req, res) => {
  try {
    const { folderId } = req.params; // <- this is the folder_id

    const connection = await getConnection();

    const [rows] = await connection.execute(
      'SELECT * FROM notes WHERE folder_id = ?',
      [folderId]
    );

    return res.status(200).json(rows || []);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Severe Internal Error' });
  }
};

export const createNote = async (req, res) => {
  try {
    const { folder_id } = req.params;
    const { title, content, color } = req.body;

    const connection = await getConnection();

    await connection.execute(
      'INSERT INTO notes (folder_id, title, content, color) VALUES (?, ?, ?, ?)',
      [folder_id, title, content, color]
    );

    return res.status(200).json({ message: 'Note created Successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Several Error' });
  }
};

export const editNote = async (req, res) => {
  try {
    const { note_id } = req.params;
    const { title, content, color } = req.body;

    const connection = await getConnection();

    await connection.execute(
      'UPDATE notes SET title = ?, content = ?, color = ? WHERE id = ?',
      [title, content, color, note_id]
    );

    return res.status(200).json({ message: 'Note updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Several Error' });
  }
};
