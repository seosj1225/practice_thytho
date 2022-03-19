export const locals = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn)  // undefined, true, false
    res.locals.userid = req.session.userid              // 로그인후 루트(/)에서 표시될 아이디
    next()
}