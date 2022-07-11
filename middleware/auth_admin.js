const { User } = require("../model")
const { verify } = require("../util/jwt")
const { jwtSecret } = require("../config/config.default")

module.exports = async (req, res, next) => {
  let token = req.headers.authorization

  token = token ? token.split("Bearer ")[1] : null

  if (!token) {
    return res.status(401).end()
  }

  try {
    //Verify that the token is valid
    const decodedToken = await verify(token, jwtSecret)

    // Mount the admin information to the request object
    req.user = await User.findById(decodedToken.userId)

    if (req.user.is_Admin == "0") {
      return res.status(409).send('Sorry, you are not admin')
    } else if (req.user.is_Admin == "1") {
      next()
    }
  } catch (err) {
    return res.status(401).end()
  }
}