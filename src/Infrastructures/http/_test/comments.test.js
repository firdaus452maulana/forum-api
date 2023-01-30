/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads/{}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
  })

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 when not authorize', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment-content'
      }
      const threadId = 'thread-123'
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 201 and persisted comment', async () => {
      const requestPayload = {
        content: 'comment-content'
      }
      const threadId = 'thread-123'
      const server = await createServer(container)

      /* add user and gain access token */
      const serverHelper = await ServerTestHelper.createUserAndGetAccessToken(server)
      /* add thread */
      await ThreadsTableTestHelper.addThread({ id: threadId, title: 'thread-title', body: 'thread-body', owner: serverHelper.userId })

      // action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${serverHelper.token}`
        }
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedComment).toBeDefined()
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 when not authorize', async () => {
      // Arrange
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 201 and persisted comment', async () => {
      const requestPayload = {
        content: 'comment-content'
      }
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const server = await createServer(container)

      /* add user and gain access token */
      const serverHelper = await ServerTestHelper.createUserAndGetAccessToken(server)
      /* add thread */
      await ThreadsTableTestHelper.addThread({ id: threadId, title: 'thread-title', body: 'thread-body', owner: serverHelper.userId })
      await CommentsTableTestHelper.addComment({ id: commentId, content: 'comment-content', threadId, owner: serverHelper.userId })

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${serverHelper.token}`
        }
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
