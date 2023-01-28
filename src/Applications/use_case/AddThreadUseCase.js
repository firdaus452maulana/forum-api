const CreateThread = require('../../Domains/threads/entities/CreateThread')

class AddThreadUseCase {
  constructor ({ threadRepository }) {
    this.threadRepository = threadRepository
  }

  async execute (userId, useCasePayload) {
    const createThread = new CreateThread(useCasePayload)
    return this.threadRepository.addThread(createThread, userId)
  }
}

module.exports = AddThreadUseCase
