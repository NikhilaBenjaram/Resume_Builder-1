const utils = require("./utils");
const xss = require("xss");

module.exports = async (app) => {
  app.use((req, res, next) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    next();
  });

  app.use((req, res, next) => {
    for (const key in req.body) {
      if (Object.hasOwnProperty.call(req.body, key)) {
        if (typeof req.body[key] == "string")
          req.body[key] = xss(req.body[key].trim());
      }
    }
    for (const key in req.query) {
      if (Object.hasOwnProperty.call(req.query, key)) {
        if (typeof req.body[key] == "string")
          req.query[key] = xss(req.query[key].trim());
      }
    }
    for (const key in req.params) {
      if (Object.hasOwnProperty.call(req.params, key)) {
        if (typeof req.body[key] == "string")
          req.params[key] = xss(req.params[key].trim());
      }
    }
    next();
  });

  app.use("/user/:id", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent(
            "You need to be logged in to view your User Profile!"
          )
      );
    }
    next();
  });

  app.use("/users/delete", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent(
            "You need to be logged in to delete a user profile!"
          )
      );
    }
    next();
  });

  app.use("/user", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent(
            "You need to be logged in to view your user profile!"
          )
      );
    }
    next();
  });

  
  // app.use("/chat", (req, res, next) => {
  //   if (!utils.isUserLoggedIn(req)) {
  //     return res.redirect(
  //       "/login?error=" +
  //         encodeURIComponent("You need to be logged in to chat!")
  //     );
  //   }
  //   next();
  // });

};
