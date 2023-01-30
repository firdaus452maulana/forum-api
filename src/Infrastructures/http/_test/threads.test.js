/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    it('should response 401 when not authorize', async () => {
      // Arrange
      const requestPayload = {
        title: 'thread-title',
        body: 'thread-body'
      }

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 201 and persisted thread', async () => {
      const requestPayload = {
        title: 'thread-title',
        body: 'thread-body'
      }

      const server = await createServer(container)

      /* add user and gain access token */
      const serverHelper =
          await ServerTestHelper.createUserAndGetAccessToken(server)

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${serverHelper.token}`
        }
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
    })
  })

  describe('when GET /threads/{threadId}', () => {
    it('should response 201 and persisted thread', async () => {
      const threadId = 'thread-123'

      const server = await createServer(container)

      // Add Thread and Comment
      await UsersTableTestHelper.addUser({ id: 'user-890', username: 'dicoding-890' })
      await UsersTableTestHelper.addUser({ id: 'user-567', username: 'dicoding-567' })
      await ThreadsTableTestHelper.addThread({ id: threadId, title: 'thread-title', body: 'thread-body', owner: 'user-890' })
      await CommentsTableTestHelper.addComment({ id: 'comment-234', content: 'comment-content 1', threadId, owner: 'user-567' })
      await CommentsTableTestHelper.addComment({ id: 'comment-432', content: 'comment-content 2', threadId, owner: 'user-567' })

      // action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread).toBeDefined()
    })
  })
})
