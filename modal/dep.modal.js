const mongoose =require('mongoose');
const Schema= mongoose.Schema;


var DepSchema =new Schema({
    dep_name:{
        type:String
    }
});

const Dep = mongoose.modal("Dep",DepSchema);
module.exports={Dep}