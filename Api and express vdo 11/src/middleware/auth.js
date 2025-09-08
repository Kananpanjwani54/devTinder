//pichley code ke hain

// const adminAuth=(req, res, next)=> {
//   const token = "xyz"; // pretend token (usually comes from headers or cookies)
//   const isAdminAuthorized = token === "xyz";

//   if (isAdminAuthorized) {
//     next(); // pass control to the next middleware/route handler
//   } else {
//     res.status(401).send("Unauthorized request");
//   }
// };

// const userAuth=(req, res, next)=> {
//   const token = "xyz"; // pretend token (usually comes from headers or cookies)
//   const isUserAuthorized = token === "xyz";

//   if (isUserAuthorized) {
//     next(); // pass control to the next middleware/route handler
//   } else {
//     res.status(401).send("Unauthorized request");
//   }
// };

// module.exports={
//     adminAuth,
//     userAuth,
// }

//authentication ke logic 

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const SECRET_KEY = "KAnan@#$";

const userauth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Invalid token: token is missing.");
    }

    // verify token
    const decoded = jwt.verify(token, SECRET_KEY);
    const { userId } = decoded;

    // check user in DB
    const user = await User.findById(userId);
    console.log("logged in user is " + userId);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // attach user to request for later use
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send("Invalid or expired token.");
  }
};

module.exports = userauth;
