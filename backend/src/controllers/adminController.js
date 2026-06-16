const bcrypt = require('bcryptjs');
const db = require('../config/db');

// GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) as totalUsers FROM users WHERE role != "admin"');
    const [[{ totalStores }]] = await db.query('SELECT COUNT(*) as totalStores FROM stores');
    const [[{ totalRatings }]] = await db.query('SELECT COUNT(*) as totalRatings FROM ratings');
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const allowed = ['name', 'email', 'address', 'role', 'created_at'];
    const col = allowed.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role,
        COALESCE(AVG(r.rating), NULL) as avg_rating
      FROM users u
      LEFT JOIN stores s ON s.owner_id = u.id
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE 1=1
    `;
    const params = [];
    if (name) { query += ' AND u.name LIKE ?'; params.push(`%${name}%`); }
    if (email) { query += ' AND u.email LIKE ?'; params.push(`%${email}%`); }
    if (address) { query += ' AND u.address LIKE ?'; params.push(`%${address}%`); }
    if (role) { query += ' AND u.role = ?'; params.push(role); }
    query += ` GROUP BY u.id ORDER BY u.${col} ${order}`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/admin/users/:id
const getUserById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.address, u.role,
        s.id as store_id, s.name as store_name,
        COALESCE(AVG(r.rating), NULL) as avg_rating
      FROM users u
      LEFT JOIN stores s ON s.owner_id = u.id
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE u.id = ?
      GROUP BY u.id
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/admin/users
const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const validRoles = ['admin', 'normal_user', 'store_owner'];
    if (!validRoles.includes(role)) return res.status(400).json({ message: 'Invalid role' });

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, address || null, role]
    );
    res.status(201).json({ id: result.insertId, name, email, address, role });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/admin/stores
const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const allowed = ['name', 'email', 'address', 'avg_rating'];
    const col = allowed.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `
      SELECT s.id, s.name, s.email, s.address,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as total_ratings,
        u.name as owner_name
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      LEFT JOIN users u ON u.id = s.owner_id
      WHERE 1=1
    `;
    const params = [];
    if (name) { query += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
    if (email) { query += ' AND s.email LIKE ?'; params.push(`%${email}%`); }
    if (address) { query += ' AND s.address LIKE ?'; params.push(`%${address}%`); }
    query += ` GROUP BY s.id ORDER BY ${col === 'avg_rating' ? 'avg_rating' : `s.${col}`} ${order}`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/admin/stores
const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    const [existing] = await db.query('SELECT id FROM stores WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ message: 'Store email already registered' });

    if (owner_id) {
      const [owner] = await db.query('SELECT id, role FROM users WHERE id = ?', [owner_id]);
      if (owner.length === 0) return res.status(404).json({ message: 'Owner not found' });
      if (owner[0].role !== 'store_owner') {
        await db.query('UPDATE users SET role = ? WHERE id = ?', ['store_owner', owner_id]);
      }
    }

    const [result] = await db.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address || null, owner_id || null]
    );
    res.status(201).json({ id: result.insertId, name, email, address, owner_id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getDashboard, getUsers, getUserById, createUser, getStores, createStore };
