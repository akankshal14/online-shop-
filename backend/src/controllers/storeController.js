const db = require('../config/db');

// GET /api/stores — Normal user: list + search
const getStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const allowed = ['name', 'address', 'avg_rating'];
    const col = allowed.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `
      SELECT s.id, s.name, s.address, s.email,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as total_ratings,
        ur.rating as user_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = ?
      WHERE 1=1
    `;
    const params = [req.user.id];
    if (name) { query += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
    if (address) { query += ' AND s.address LIKE ?'; params.push(`%${address}%`); }
    query += ` GROUP BY s.id ORDER BY ${col === 'avg_rating' ? 'avg_rating' : `s.${col}`} ${order}`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/stores/:id/rating — Submit or update rating
const submitRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const storeId = req.params.id;
    const userId = req.user.id;

    const [store] = await db.query('SELECT id FROM stores WHERE id = ?', [storeId]);
    if (store.length === 0) return res.status(404).json({ message: 'Store not found' });

    await db.query(
      `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
      [userId, storeId, rating]
    );

    const [[{ avg_rating }]] = await db.query(
      'SELECT COALESCE(AVG(rating), 0) as avg_rating FROM ratings WHERE store_id = ?',
      [storeId]
    );

    res.json({ message: 'Rating submitted', avg_rating: parseFloat(avg_rating).toFixed(1) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/stores/owner/dashboard — Store owner dashboard
const getOwnerDashboard = async (req, res) => {
  try {
    const [storeRows] = await db.query('SELECT * FROM stores WHERE owner_id = ?', [req.user.id]);
    if (storeRows.length === 0) return res.status(404).json({ message: 'No store found for this owner' });

    const store = storeRows[0];
    const [[{ avg_rating }]] = await db.query(
      'SELECT COALESCE(AVG(rating), 0) as avg_rating FROM ratings WHERE store_id = ?',
      [store.id]
    );

    const [raters] = await db.query(`
      SELECT u.id, u.name, u.email, r.rating, r.updated_at
      FROM ratings r
      JOIN users u ON u.id = r.user_id
      WHERE r.store_id = ?
      ORDER BY r.updated_at DESC
    `, [store.id]);

    res.json({
      store: { ...store, avg_rating: parseFloat(avg_rating).toFixed(1) },
      raters
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getStores, submitRating, getOwnerDashboard };
