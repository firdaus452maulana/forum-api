const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const CreatedComment = require('../../Domains/comments/entities/CreatedComment')
const CommentRepository = require('../../Domains/comments/CommentRepository')

class CommentRepositoryPostgres extends CommentRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async verifyCommentOwner (id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Comment tidak ditemukan')
    }
    const comment = result.rows[0]
    if (comment.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }
  }

  async checkAddedCommentById (id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan')
    }
    return result.row
  }

  async addComment (createComment, threadId, owner) {
    const { content } = createComment
    const id = `comment-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, threadId, owner, false, date]
    }

    const result = await this._pool.query(query)

    return new CreatedComment({ ...result.rows[0] })
  }

  async getCommentByThreadId (threadId) {
    const query = {
      text: `SELECT comments.id, comments.date, comments.content, users.username FROM comments
        INNER JOIN users ON users.id = owner 
        WHERE comments.thread_id = $1`,
      values: [threadId]
    }

    const result = await this._pool.query(query)

    return result.rows[0]
  }

  async deleteComment (id, threadId) {
    const query = {
      text: `UPDATE comments SET is_delete = $3 
          WHERE id = $1 AND thread_id = $2
          RETURNING id`,
      values: [id, threadId, true]
    }

    const result = await this._pool.query(query)

    return result.rows[0].id
  }
}

module.exports = CommentRepositoryPostgres
