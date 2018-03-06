const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var EmpSchema = new Schema({
    emp_name : {
        type :String
    },emp_gender:{
        type:String
    },emp_salary:{
        type: Number
    },emp_email :{
        type: String
    },emp_dep:{
        type:Schema.Types.ObjectID
    }
});

const Emp= mongoose.modal("Emp",EmpSchema);

module.exports={Emp};
