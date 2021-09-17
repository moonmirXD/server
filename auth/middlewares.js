const jwt = require("jsonwebtoken");
function checkTokenUser(req, res, next) {
  const authHeader = req.get("authorization");
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
        if (err) {
          console.log(err);
        }
        req.user = user;
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
}

module.exports = {
  checkTokenUser,
};
