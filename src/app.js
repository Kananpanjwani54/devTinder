// const express = require("express");

// // create app
// const app = express();


// // GET route
// app.get("/user", (req, res) => {
//   res.send({ firstname: "Kanan", lastname: "Panjwani" });
// });

// // POST route (save user)
// app.post("/user", async (req, res) => {
//   console.log(req.body);
//   res.send("Data successfully saved to database!");
// });

// // DELETE route (delete by id)
// app.delete("/user", async (req, res) => {
//   res.send(`Data successfully deleted`);
// });


// // parameter req
// app.get("/user/:userId", (req, res) => {
//     console.log(req.params);
//     // console.log(req.params.password);

//     // { userId: '100' }
//     res.send(`User ID is ${req.params.userId}`);
// });


//multiple param req
// app.get("/user/:userId/:password/:name", (req, res) => {
//     console.log(req.params);
//     // Example output: { userId: '100', password: 'abc123', name: 'kanan' }

//     res.send(
//         `User ID is ${req.params.userId}, Password is ${req.params.password}, Name is ${req.params.name}`
//     );
// });

// app.get("/user", 
//   (req, res, next) => {
//     console.log("Handler 1");
//     next(); // moves to Handler 2
//   }, 
//   (req, res, next) => {
//     console.log("Handler 2");
//     res.send("Final response from Handler 2");  //it will be printed 
//   }
// );

//Array of Route handler
// app.use("/test",[h1,h2],h3)


// app.get("/test",[
//   (req, res, next) => {
//     console.log("Handler 1");
//     next();
    
//   },
//   (req, res, next) => {
//     console.log("Handler 2");
//     next();
//   },
//   (req, res, next) => {
//     console.log("Handler 3");
//     next();
//   },
//   (req, res) => {
//     console.log("Handler 4");
//     res.send("Response from last handler");
//   }
// ]);


// Middleware applied on "/"
// app.use("/", (req, res, next) => {
//   // res.send("Handling / route");  // commented
//   next();
// });

// app.get("/user", [
//   (req, res, next) => {
//     console.log("Handling /user route");
//     // next();  // moves to next handler
//   },
//   (req, res, next) => {
//     res.send("1st Route Handler");
//     // ❌ if you don’t call next(), chain ends here
//   },
//   (req, res, next) => {
//     res.send("2nd Route Handler");
//   }
// ]);

//app.use -->use for middleware ,app.get-->route handler
// app.use("/",(req,res,next)=>{
//   // res.send("Handling / route");-->if 2 route responded then error

//   next();
// });
// //chanining of middleware
// app.get(
//   "/user",
//   (req, res, next) => {
//     console.log("Handling /user route");
//     next();
//   },
//   (req, res, next) => {
//     res.send("1st Route Handler");
//   },
//   (req, res, next) => {
//     res.send("2nd Route Handler");
//   }
// );



//Notes-->Ab addmin data access karega to kaise pata chalega ki admin hi h isliye token check hua h 
// aur middleware use hua h taki jitna bhi /admin ho wo acces ho jayeg

// ✅ Middleware for checking admin authorization
const express = require("express");
// const { adminAuth,userAuth } = require("./middleware/auth");  // ✅ relative path

// const app = express();

// // ✅ Apply middleware globally to all /admin routes
// app.use("/admin", adminAuth);
// app.use("/user",userAuth);
// //  Routes
// app.get("/admin/login", (req, res) => {
//   console.log("app data sent");
//   res.send("All Data Sent");
// });
// app.get("/user",userAuth,(req, res) => {
//   console.log("USER  data sent");
//   res.send("User Data Sent");
// });

// app.get("/admin/getAllData", (req, res) => {
//   console.log("app data sent");
//   res.send("All Data Sent");
// });

// app.get("/admin/deleteUser", (req, res) => {
//   console.log("app data deleted");
//   res.send("Deleted a user");
// });

//Error






// ✅ Start server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
