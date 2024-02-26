import {Schema, model} from 'mongoose'

const companySchema = Schema({
    name: {
        type: String,
        require: [true, "Name is require"]
    },
    impact: {
        type: String,
        uppercase: true,
        enum: ['HIGH', 'LOW', 'MEDIUM' ],
        required: [true, "IMPACT is require"]
    },
    yearExp: {
        type: String,
        require: [true, "password is require"]
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'category', 
        require: true
    }
},{
    versionKey: false
})

export default model('company', companySchema)