/* eslint-disable no-undef */
const CreateComment = require('../../../Domains/comments/entities/CreateComment')
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddCommentUseCase = require('../AddCommentUseCase')

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCaseParameter = {
      threadId: 'thread-123'
    }
    const useCasePayload = {
      content: 'thread-title'
    }
    const expectedCreatedComment = new CreatedComment({
      id: 'comment-123',
      content: 'comment-content',
      owner: 'user-123'
    })

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    /** mocking needed function */
    mockThreadRepository.checkAddedThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedCreatedComment))

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    const createdComment = await addCommentUseCase.execute(useCasePayload, useCaseParameter, expectedCreatedComment.owner)

    // Assert
    expect(createdComment).toStrictEqual(expectedCreatedComment)
    expect(mockCommentRepository.addComment).toBeCalledWith(new CreateComment({
      content: useCasePayload.content
    }), useCaseParameter, expectedCreatedComment.owner)
  })
})
