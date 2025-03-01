const jwt = require('jsonwebtoken')
const User = require('./models/user.model')



const auth = async (req, res, next) => {
    try {
        
        console.log(res.cookies)
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisis')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }).populate('shoppingCart.product','charmPrice charmPhotos charmName')

        if (!user) {
            throw new Error('Terrible mistake')
        }
        req.token = token
        req.user = user

        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate here!.' })
    }
}

module.exports = auth