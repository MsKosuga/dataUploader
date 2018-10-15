'use strict'
var request = require('request');
var fs = require('fs');

var url="http://localhost:8080/v1/nanogw/kura";
var formData = {
	"timeout": 180000
}

formData.file = fs.createReadStream("./data/20181015/19700101000000.jpeg");

request.post({url:url, formData:formData}, function(err, response, body) {
    if(err){
      console.log(err)
    }else{
      console.log(body)
    };
});
