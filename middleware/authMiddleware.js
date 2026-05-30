const validate = (schema, redirectTo) => (req, res, next) => {  // ✅ added redirectTo
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        error.details.forEach((e) => req.flash("error", e.message));
        return res.redirect(redirectTo); 
    }

    req.body = value;
    next();
};

function isLoggedIn(req, res, next){
    if(!req.session.userId){
        req.flash("error","Please login first");
        return res.redirect("/auth/login");
    }
    next();
}

function isAdmin(req, res, next){
    if(!req.session.userId || req.session.role !== "admin"){
        req.flash("error","Access denied. Admin only.");
        return res.redirect("/");
    }
    next();
}

function isStudent(req, res, next){
    if(!req.session.userId || req.session.role !== "student"){
        req.flash("error","Access denied. Students only.");
        return res.redirect("/");
    }
    next();
}

module.exports = { isLoggedIn, isAdmin, isStudent, validate };