const Dev = require('../models/Dev');

module.exports = {
    async store(req, res){
        const {user} = req.headers;
        const {devId} = req.params;
        
        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        // console.log('logado:'+loggedDev._id +' - target:'+targetDev._id);

        if(!targetDev){
            return res.status(404).json({ error: 'Dev not exists' });
        }

        loggedDev.dislikes.push(targetDev._id);

        await loggedDev.save();

        return res.status(200).json(loggedDev);
    }
};