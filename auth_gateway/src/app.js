const express = require('express');
const jwt = require('jsonwebtoken');
const { Database } = require('./database/client');
const { Migrator } = require('./database/migrator');
const { UserController } = require('./controller/user_controller');

Database.init();
Migrator.migrateAll();

const app = express();
app.use(express.json());

// register new user
app.post('/sign_up', async (req, res) => {
    UserController.create(req, res);
});

// grant new token (other tokens can exist)
app.post('/sign_in', async (req, res) => {
    UserController.login(req, res);
});

// expire this token
app.post('/sign_out', async (req, res) => {
    UserController.logout(req, res);
});

// expire all tokens
app.post('/sign_out_all', async (req, res) => {
    UserController.logout_all(req, res);
});

// hash new password and save, salt stays the same
app.post('/change_password', async (req, res) => {
    UserController.change_password(req, res);
});

// show bearer token, if valid return 200, else, return 403
app.post('/verify_login', async (req, res) => {
    UserController.validate_user(req, res);
});


// show bearer token, if valid return 200, else, return 403
app.post('/change_user_info', async (req, res) => {
    UserController.change_user_info(req, res);
});


app.get('*', async (req, res) => {
    res.end();
});



app.listen('8080', () => {
    console.log('listening on port 8080');
});

