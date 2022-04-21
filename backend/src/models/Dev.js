const {Schema, model} = require('mongoose');

const DevSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    bio: String,
    avatar: {
        type: String,
        required: true,
    },
    likes: [{
        type: Schema.Types.ObjectId,  //ids dos devs curtidos
        ref: 'Dev',    //referenciando a esse model
    }],
    dislikes: [{
        type: Schema.Types.ObjectId, //ids dos devs descurtidos
        ref: 'Dev',      //referenciando a esse model
    }],
},{
    timestamps: true,
});

// exportando a func 'model() do mongoose' passando o nome do model e o schema  
module.exports = model('Dev', DevSchema);