var http = require("http");
var fs = require("fs");
var request = require("request-promise");
var basePathList = "/command.cgi?op=100&DIR=/DCIM/";
var optionsList = {
    url: '',
    method: 'GET',
    resolveWithFullResponse: true
};
var optionsData = {
	host: '',
	path: '/DCIM/'
};

exports.getlist = (dirname, ipaddr) =>{
	return new Promise(function(result, errRes){
	    var fileList = [];
	    console.log("getlist");
		console.log(ipaddr);
		optionsList.url = "http://" + ipaddr +  basePathList + dirname;
		console.log(ipaddr);
		optionsData.host = ipaddr;
		console.log(optionsList.url);
		console.log(optionsData.host);
		request(optionsList)
    	.then((res) => {
			txtLine = res.body.split((/\r\n|\r|\n/));
			txtLine.pop(); //最後の改行のみの行を削除
			txtLine.shift();
			txtLine.forEach(function(txt){
				txtElement = txt.split(",");
				fileList.push(txtElement[1]);
			});
			//console.log("FileList : " + fileList);
			result(fileList);			
		})
		.catch(function(err){
			errRes(err);
		});
	});
};


exports.getdata = (dirname, path, fname) =>{
	return new Promise(function(result, errRes){
	    optionsData.path = "/DCIM/" + dirname + "/" + fname;
		console.log(optionsData);
	
		var filename = "./" + path + "/" + dirname + "/" +  fname;

		var req = http.get(optionsData, function(res) {
    		if(res.statusCode != 200){
        		console.log("Error on get (Status)");
        		result(res.statusCode);
				return;
			}
    	    var body = "";
    	    res.setEncoding('binary')
    	    res.on('data', function(chunk){
        	    body += chunk;
    		});
    	    res.on('end', function(){
        	    fs.writeFile(filename, body, 'binary', function(err){
            	    console.log("successfull");
					result(0);
        		});
    		});
    	}).on('error', (e) => {
        	console.log("Error on get (Error)");
			errRes();	
			return;
    	});
	});
};
