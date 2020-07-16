var mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


var Schema = mongoose.Schema;

var userSchema = new Schema({

    login:{type:String},
    email:{type:String},
    password:{type:String},
    personalData:{
      name:{type:String,default:'Brak danych'},
      surname:{type:String,default:'Brak danych'},
      city:{type:String,default:'Brak danych'},
      street:{type:String,default:'Brak danych'},
      numberOfHome:{type:String,default:'Brak danych'},
      postalCode:{type:String,default:'Brak danych'}
    },
    admin:{type:Boolean,default:false},
    shoppingCartTotalPrice:{type:Number,default:0},
    shoppingCartTotalQuantity:{type:Number,default:0},
    shoppingCart:[{
      totalPrice:{type:Number,default:0},
      totalQuantity:{type:Number,default:0},
      product:{type: Schema.Types.ObjectId,
      ref:'Charm'
      }}],
    tokens:[{
      token:{type:String}
    }]

});

userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({_id:user._id.toString()},'thisis')
  user.tokens = user.tokens.concat({token})
    await user.save()
  return token
}

userSchema.statics.findByCredentials = async (email,password) => {
  const user = await User.findOne({email})
  if(!user) {
      throw new Error('There is no user')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch) {
    throw new Error('There is no match bitch')
}
return user
}

userSchema.pre('save',async function(next){
  const user = this
  if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password,8)
  }
  next()
})

var User = mongoose.model('User', userSchema);


module.exports = User