const pool = require('../db/pool');

exports.allMsgs = async (req, res) => {
    try {
        const { rows: messages } = await pool.query(`
            SELECT m.id, u.username, m.title, m.text, m.created_at
            FROM messages m
            LEFT JOIN users u
            ON m.user_id = u.id`);
        res.render('msg-board', { messages, user: req.user });
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).send('Error retrieving messages');
    }
}
exports.addMsg = async (req, res) => {
    try {
        await pool.query('INSERT INTO messages (user_id, title, text) VALUES ($1, $2, $3)', [
            req.body.user,
            req.body.title,
            req.body.text,
          ]);
          res.redirect('/msg-board')
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).send('Error creating message');
    }
}

exports.deleteMsg = async (req, res) => {
    const { id } = req.params;

    if (req.user && req.user.mem_status === 'admin') {
        try {
            await pool.query('DELETE FROM messages WHERE id = $1', [id]);
            res.redirect('/msg-board');
        } catch (error) {
            res.status(500).send('Error deleting message.');
        }
    } else {
        res.status(403).send('Access denied. Admins only.');
    }
}