var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var braceletSchema = new Schema({

  newBracelet:{type:Boolean,default:true},
  braceletName:{type:String,unique:true},
  braceletPrice:{type:Number},
  overallRatio:{type:Number},
  braceletPhotos:[{type:String}],
  braceletInfo:{type:String},
  braceletCollection:{type:String},
  braceletMetal:{type:String},
  braceletColor:{type:String},
  braceletMotiv:{type:String},
  typeOfProduct:{type:String,default:"Bransoletka"},
  braceletDimension:{
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

var Bracelet = mongoose.model('Bracelet', braceletSchema);

module.exports = Bracelet