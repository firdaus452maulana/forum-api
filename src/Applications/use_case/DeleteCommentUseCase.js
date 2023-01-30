class DeleteCommentUseCase {
  constructor ({ commentRepository, threadRepository }) {
    this.commentRepository = commentRepository
    this.threadRepository = threadRepository
  }

  async execute (id, threadId, userId) {
    await this.threadRepository.checkAddedThreadById(threadId)
    await this.commentRepository.verifyCommentOwner(id, userId)
    return await this.commentRepository.deleteComment(id, threadId)
  }
}

module.exports = DeleteCommentUseCase
