const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
var firebase =require ('firebase')
const PORT = process.env.PORT || 5000
const x_router3 , y_router3; //the position of router3 relative to the axis

firebase.initializeApp({
  serviceAccount:"./salty-hollows-99fa53ced8b0.json",
  databaseURL:"https://salty-hollows.firebaseio.com/"
});



var ref = firebase.database().ref('node-client');
var dimensionsRef = ref.child('dimensions');
var strengthRef = ref.child('strength');

strengthRef.on("child_changed", function(snapshot) {
  var changedPost = snapshot.val();
  console.log("The updated post title is " + changedPost.title);
  dimensionsRef.update({
    x : Math.round(Math.random()),
    y : Math.round(Math.random())
  });
});

/*dimensionsRef.set ({
  x:0,
  y:0
});*/



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


  getLength =(power)=>{  //function that takes the power of the router and returns the length
    
    var L=Math.abs(-7.25*Math.PI-27.515 );
    return L;
  }


  Triangulation = (power0,power1,power2) =>{

  var x,y; 
  var Lo=getLength(power0);
  var L1=getLength(power1);
  var L2=getLength(power2);
  const d=1;
  var cos_theta=(Math.pow(d,2)+Math.pow(Lo,2)-Math.pow(L1,2))/(2*d*Lo);
  var angle =Math.acos(cos_theta);
  var sin_theta=math.sin(angle);
  x= -Lo * cos_theta;
  y=(Lo * sin_theta)
  var L21=Math.sqrt(Math.pow(x_router3-x,2)+Math.pow(y_router3-y,2));
  var L22=Math.sqrt(Math.pow(x_router3-x,2)+Math.pow(y_router3+y,2));
  y=whichIsCloser(LL1,LL2,L2,y);
  
  return x,y;
  }
  whichIsCloser=(a,b,c,y)=>{
    var diff1=Math.abs(c-a);
    var diff2=Math.abs(c-b);
    if (diff1<diff2){
      return y;
    }
    else {
      return -y;
    }
  
  }
