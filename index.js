const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  //Trials
  .get('/', (req, res, next) => res.render('pages/index'))
  .get('/cool', (req, res, next) => res.send(cool()))
  .get('/times', (req, res, next) => res.send(showTimes()))
  //End of trials


  //Added the dimensions route which will give the data to the frontend
  .get('/dimensions', (req, res, next) => res.send(showDimensions()))

  .use((req,res,next)=>{
    const error = new Error ('404 Page Not Found');
    error.status =404;
    next(error);
  })
  .use((error,req,res,next)=>{
    res.status(error.status);
    res.send('404 Page Not Found')
  
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


  //Sending back the dimensions throu this method "Functions"
  showDimensions = () => {
    const dimensions = {
      x: 20,
      y: 0
    }
    return dimensions;
  }