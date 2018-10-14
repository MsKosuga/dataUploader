var express = require('express');
var router = express.Router();
var crawler = require('../crawler');

/* GET users listing. */
router.get('/', function(req, res, next) {
  	console.log(req.query);
	if(req.query.ip){
		data = req.query.ip;
		ipaddr = data.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
		if(!ipaddr){
			console.log("*** Error *** : invalid ip address format.");
			res.send('-1');
			return;
		}
		console.log("ip:" + ipaddr);
		crawler.startCrawler();
  		res.send('0');
		return;
	}
	console.log("*** Error *** : No parameter.");
  	res.send('-1');
});

module.exports = router;
