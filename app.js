const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, resp)=>{
    resp.json({
        message: 'Welcome to the API'
    });
});

// FORMAT OF TOKEN
// authorization: Bearer <access_token>

// verifyToken
function verifyToken(req, resp, next){
    //Get the auth header value 
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is undefined
    if(typeof bearerHeader != 'undefined'){
        //Split at the space
        const bearer = bearerHeader.split(' ');
        //Get token from array
        const bearerToken = bearer[1];
        //Set the token
        req.token = bearerToken;
        //Next middlleware
        next();
    }else{
        //Forbidden
        resp.sendStatus(403);
    }

}

app.post('/api/login', (req, resp)=>{
    //Mock User 
    const user = {
        id: 1,
        username: 'umer',
        email: 'umer@gmail.com'
    }

    jwt.sign({user}, 'secretkey', { expiresIn: '20s'}, (err, token)=>{
        resp.json({
            token
        });
    });
});

app.post('/api/posts', verifyToken, (req, resp)=>{
    jwt.verify(req.token, 'secretkey', (err, authData)=>{
        if(err){
            resp.sendStatus(403);
        }else{
            resp.json({
                status: true,
                message: 'Post created ....',
                data: authData
            });
        }
    });
});


app.listen(5000, () => console.log('Server started on port 5000'));