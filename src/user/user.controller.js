import User from './user.model.js'
import { encrypt, comparePassword } from '../../utils/validator.js'
import {generateJwt} from '../../utils/jwt.js'

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'test good' })
}

export const defaultAdmin = async () => {
    try {
        const existingUser = await User.findOne({ username: 'default' });

        if (existingUser) {
            return;
        }
        let data = {
            name: 'Default',
            username: 'default',
            password: await encrypt('hola'),
        }

        let user = new User(data)
        await user.save()

    } catch (error) {
        console.error(error)
    }
}

export const signUp = async (req, res) => {
    try {
        let data = req.body
        let existingUser = await User.findOne({ username: data.username });
        if (existingUser) {
            return res.status(400).send({ message: 'Username is already in use' });
        }
        data.password = await encrypt(data.password)
        let user = new User(data)
        await user.save()
        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err: err })
    }
}

export const login = async (req, res) => {
    try {
        let { username, password } = req.body
        let user = await User.findOne({ username })
        if (user && await comparePassword(password, user.password)) {
            let loggedUser = {
                uid: user.id,
                username: user.username,
                name: user.name,
            }
            let token = await generateJwt(loggedUser)
            return res.send({ message: `Welcome ${loggedUser.name}`, loggedUser, token })

        }
        return res.status(404).send({ message: 'Invalid credentials' })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error to login' })
    }
}