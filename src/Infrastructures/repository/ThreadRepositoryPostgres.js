const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const CreatedThread = require('../../Domains/threads/entities/CreatedThread')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async checkAddedThreadById (id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
    }
    return result.row
  }

  async addThread (createThread, owner) {
    const { title, body } = createThread
    const id = `thread-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date]
    }

    const result = await this._pool.query(query)

    return new CreatedThread({ ...result.rows[0] })
  }

  async getThreadById (id) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username FROM threads 
        INNER JOIN users ON users.id = owner 
        WHERE threads.id = $1`,
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
    }

    return result.rows[0]
  }
}

module.exports = ThreadRepositoryPostgres
