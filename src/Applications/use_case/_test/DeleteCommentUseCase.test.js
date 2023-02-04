/* eslint-disable no-undef */
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the deleted comment action correctly', async () => {
    // Arrange
    const useCaseParameter = {
      threadId: 'thread-123',
      commentId: 'comment-123'
    }
    const userId = 'user-123'
    const expectedDeletedComment = {
      id: 'comment-123'
    }

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    /** mocking needed function */
    mockThreadRepository.checkAddedThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDeletedComment))

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    const deletedComment = await deleteCommentUseCase.execute(useCaseParameter.commentId, useCaseParameter.threadId, userId)

    // Assert
    expect(deletedComment).toStrictEqual(expectedDeletedComment)
    expect(mockThreadRepository.checkAddedThreadById).toBeCalledWith(
      useCaseParameter.threadId)
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCaseParameter.commentId, userId)
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      useCaseParameter.commentId, useCaseParameter.threadId)
  })
})
