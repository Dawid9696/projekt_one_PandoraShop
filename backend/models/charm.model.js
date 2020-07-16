var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var charmSchema = new Schema({

  newCharm:{type:Boolean,default:true},
  charmName:{type:String,unique:true},
  charmPrice:{type:Number},
  overallRatio:{type:Number},
  numberRatio:{type:Number},
  charmPhotos:[{type:String}],
  charmInfo:{type:String},
  charmCollection:{type:String},
  charmMetal:{type:String},
  charmColor:{type:String},
  charmMotiv:{type:String},
  typeOfProduct:{type:String,default:"Charms"},
  charmDimension:{
    deep:{type:Number},
    hight:{type:Number},
    width:{type:Number}
  },
  comments:[{
    postedBy:{type:Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    opinion:{type:String},
    opinionDate:{type:Date,default:Date.now},
    ratio:{type:Number}
  }]

});

var Charm = mongoose.model('Charm', charmSchema);

module.exports = Charm;