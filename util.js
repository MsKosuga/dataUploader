var fs = require('fs');

exports.getCurrentDate = () => {
	var dt = new Date();
	var y = (dt.getFullYear()).toString();
	var m = ("0" + (dt.getMonth() + 1).toString()).slice(-2);
	var d = ("0" + dt.getDate().toString()).slice(-2);
	return y + m + d;
};

exports.checkDir = (dir) => {
	var path = "./" + dir;
	var res = fs.existsSync(path);
	if(res == false){
		fs.mkdirSync(path);
	}
	return res;
}
