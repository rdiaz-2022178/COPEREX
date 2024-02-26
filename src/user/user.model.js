import {Schema, model} from 'mongoose'

const userSchema = Schema({
    name: {
        type: String,
        require: [true, "Name is require"]
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "Username is require"]
    },
    password: {
        type: String,
        require: [true, "password is require"]
    }
},{
    versionKey: false
})

export default model('user', userSchema)