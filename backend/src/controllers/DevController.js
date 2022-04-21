const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {

    async index(req, res){
        const { user } = req.headers;

        const loggedDev = await Dev.findById( user );

        const devs = await Dev.find({
            $and: [
                { _id: {$ne: user} },  //not equals , não trazer user == ao user logado
                { _id: {$nin: loggedDev.likes} },  // not in, trás users exceto os da lista de likes
                { _id: {$nin: loggedDev.dislikes} }, //  || , trás users exceto os da lista de dislikes
            ]
        });

        return res.status(200).json(devs);
    },

    async store(req, res){
        const { username } = req.body;

        const userExists = await Dev.findOne({ user: username });

        if(userExists){
            console.log("já existe no banco de dados");
            return res.status(200).json(userExists);
        }

            /*
            * Handling Errors using async/await
            * Has to be used inside an async function
            */
            try {
                const response = await axios.get(`https://api.github.com/users/${username}`);
                // Success 🎉
                const {name, bio, avatar_url: avatar} = response.data;

                const dev = await Dev.create({
                    name,
                    user: username,
                    bio,
                    avatar
                });

                return res.status(200).json(dev);



            } catch (error) {
                // Error 😨
                if (error.response) {
                    /*
                    * The request was made and the server responded with a
                    * status code that falls out of the range of 2xx
                    */
                    console.log(error.response.status);
                    return res.status(404).json(error.response.status);
                } 
            }
        
    }
};