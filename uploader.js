'use strict'
var fs = require('fs');
var util = require('./util');
var request = require('request');

const chkfile = "updata.dat"

var curDate = util.getCurrentDate();
var path = "./data/" + curDate;

var lastFile = "";

var url="<SERVER URL>";
var formData = {
    "timeout": 180000
}

var files = fs.readdirSync(path);
console.log(files);

fs.readFile(chkfile, 'utf-8', function(err, data){
	if(err){
		console.log(err);
	} else {
		data = data.replace(/\r?\n/g,"");
		var pos = files.indexOf(data);
		if(pos != files.length - 1){
			files.splice(0, pos + 1);
			console.log(files);
				
			uploadProc();
		}else{
			console.log("no upload data");
		};
	};
});

function uploadProc(){
	var filename = path + "/" +  files[0];
	console.log(filename);

	formData.file = fs.createReadStream(filename);

	request.post({url:url, formData:formData}, function(err, response, body){
    	if(err){
      		console.log(err)
    	}else{
      		console.log(body)
			fs.writeFileSync(chkfile, files[0]);	
			files.shift();
			if(files.length != 0){
				uploadProc();
			}else{
				console.log("uploadProc end.");
			};
    	};
	});
};

