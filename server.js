const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static(path.join(__dirname, "Client")));

app.use(
  session({
    secret: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6", // Change this to something stronger in production
    resave: false,
    saveUninitialized: false,
  })
);

const users = [
  { username: "wahid123", password: "123" },
  { username: "sohaib456", password: "456" },
];

// Serve the login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Client/index.html"));
});

// Home page protection with session
app.get("/Pages/home.html", (req, res) => {
  // Debug: log session info
  console.log("Session info:", req.session.user);

  if (req.session.user) {
    res.sendFile(path.join(__dirname, "Client/Pages/home.html"));
  } else {
    res.redirect("/"); // Redirect to login page if not logged in
  }
});

// Handle login POST request
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(404).json({ message: "Username not found" });
  }

  res.status(201).json({
    message: "Wrong password.",
  });

  if (user.password !== password) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  // Success: store user in session
  req.session.user = { username: user.username };

  // After successful login, send a success message
  res.status(200).json({ message: "Login successful" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
