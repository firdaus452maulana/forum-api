const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadsTableTestHelper = {
  async addThread ({
    id = 'thread-123', title = 'thread-title', body = 'thread-body', owner = 'user-123'
  }) {
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, owner, date]
    }

    await pool.query(query)
  },

  async getThreadById (id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async getDetailThreadById (id) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.created_at FROM threads
        INNER JOIN users ON users.id = owner
        WHERE threads.id = $1`,
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('TRUNCATE TABLE threads')
  }
}

module.exports = ThreadsTableTestHelper
