const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }
    console.log(password);

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  // Dùng passport-local 
  // 1 là option, ở đây username phải là dạng email. 2 là hàm xử lý
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  // 2 middleware, 1 là local check username password như trên, 2 là session serialized
  // middleware này có 2 hàm serializeUser để lưu user vào session và deserializeUser để truyền data đi.
  passport.serializeUser((user, done) => {
    console.log("Run to serialize");
    console.log(user);
    done(null, user.id);
  })
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize

/*
Luồng: khi gọi vào url mà dùng middleware passport sẽ chạy strategy bắt 2 trường username và password, và tùy vào gọi done false hay thành công mà cho kết quả tương ứng -> tiếp theo nó tự chạy vào serialize để mọi request kể từ h đều dùng được biến user
Hỗ trợ đủ các hàm register, login, logout
*/