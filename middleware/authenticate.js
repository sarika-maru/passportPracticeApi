const {User} = require('./../modal/user.modal');

var authenticate = (req,res,next)=>{

    if(req.session.has())
    {
        console.log("inside auth" + req.session.get('_token'));
        next();
    }else
    {
        res.send("Loging First");
    }
}


module.exports ={authenticate};
