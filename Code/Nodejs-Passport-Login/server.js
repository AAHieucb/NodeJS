const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')

initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.use(flash()); // Dùng express-flash thì mọi request sẽ có hàm req.flash() để truyền message
app.use(session({
  cookies: { secure: true },
  secret: "test",
  resave: true, // K resave khi k có sự thay đổi
  saveUninitialized: true // Lưu cả các giá trị empty
}))

app.use(passport.initialize()); // Mỗi request có thêm 4 hàm: req.login(), req.logout(), req.isAuthenticated(), req.isUnauthenticated()

app.use(passport.session()) // Lưu trong session

/*
Dùng method-override giúp override các method mà client k support nên k gọi được.
VD: Client k support put method
Phía server dùng: app.use(methodOverride('X-HTTP-Method-Override'))
Phía client gọi: POST vào / và header có trường (X-HTTP-Method-Override: "PUT")
=> Nó sẽ tự động bắt và biến thành PUT vào / xử lý bên server. Middleware này nên đặt trước mọi middleware khác
*/
// Có thể override với query string. VD: dùng như dưới và gọi POST vào ?_method=DELETE thì server sẽ chạy biến POST thành DELETE
app.use(methodOverride('_method'))

app.get("/test", (req, res) => {
  res.send(req.user.name);
})

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name });
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: "Invalid username or password", // failureFlash: true
  successFlash: "Welcome!",
  // Tự truyền vào file html flash message là message.error
}), function(req, res){ // Thừa vì có successRedirect r
  res.redirect("/success");
});

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  console.log("checkNotAuthenticated");
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)

