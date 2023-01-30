class GetDetailThreadUseCase {
  constructor ({ commentRepository, threadRepository }) {
    this.commentRepository = commentRepository
    this.threadRepository = threadRepository
  }

  async execute (threadId) {
    const thread = await this.threadRepository.getThreadById(threadId)
    const comments = await this.commentRepository.getCommentByThreadId(threadId)
    thread.comments = this._checkDeletedComment(comments)
    return thread
  }

  _checkDeletedComment (comments) {
    comments.forEach((comment) => {
      comment.content = comment.is_delete ? '**komentar telah dihapus**' : comment.content
      delete comment.is_delete
    })
    return comments
  }
}

module.exports = GetDetailThreadUseCase
