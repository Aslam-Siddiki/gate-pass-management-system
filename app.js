// Install dotenv: npm install dotenv
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

// Express and Middleware:
const express = require("express"); // Requiring Express:
const app = express(); // Express function execution:
const mongoose = require("mongoose"); // Mongoose library from MongoDB:
const port = process.env.PORT || 8080; // Port number:
const methodOverride = require("method-override"); // Middleware to send PUT, PATCH and  DELETE request:
const path = require("path"); // To connect Path:
const ejsMate = require("ejs-mate"); // for dynamic page: 
const session = require("express-session"); // Express session:
const flash = require("connect-flash"); // To flash information:

// const MongoStore = require("connect-mongo");
const MongoStore = require("connect-mongo");
const Store = MongoStore.default || MongoStore;

// Route folder Path:
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const gatepassRoutes = require("./routes/gatepassRoutes");

// Database connection:
const DB_URL = process.env.MONGO_URL;
main()
    .then(() => {
        console.log("✅ Database connection established")
    })
    .catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect(DB_URL);
}

// Setting path:
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

app.set("trust proxy", 1);

const store = Store.create({
    mongoUrl: process.env.MONGO_URL,
    touchAfter: 24 * 3600
});

store.on("error", () => {
    console.log("SESSION STORE ERROR", err);
});

// Session:
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: store,

    cookie:{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24  // 24 hours
    }
}));

// Flash messages and Current Session:
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.session.userId;
    res.locals.role = req.session.role;
    next();
});

// Router API:
app.use("/auth", authRoutes);        // login, register choice
app.use("/student", studentRoutes);  // student features
app.use("/admin", adminRoutes);      // admin features
app.use("/gatepass", gatepassRoutes); // gatepass routes

//Home:
app.get("/", async (req, res) => {
    
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const todayDate = today.getDate();

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const todayText = today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    res.render("home/guest", {
        year,
        month,
        days,
        firstDay,
        todayDate,
        todayText,
    });

});

// 1. 404 handler — for unknown routes (3 params)
app.use((req, res) => {
    res.status(404).render("404"); 
});

// 2. Error handler — for app errors 
// (4 params, must have all 4)
app.use((err, req, res, next) => {
    const { 
        statusCode = 500, 
    } = err;
    res.status(statusCode).render("error", { err });
});

// BACKEND CONNECTION:
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});


