/* eslint-disable no-undef */
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const CreateThread = require('../../../Domains/threads/entities/CreateThread')
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('checkAddedThreadById function', () => {
    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-345', username: 'dicodingNew', password: 'secret', fullname: 'Dicoding Indonesia New' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'thread-title', body: 'thread-body', owner: 'user-345' })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(threadRepositoryPostgres.checkAddedThreadById('thread-123')).resolves.not.toThrowError(NotFoundError)
    })

    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(threadRepositoryPostgres.checkAddedThreadById('thread-xxx')).rejects.toThrowError(NotFoundError)
    })
  })

  describe('addThread function', () => {
    it('should persist create thread and return created thread correctly', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'thread-title',
        body: 'thread-body'
      })
      const userId = 'user-345'
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicodingNew' })
      const fakeIdGenerator = () => '123' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await threadRepositoryPostgres.addThread(createThread, userId)

      // Assert
      const thread = await ThreadsTableTestHelper.getThreadById('thread-123')
      expect(thread).toHaveLength(1)
    })

    it('should return created thread correctly', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'thread-title',
        body: 'thread-body'
      })
      const userId = 'user-345'
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicodingNew' })
      const fakeIdGenerator = () => '123' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const createdThread = await threadRepositoryPostgres.addThread(createThread, userId)

      // Assert
      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-123',
        title: createThread.title,
        owner: userId
      }))
    })
  })

  describe('getThreadById', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      return expect(threadRepositoryPostgres.getThreadById('thread-xxx'))
        .rejects
        .toThrowError(NotFoundError)
    })

    it('should return id, title, body, date, username when thread is found', async () => {
      // Arrange
      const userId = 'user-345'
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicodingNew' })
      const createdThread = await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'thread-title', body: 'thread-body', owner: 'user-345' })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})
      const expectedThread = {
        id: 'thread-123',
        title: 'thread-title',
        body: 'thread-body',
        date: createdThread,
        username: 'dicodingNew'
      }

      // Action & Assert
      const accuiredThread = await threadRepositoryPostgres.getThreadById('thread-123')
      expect(accuiredThread).toStrictEqual(expectedThread)
    })
  })
})
