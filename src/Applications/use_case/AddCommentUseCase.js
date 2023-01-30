const CreateComment = require('../../Domains/comments/entities/CreateComment')

class AddCommentUseCase {
  constructor ({ commentRepository, threadRepository }) {
    this.commentRepository = commentRepository
    this.threadRepository = threadRepository
  }

  async execute (useCasePayload, threadId, userId) {
    await this.threadRepository.checkAddedThreadById(threadId)
    const createComment = new CreateComment(useCasePayload)
    return this.commentRepository.addComment(createComment, threadId, userId)
  }
}

module.exports = AddCommentUseCase
