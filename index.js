const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
var firebase =require ('firebase')
const PORT = process.env.PORT || 5000

firebase.initializeApp({
  serviceAccount:"./salty-hollows-99fa53ced8b0.json",
  databaseURL:"https://salty-hollows.firebaseio.com/"
});

var ref = firebase.database().ref('node-client');
var dimensionsRef = ref.child('dimensions');
dimensionsRef.set ({
  x:0,
  y:0
});
dimensionsRef.update({
  x : 5,
  y :6
});


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  //Trials
  .get('/', (req, res, next) => res.render('pages/index'))
  .get('/cool', (req, res, next) => res.send(cool()))
  .get('/times', (req, res, next) => res.send(showTimes()))
  //End of trials

  .get('/routers', (req, res, next) => res.send(showRouters()))
  //Added the dimensions route which will give the data to the frontend
  .get('/dimensions', (req, res, next) => res.send(showDimensions()))
   //handling errors
  .use((req,res,next)=>{
    const error = new Error ('404 Page Not Found');
    error.status =404;
    next(error);
  })
  .use((error,req,res,next)=>{
    res.status(error.status);
    res.send('404 Page Not Found') // we need to make this a HTML page instead
  
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  showTimes = () => {
    let result = ''
    const times = process.env.TIMES || 5
    for (i = 0; i < times; i++) {
      result += i + ' '
    }
    return result;
  }
  showRouters = ()  =>  {

    const routers ={
      router1: 'SBME1',
      router2: 'SBME2',
      router3: 'SBME3'
      
    }
     return routers;
  }

  //Sending back the dimensions throu this method "Functions"
  showDimensions = () => {
    const dimensions = {
      x: 20,
      y: 0
    }
    return dimensions;
  }