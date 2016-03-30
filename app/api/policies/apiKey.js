"use strict";

module.exports = (req,res, ok)=>{
  let apiKey = req.param('APIKey');

  if(apiKey !== undefined && Application.find({apiKey:req.param('APIKey')})){
    return ok();
  }
  else{
    res.forbidden('You did not provide a valid Api-key');
    return;
  }
}
