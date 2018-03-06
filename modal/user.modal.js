const mongoose= require('mongoose');
var Schema= mongoose.Schema;
var jwt = require('jsonwebtoken');

var UserSchema = new Schema(
    {
        username: {
            type: String
        }, password: {
            type: String
        },gender :{
            type:String
        },city :{
            type:String
        },tokens:
            [{
                token: {
                    type: String,
                    required :true
                }, access: {
                    type: String
                }
            }]
    }
);

UserSchema.methods.generateAuthToken = function () {
    var user= this;
    var access ="auth";
    var token = jwt.sign({_id : user._id.toHexString()},'abc123').toString();

    user.tokens.push({access, token});

    return user.save().then(()=> {

        return token;
    });
};



UserSchema.methods.removeToken = function (token) {
    var user= this;
    return user.update({
        $pull:{
            tokens:{
                token
            }
        }
    })
};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decode;

    try {
        decode= jwt.verify(token,'abc123');
    }catch (e) {
        return Promise.reject();
    }


    return User.findOne({
        '_id' : decode,
        'tokens.token' : token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email,password) {
    var User= this;
    return User.findOne({email}).then((user)=>{
        if(!user){
        return Promise.reject();
    }
    return new Promise((resolve,reject)=>{
        bcrypt.compare(password,user.password,(err,res)=>{
        if(res)
        {
            resolve(user);
        } else {
            reject();
        }
            })
        })
    })
}

const User =mongoose.model("User",UserSchema);

module.exports={User};