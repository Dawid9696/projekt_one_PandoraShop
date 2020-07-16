const router = require('express').Router();
const auth = require('../auth')
let User = require('../models/user.model');
let Bracelet = require('../models/bracelet.model');
let Charm = require('../models/charm.model');
const bcrypt = require('bcrypt')


//CHARMS ROUTES
//#########################################################

router.get('/charmsSorted',auth,async(req,res) => {
    const users = await User.find()
    console.log(users)
    try {
        await req.user.populate({
            path:'Charm',
            match:true,
           options: {
               limit:1
           } 
        }).execPopulate()
        res.status(200).send(req.user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})


router.route('/charms').get((req, res) => {
    console.log(req.query.limit)
    Charm.find().select('newCharm charmName charmPrice overallRatio numberRatio charmPhotos')
    .limit(parseInt(req.query.limit))
    .then(charm => res.json(charm))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/charms/:id').get((req, res) => {
    Charm.find({_id:req.params.id}).populate('comments.postedBy','login tokens')
    .then(charm => res.json(charm))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/addCharm',async (req, res) => {
    const charm = new Charm(req.body)
    charm.save().then(() => {
        res.send(charm)
    }).catch((err) => {
        res.send("Problem with adding a new charm! - "+err)
    })
  })

  router.post('/addCharmComment/:id',auth,async (req, res) => {
    const charm = await Charm.findById(req.params.id)
    const newComment = [{
        postedBy:req.user._id,
        opinion:req.body.opinion,
        ratio:req.body.ratio
    }]
    charm.comments = charm.comments.concat(newComment)
    const ratioTab = charm.comments.map((item) => {
        return item.ratio
    })
    const ratio = ratioTab.reduce(function myFunction(total, value) {
        return total + value;
      } )
    const result = ratio/charm.comments.length
    charm.overallRatio = result
    charm.numberRatio = charm.comments.length
    res.send(charm)
    charm.save()
  })

  router.delete('/deleteCharmComment/:id/comment/:id2',auth,async (req, res) => {
    const oldComment = await Charm.findById(req.params.id).select('comments').populate('comments.postedBy','login')
    const newComment2 =oldComment.comments.filter((item) => {
        return item._id == req.params.id2
    })
    if(newComment2[0].postedBy.login==req.user.login){
        const newComment = oldComment.comments.filter((item) => {
            return item._id != req.params.id2
        })
        oldComment.comments = newComment
    } else {
        throw new Error('Nie jestes uprawniony!')
    }
    oldComment.save()
    res.send(oldComment)
  })

//BRACELETS ROUTES
//#########################################################


router.route('/bracelets').get((req, res) => {
    Bracelet.find()
    .then(bracelet => res.json(bracelet))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addBracelet').post((req, res) => {
    const bracelet = new Bracelet(req.body)
    bracelet.save()
    .then(response => console.log('Bracelet added !'))
    .catch(error => console.log('Bracelet not added !'))
});

//USER ROUTES
//#########################################################

router.get('/shoppingCart',auth,async (req, res) => {
    const tab =[]
    const tab2 =[]
    req.user.shoppingCart.forEach((item) => {
        tab.push(item.totalPrice)
        tab2.push(item.totalQuantity)
    })
    if(tab.length==0) {
       res.send(tab)
    } else {
        const sum =tab.reduce(function myFunction(total, value, index, array) {
            return total + value;
          })
        const sum2 =tab2.reduce(function myFunction(total, value, index, array) {
            return total + value;
        })
        req.user.shoppingCartTotalPrice=sum;
        req.user.shoppingCartTotalQuantity=sum2;
        req.user.save()
    }

    res.send(req.user)
});

router.patch('/shoppingCart/update/:id',auth,async (req, res) => {
    const product = [{product:req.params.id}]
    const exist = req.user.shoppingCart
    const charm =await Charm.findById(req.params.id)

    //Sprawdzenie czy koszyk jest pusty - jeśli tak to dodaje pierwszy produkt +
    if(req.user.shoppingCart.length==0) {
        req.user.shoppingCart =await req.user.shoppingCart.concat(product)
        req.user.shoppingCart[0].totalQuantity = 1
        req.user.shoppingCart[0].totalPrice = req.user.shoppingCart[0].totalQuantity * charm.charmPrice
    } //Jeśli koszyk
     else if(req.user.shoppingCart.length!==0) {
        const check = exist.filter(function myFunction(value, index, array) {
            return value.product._id == req.params.id
        })
      if(check.length!==0) {
        check[0].totalQuantity = check[0].totalQuantity + 1
        check[0].totalPrice = check[0].totalQuantity * charm.charmPrice
        } else if(check.length==0){
            console.log('Dodaje nowy')
            req.user.shoppingCart =await req.user.shoppingCart.concat(product)
            const dlugosc = req.user.shoppingCart.length - 1
            console.log(dlugosc)
            req.user.shoppingCart[dlugosc].totalQuantity = 1
            req.user.shoppingCart[dlugosc].totalPrice = req.user.shoppingCart[dlugosc].totalQuantity * charm.charmPrice
            console.log(req.user.shoppingCart)
            
        }
    }
    req.user.save()
    res.send(req.user)
});

router.delete('/shoppingCart/cleanShoppingCart',auth,async (req, res) => {
    req.user.shoppingCart = []
    req.user.save()
    res.send(req.user)
});

router.post('/shoppingCart/cleanShoppingCart2/:id',auth,async (req, res) => {
    const newCart = req.user.shoppingCart.filter((item) => {
        console.log(item.product._id)
        console.log(req.params.id)
        return item.product._id != req.params.id
    })
    req.user.shoppingCart = newCart
    req.user.save()
    res.send(req.user)
});

router.post('/login',async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
      
        res.send({user,token})
          } catch (e) {
              res.status(400).send('No acces!'+e)
          }
});

router.route('/register').post(async(req, res) => {
    const user = await new User(req.body)
    user.save()
    .then(()=>{
        res.send(user)
    }).catch((err) => {
        res.send("errorrek")
    })
});

router.delete('/deleteMyProfile',auth,async (req,res) => {
    await req.user.remove()
    res.send(req.user)
})

router.get('/myprofile',auth,async (req, res) => {
    User.find(req.user._id).populate('shoppingCart.product','charmName charmPrice')
    .then(charm => res.json(charm))
    .catch(err => res.status(400).json('Error: ' + err));
  })

  router.get('/AllUsers',async (req, res) => {
    User.find()
    .then(charm => res.json(charm))
    .catch(err => res.status(400).json('Error: ' + err));
  })

  router.post('/logoutAll',auth,async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('Logged out')
    } catch (err) {
        res.status(500).send(err)
    }
  })

  router.post('/changePassword',auth,async (req, res) => {
      const match = await bcrypt.compare(req.body.password, req.user.password)
    if(match) {
        req.user.password = req.body.newPassword
        res.send(req.user)
        req.user.save()
    } else {
        res.status(500).send('Nie udana zmiana hasła')
    }
})

  router.post('/UpdateMyProfile',auth,async (req, res) => {

        const newPersonalData = {
            name:req.body.name,
            surname:req.body.surname,
            city:req.body.city,
            street:req.body.street,
            numberOfHome:req.body.numberOfHome,
            postalCode:req.body.postalCode 
        }
    try {
        req.user.personalData = newPersonalData
        req.user.save()
        res.send(req.user) 
    } catch(err) {
        res.status(500).send("Błąd: "+err)
    }
    
    })

module.exports = router;