const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentsTableTestHelper = {
  async addComment ({
    id, content, threadId, owner
  }) {
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)  RETURNING date',
      values: [id, content, threadId, owner, false, date]
    }

    const result = await pool.query(query)
    return result.rows[0].date
  },

  async getCommentById (id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async getDeletedCommentById (id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND is_delete = $2',
      values: [id, true]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM comments')
  }
}

module.exports = CommentsTableTestHelper
