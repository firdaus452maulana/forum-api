/* eslint-disable no-undef */
const CreateThread = require('../CreateThread')

describe('a CreateThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      body: 'abc'
    }

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 1234567890,
      body: 'abc'
    }

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create registerUser object correctly', () => {
    // Arrange
    const payload = {
      title: 'title',
      body: 'body'
    }
    // Action
    const { title, body } = new CreateThread(payload)

    // Assert
    expect(title).toEqual(payload.title)
    expect(body).toEqual(payload.body)
  })
})
