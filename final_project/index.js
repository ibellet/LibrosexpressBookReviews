// Importing necessary modules
const express = require("express"); // Importing Express.js module for creating the server
const jwt = require("jsonwebtoken"); // Importing JWT (JSON Web Token) module for user authentication
const session = require("express-session"); // Importing Express session module for managing user sessions
const customer_routes = require("./router/auth_users.js").authenticated; // Importing routes for authenticated customers
const genl_routes = require("./router/general.js").general; // Importing general routes

// Creating an instance of Express application
const app = express();

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Middleware for managing sessions for the '/customer' route
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer", // Secret key used to sign the session ID cookie
    resave: true, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store
  })
);

// Middleware for authenticating users for specific routes under '/customer/auth'
app.use("/customer/auth/*", function auth(req, res, next) {
  // Checking if the user has a session authorization
  if (req.session.authorization) {
    // Retrieving the access token and username from the session
    token = req.session.authorization["accessToken"];
    userName = req.session.authorization["userName"];
    // Verifying the JWT token
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        // If token verification succeeds, attaching the user information to the request object
        req.user = user;
        req.userName = userName;
        next(); // Proceed to the next middleware or route handler
      } else {
        // If token verification fails, sending a 403 Forbidden response
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    // If user doesn't have session authorization, sending a 403 Forbidden response
    return res.status(403).json({ message: "User not logged in" });
  }
});

// Setting the port number for the server
const PORT = 5000;

// Attaching the customer and general routes to the Express application
app.use("/customer", customer_routes); // Routes for authenticated customers
app.use("/", genl_routes); // General routes

// Starting the server and listening on the specified port
app.listen(PORT, () => console.log("Server is running"));
