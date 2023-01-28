/* eslint-disable no-undef */
const CreateComment = require('../CreateComment')

describe('a CreateComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 1234567890
    }

    // Action and Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create createComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'title'
    }
    // Action
    const { content } = new CreateComment(payload)

    // Assert
    expect(content).toEqual(payload.content)
  })
})
