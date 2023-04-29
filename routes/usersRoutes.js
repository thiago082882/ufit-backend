const UsersController = require('../controllers/usersController');

module.exports = (app, upload) => {


// TRAZER DADOS 

app.get('/api/users/getAll',UsersController.getAll);

// GUARDAR DADOS

app.post('/api/users/create', UsersController.register);
app.post('/api/users/login', UsersController.login);

app.put('/api/users/update', upload.array('image', 1), UsersController.update);

app.put('/api/users/updateWithoutImage',UsersController.updateWithoutImage);

}