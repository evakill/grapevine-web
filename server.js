const ReactDOMServer = require('react-dom/server');
const app = require('express')();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(server);
const port = 1337;
const mongoose = require('mongoose');
const Owner = require('./src/models/owner.js').Owner;
const Ambassador = require('./src/models/ambassador.js').Ambassador;
const Collab = require('./src/models/collab.js').Collab;
const Campaign = require('./src/models/campaign.js').Campaign;
const stripe = require('stripe')("sk_test_fqZQ3BZbeZhKmFB24U3uc7bv");

mongoose.connection.on('connected', () => {
 console.log('Connected to MongoDb!');
});
mongoose.connect(process.env.MONGODB_URI);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/checkin', function(req, res){
  res.render('index');
})

app.get('/', function(req, res){
  res.render('index');
})

app.get('/ambassadors/render', function(req, res){
  console.log(req.query.code);
  res.render('index');
});


io.on('connection', function(socket) {
  console.log('connected');

  socket.on('register owner', function(data){
    console.log('register owner event')
    stripe.customers.create({
      email: data.state.email,
      source: data.token.id,
      description: "owner",
    })
    .then(function(customer) {
      var newOwner = new Owner({
        firstName: data.state.firstName,
        lastName: data.state.lastName,
        email: data.state.email,
        password: data.state.password,
        businessName: data.state.businessName,
        businessDesc: data.state.businessDesc,
        businessEmail: data.state.businessEmail,
        businessAddress: data.state.businessAddress,
        image: data.state.img,
        location: data.state.location,
        stripeId: customer.id,
      });

      newOwner.save((err, newOwner) => {
        if(err) {
          console.log('Error saving owner.', err);
          socket.emit('new owner err')
        } else {
          console.log('Owner saved.', newOwner);
          socket.emit('new owner', newOwner);
        }
      });
    });
  });

  socket.on('register ambassador', function(data){
    console.log('register ambassador event')
    stripe.customers.create({
      email: data.state.email,
      source: data.token.id,
      description: "ambassador",
    })
    .then(function(customer) {
      console.log('customer:', customer)
      var newAmbassador = new Ambassador({
        firstName: data.state.firstName,
        lastName: data.state.lastName,
        email: data.state.email,
        password: data.state.password,
        address: data.state.address,
        image: data.state.img,
        location: data.state.location,
        campaigns: [],
        stripeId: customer.id,
      });
      newAmbassador.save((err, newAmbassador) => {
        if(err) {
          console.log('Error saving ambassador.', err);
          socket.emit('new ambassador err')
        } else {
          console.log('Ambassador Saved', newAmbassador);
          socket.emit('new ambassador', newAmbassador);
        }
      });
    });

    });

socket.on('get collab', function(id){
  console.log('get collab socket');
  Collab.findById(id)
  .populate('campaign')
  .populate('ambassador')
  .exec(function(err, collab){
    if(err) console.log(err);
    socket.emit('found collab', collab);
  })
})


socket.on('checkin', function(data){
  console.log('checkin socket')
  Collab.findById(data.token)
  .exec(function(err, collab){
    newCheckins = collab.checkins;
    newCheckins.push(data.fingerprint);
    console.log(newCheckins)
    Collab.findByIdAndUpdate(data.token, {checkins: newCheckins},
    {new:true}, function(err, resp){
      if(err) console.log(err)
      else console.log('collab updated');
      Owner.findById(data.campaign.owner)
      .exec(function(err, owner){
        if(err) console.log(err)
        else {
          const charge = stripe.charges.create({
            amount: (data.campaign.price * 100),
            currency: 'usd',
            description: 'Referral',
            customer: owner.stripeId,
            destination: data.ambassador.stripeId,
          }, function(err, charge){
            if(err) console.log(err)
            else console.log('charged', charge)
          });
        }
      })


    })
  })
})

});




server.listen(port, function(){
  console.log('listening on ' + port);
});
