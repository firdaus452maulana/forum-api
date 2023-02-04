/* eslint-disable no-undef */
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase')

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCaseParameter = {
      threadId: 'thread-123'
    }
    const expectedGetThread = {
      id: 'thread-123',
      title: 'thread-title',
      body: 'thread-body',
      date: '2023-02-02T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicodingNew',
          date: '2023-02-02T07:22:33.555Z',
          content: 'comment-content'
        },
        {
          id: 'comment-456',
          username: 'dicodingNew',
          date: '2023-02-02T07:22:33.555Z',
          content: '**komentar telah dihapus**'
        }
      ]
    }
    const expectedThread = {
      id: 'thread-123',
      title: 'thread-title',
      body: 'thread-body',
      date: '2023-02-02T07:19:09.775Z',
      username: 'dicoding'
    }
    const expectedComments = [
      {
        id: 'comment-123',
        username: 'dicodingNew',
        date: '2023-02-02T07:22:33.555Z',
        content: 'comment-content'
      },
      {
        id: 'comment-456',
        username: 'dicodingNew',
        date: '2023-02-02T07:22:33.555Z',
        content: '**komentar telah dihapus**'
      }
    ]

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread))
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments))

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    const getThread = await getDetailThreadUseCase.execute(useCaseParameter.threadId)

    // Assert
    expect(getThread).toStrictEqual(expectedGetThread)
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCaseParameter.threadId)
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(
      useCaseParameter.threadId)
  })
})
