const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadsTableTestHelper = {
  async addThread ({
    id, title, body, owner
  }) {
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING date',
      values: [id, title, body, owner, date]
    }

    const result = await pool.query(query)
    return result.rows[0].date
  },

  async getThreadById (id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM threads')
  }
}

module.exports = ThreadsTableTestHelper
