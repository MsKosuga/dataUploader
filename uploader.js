'use strict'
var fs = require('fs');
var util = require('./util');
var request = require('request');

const timerInterval = 10000;
const chkfile = "updata.dat";
const lockfile = "uploader.lock";

var execFlag = 0;
var execGetFlag = 0;

var files = [];

var curDate = util.getCurrentDate();
var path = "./data/" + curDate;

var lastFile = "";

var url=""
var formData = {
    "timeout": 180000
}

exports.startUploader = function(){
	if(util.isExistLockfile(lockfile)){
        console.log("Other request is executing now. Cancel this request");
        return;
    }else{
        fs.writeFileSync(lockfile, "1");
    }
	files = fs.readdirSync(path);
	console.log(files);
	var timer1 = setInterval(() => {
        if(execFlag != 0){
            console.log("Other proc is executing now. Skip this proc");
            return;
        }
        if(execGetFlag != 0){
            console.log("Get proc is executing now. Skip this proc");
            return;
        }

        execFlag = 1;
        console.log("Exec...");

		fs.readFile(chkfile, 'utf-8', function(err, data){
			if(err){
				console.log(err);
			} else {
				data = data.replace(/\r?\n/g,"");
				var pos = files.indexOf(data);
				if(pos != files.length - 1){
					files.splice(0, pos + 1);
					console.log(files);
					if(execGetFlag == 0){
                        execGetFlag = 1;
						uploadProc();
                    } else {
                        console.log("Still executing get proc. Only update list.");
                    }
				}else{
					console.log("No data to upload");
					clearInterval(timer1);
					fs.unlinkSync(lockfile);
				};
			};
		});
		execFlag = 0;
	}, timerInterval);
}

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
				execGetFlag = 0;
				console.log("uploadProc end.");
			};
    	};
	});
};
