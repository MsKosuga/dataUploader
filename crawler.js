'use strict'
var fs = require('fs');
var flashair = require('./flashAirUtil');
var util = require('./util');

var uploader = require('./uploader');

const timerInterval = 5000;
const chkfile = "lastdata.dat";
const lockfile = "crawler.lock";

var execFlag = 0;
var execGetFlag = 0;

var fileFolder = "";
var fileList = [];
var lastFile = "";

var ipaddr = "";

exports.startCrawler = function(ip){
	if(isExistLockfile()){
		console.log("Other request is executing now. Cancel this request");
		return;
	}else{
		fs.writeFileSync(lockfile, "1");
	}
	ipaddr = ip;
	console.log("HOST:" + ipaddr);
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

		fileFolder = util.getCurrentDate();
		var res = util.checkDir("data/" + fileFolder);

		fs.readFile(chkfile, 'utf-8', function(err, data){
			if(err){
				console.log(err);
			} else {
				lastFile = data;
				console.log("Starting crawling porc.");

   	         	flashair.getlist(fileFolder, ipaddr).then(function(res){
					checkFileList(res);
					updateFileList(res);
					if(fileList.length != 0){
						console.log("Starting to get Data");
						console.log(fileList);
						if(execGetFlag == 0){
							execGetFlag = 1;
							execGetData();
						} else {
							console.log("Still executing get proc. Only update list."); 
						}
					} else {
						console.log("No data to get");
						clearInterval(timer1);
						fs.unlinkSync(lockfile);

						uploader.startUploader();
					};
				});
			}
		}); 
		execFlag = 0;
	}, timerInterval);
}

function execGetData(){
	console.log("PATH:"+fileFolder);
	console.log("GetData:"+fileList[0]);
	flashair.getdata(fileFolder, "data", fileList[0]).then(function(res){
		console.log("Result:"+res);
		if(res == 0){
			// 取得データ名をファイルに記録
			fs.writeFileSync(chkfile, fileList[0]);
			fileList.shift(); //取得したデータをリストから削除
 			console.log(fileList);
			if(fileList.length != 0){
				execGetData();
			}else{
				execGetFlag = 0;
				console.log("GetData end.");
			};
		};
	});	
};

function checkFileList(lst){
	var pos = lst.indexOf(lastFile);
	if(pos == -1){
		console.log("checkFileList result: no match");
		return;
	}

	lst.splice(0, pos + 1);
}

function updateFileList(lst){
	console.log(fileList.length);
	if(fileList.length != 0){
		console.log("File List is not empty");
		fileList.length = 0;
	} else {
		console.log("File List is empty");
	}
	fileList = lst.concat();
	console.log(fileList);
};

function isExistLockfile(){
	try{
		fs.statSync(lockfile);
		return true;
	}catch(err){
    	if(err.code === 'ENOENT') return false;
	} 
}
