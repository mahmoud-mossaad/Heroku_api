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
var strengthRef = ref.child('strength');

dimensionsRef.on("value", function(snapshot2){
  console.log("here 2");
  result1 = [snapshot2.val().x, snapshot2.val().y];
})
strengthRef.on("child_changed", function(snapshot) {
  var changedPost = snapshot.val();
  console.log("The updated post title is " + changedPost);


  strengthRef.on("value", function(snapshot1) {
    result = Triangulation(snapshot1.val().wifi1, snapshot1.val().wifi2, snapshot1.val().wifi3);
    console.log(result);

    if(isNaN(result[1])){
      console.log("here");
      dimensionsRef.update({
        x : Math.round(result[0]),
      });
    }
    else{
      console.log(result);
      dimensionsRef.update({
        x : Math.round(result[0]),
        y : Math.round(result[1])
      });
    }
  })

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
    
    var L=Math.abs(-0.75*power-27.515 );
    return L;
  }


  Triangulation = (power0,power1,power2) =>{

  var x,y,x1,y1; 
  var Lo=getLength(power0);
  var L1=getLength(power1);
  var L2=getLength(power2);
  //const d=45.8;
  const d = 50;
  const x_router3=-9.82; 
  const y_router3=-19.64;
  var cos_theta=(Math.pow(d,2)+Math.pow(Lo,2)-Math.pow(L1,2))/(2*d*Lo);
  var angle =Math.acos(cos_theta);
  var sin_theta=Math.sin(angle);
  x= -Lo * cos_theta;
  y= Lo * sin_theta;
  var LL1=Math.sqrt(Math.pow(x_router3-x,2)+Math.pow(y_router3-y,2));//postive sign
  var LL2=Math.sqrt(Math.pow(x_router3-x,2)+Math.pow(y_router3+y,2));//negative sign
  y=whichIsCloser(LL1,LL2,L2,y);//to determine which sign is closer
  x1=ESP_CoordnatesX(x);
  y1=ESP_CoordnatesY(y);
  return [x1,y1];
  }
  whichIsCloser=(first,second,c,y)=>{
    var diff1=Math.abs(c-first);
    var diff2=Math.abs(c-second);
    if (diff1<diff2){
      return y;
    }
    else {
      return -y;
    }

  }


  ESP_CoordnatesX = (x) =>{
  const theta =173.64;
  var x_ESP = x*Math.cos(theta)-x*Math.sin(theta);
  return x_ESP;
  }
  ESP_CoordnatesY = (y) =>{
    const theta =173.64;
    var Y_ESP = y*Math.cos(theta)+y*Math.sin(theta);
    return Y_ESP;
    }