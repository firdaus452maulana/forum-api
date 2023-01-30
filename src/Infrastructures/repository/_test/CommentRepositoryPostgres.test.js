/* eslint-disable no-undef */
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const CreateComment = require('../../../Domains/comments/entities/CreateComment')
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('verifyCommentOwner function', () => {
    it('should not throw NotFoundError when user as an owner and comment found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-345', username: 'dicodingNew', password: 'secret', fullname: 'Dicoding Indonesia New' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'thread-title', body: 'thread-body', owner: 'user-345' })
      await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'comment-content', threadId: 'thread-123', owner: 'user-345' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-345')).resolves.not.toThrowError(NotFoundError)
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-345')).resolves.not.toThrowError(AuthorizationError)
    })

    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-xxx', '')).rejects.toThrowError(NotFoundError)
    })

    it('should not throw AuthorizationError when user not owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-345', username: 'dicodingNew', password: 'secret', fullname: 'Dicoding Indonesia New' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'thread-title', body: 'thread-body', owner: 'user-345' })
      await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'comment-content', threadId: 'thread-123', owner: 'user-345' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).rejects.toThrowError(AuthorizationError)
    })
  })

  describe('checkAddedCommentById function', () => {
    it('should not throw NotFoundError when comment found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-345', username: 'dicodingNew', password: 'secret', fullname: 'Dicoding Indonesia New' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'thread-title', body: 'thread-body', owner: 'user-345' })
      await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'comment-content', threadId: 'thread-123', owner: 'user-345' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentRepositoryPostgres.checkAddedCommentById('comment-123')).resolves.not.toThrowError(NotFoundError)
    })

    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentRepositoryPostgres.checkAddedCommentById('comment-xxx')).rejects.toThrowError(NotFoundError)
    })
  })

  describe('addComment function', () => {
    it('should persist create comment and return created comment correctly', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'comment-content'
      })
      const threadId = 'thread-123'
      const userId = 'user-345'
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicodingNew' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'thread-title', body: 'thread-body', owner: userId })
      const fakeIdGenerator = () => '123' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await commentRepositoryPostgres.addComment(createComment, threadId, userId)

      // Assert
      const comment = await CommentsTableTestHelper.getCommentById('comment-123')
      expect(comment).toHaveLength(1)
    })

    it('should return created comment correctly', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'comment-content'
      })
      const threadId = 'thread-123'
      const userId = 'user-345'
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicodingNew' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'thread-title', body: 'thread-body', owner: userId })
      const fakeIdGenerator = () => '123' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const createdComment = await commentRepositoryPostgres.addComment(createComment, threadId, userId)

      // Assert
      expect(createdComment).toStrictEqual(new CreatedComment({
        id: 'comment-123',
        content: createComment.content,
        owner: userId
      }))
    })
  })

  describe('getCommentByThreadId', () => {
    it('should return id, username, date, content when comment is found', async () => {
      // Arrange
      const threadId = 'thread-123'
      const userId = 'user-345'
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicodingNew' })
      await ThreadsTableTestHelper.addThread({ id: threadId, title: 'thread-title', body: 'thread-body', owner: userId })
      const createdComment = await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'comment-content', threadId, owner: 'user-345' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})
      const expectedComment = {
        id: 'comment-123',
        username: 'dicodingNew',
        date: createdComment,
        content: 'comment-content',
        is_delete: false
      }

      // Action & Assert
      const accuiredComment = await commentRepositoryPostgres.getCommentByThreadId(threadId)
      expect(accuiredComment[0]).toStrictEqual(expectedComment)
    })
  })

  describe('deleteComment', () => {
    it('should persist delete comment and return deleted comment correctly', async () => {
      // Arrange
      const threadId = 'thread-123'
      const userId = 'user-345'
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicodingNew' })
      await ThreadsTableTestHelper.addThread({ id: threadId, title: 'thread-title', body: 'thread-body', owner: userId })
      await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'comment-content', threadId, owner: 'user-345' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123', threadId)

      // Assert
      const comment = await CommentsTableTestHelper.getDeletedCommentById('comment-123')
      expect(comment).toHaveLength(1)
    })
  })
})
