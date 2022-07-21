const mongoose = require('mongoose');

const questionSchema= new mongoose.Schema({
questionNumber:{
        type: Number,
        required: true,
        trim: true,
        unique: true
},
input1:{
    type: Number,
    trim: true,
    default: 0,
},
input2:{
    type: Number,
    trim: true,
    default: 0,
},
input3:{
    type: Number,
    trim: true,
    default: 0,
},
input4:{
    type: Number,
    trim: true,
    default: 0,
},
input5:{
    type: Number,
    trim: true,
    default: 0,
},
input6:{
    type: Number,
    trim: true,
    default: 0,
},
input7:{
    type: Number,
    trim: true,
    default: 0,
},
input8:{
    type: Number,
    trim: true,
    default: 0,
},
});

const Question = mongoose.model('Question', questionSchema);
module.exports= {Question, questionSchema};