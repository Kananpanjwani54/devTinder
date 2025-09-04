const adminAuth=(req, res, next)=> {
  const token = "xyz"; // pretend token (usually comes from headers or cookies)
  const isAdminAuthorized = token === "xyz";

  if (isAdminAuthorized) {
    next(); // pass control to the next middleware/route handler
  } else {
    res.status(401).send("Unauthorized request");
  }
};

const userAuth=(req, res, next)=> {
  const token = "xyz"; // pretend token (usually comes from headers or cookies)
  const isUserAuthorized = token === "xyz";

  if (isUserAuthorized) {
    next(); // pass control to the next middleware/route handler
  } else {
    res.status(401).send("Unauthorized request");
  }
};

module.exports={
    adminAuth,
    userAuth,
}