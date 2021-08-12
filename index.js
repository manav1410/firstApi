require('dotenv').config();
const express = require('express');

// mongoose connection.
const connectDB = require('./connection');
const userModel = require('./user');

const app = express();
app.use(express.json());// configuration express.



// route : /
// description : To get all user. 
// parameter : none
app.get("/", async (req, res) => {
    try {
        const user = await userModel.find();
        return res.json({ user });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// route : /user/type/:type
// description : To get user by type
// parameter : type (Pro, Premium)
app.get('/user/type/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const user = await userModel.find({ userType: type });

        if (!user) {
            return res.json({ message: 'No user found' });
        }
        else {
            return res.json({ user });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// route : /user/:_id
// description : To get user by id.
// parameter : _id
app.get('/user/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const user = await userModel.findById(_id);
        if (!user) {
            return res.json({ message: 'No user found' });
        }
        else {
            return res.json({ user });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }

});

// route : /user/update/:_id
// description : To update the user.
// parameter : _id
// request body : user object
app.put('/user/update/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const { userData } = req.body;
        const updateUser = await userModel.findByIdAndUpdate(_id,
            { $set: userData },
            { new: true }
        );
        return res.json({ user: updateUser });

    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


// route : /user/delete/:_id
// description: To delete the user
// parameter : _id;
// request body : none
app.put('/user/delete/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        await userModel.findByIdAndDelete(_id);
        return res.json({ message: 'User deleted!' });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// route: /user/delete/
// descrition : to delete the user by type
// parameter : _id
// request body : none
app.put('/user/deleteByType/:userType', async (req, res) => {
    try {
        const { userType } = req.params;
        await userModel.findOneAndDelete({ userType });
        return res.json({ message: 'User deleted' }); 

    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
// route : /user/new
// description : To add new user. 
// parameter : none
//  request body : user object
app.post("/user/new", async (req, res) => {
    try {
        const { newUser } = req.body;
        await userModel.create(newUser);
        return res.json({ message: "User Created!" });

    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});




app.listen(4444, () =>
    connectDB()
        .then((data) => console.log('Server is running...'))
        .catch((error) => console.log(error))
);

