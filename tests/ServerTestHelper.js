const ServerTestHelper = {
  async createUserAndGetAccessToken (server) {
    const userPayload = {
      username: 'dicodingNew',
      password: 'secret',
      fullname: 'Dicoding Indonesia'
    }

    const authPayload = {
      username: 'dicodingNew',
      password: 'secret'
    }

    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload
    })

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: authPayload
    })

    const responseUserJson = JSON.parse(responseUser.payload)
    const responseAuthJson = JSON.parse(responseAuth.payload)

    return { userId: responseUserJson.data.addedUser.id, token: responseAuthJson.data.accessToken }
  }
}

module.exports = ServerTestHelper
