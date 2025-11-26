var users = [
	{id: 1, name: "User111", email: "user1@gmail.com", age: 31, avatar: 'images/user1.png'}, 
	{id: 2, name: "User2", email: "user2@gmail.com", age: 20, avatar: 'images/user2.png'},
	{id: 3, name: "User1", email: "user1.2@gmail.com", age: 25, avatar: 'images/user3.png'}
];
module.exports = {
    index: function (req, res) {
        res.render('user', {
            users: users
        });
    },
    search: (req, res) => {
        var name_search = req.query.name
        var age_search = req.query.age 
        var result = users.filter( (user) => {
            return user.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1 && user.age === parseInt(age_search)
        })
        res.render('user', {
            users: result 
        });
    },
    getCreate: (req, res) => {
        res.render('createuser')
    },
    postCreate: (req, res) => {
        console.log(req.body)
        users.push(req.body);
        res.redirect('/users')
        // res.render("user", { users: users });
    },
    // redirect gửi 302 để browser GET tiếp url mới. Nếu dùng render sẽ render lên 1 file html mới nhưng vẫn ở trang cũ là users/create là k đúng
    getId: (req, res) => {
        var user = users.find( (user) => {
            return user.id == parseInt(req.params.id);
        });
        res.render('show', {
            user: user
        })
    }
}