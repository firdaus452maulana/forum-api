const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentsTableTestHelper = {
  async addComment ({
    id = 'comment-123', content = 'comment-content', threadId = 'thread-123', owner = 'user-123'
  }) {
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
      values: [id, content, threadId, owner, date]
    }

    await pool.query(query)
  },

  async deleteComment ({
    id = 'comment-123', threadId = 'thread-123'
  }) {
    const date = new Date().toISOString()
    const content = '**komentar telah dihapus**'

    const query = {
      text: 'UPDATE comments SET content = $2, updated_at = $3 WHERE id = $1 AND thread_id = $4',
      values: [id, content, date, threadId, threadId]
    }

    await pool.query(query)
  },

  async cleanTable () {
    await pool.query('TRUNCATE TABLE comments')
  }
}

module.exports = CommentsTableTestHelper
