const readFile = require('fs').readFile;
const writeFile = require('fs').writeFile;
var json2csv = require('json2csv').parse;
var deviceID;
var ModuleID;

const newman = require('newman');
newman.run({
		collection: require('./InterfaceValidator_report.postman_collection.json'),
		
		reporters: 'cli',
		exportEnvironment: './intval_environment.json',
		iterationData: './intval_input.json',
		insecure:'true',
		timeout: 0
	}, function (err) {
		if (err) { throw err; }
		console.log('collection run complete!');

	readFile('intval_input.json', 'utf-8', (err, inputData) => {
		if (err) {
			console.log(err);
			throw new Error(err);
		}
		data = JSON.parse(inputData);
		
		deviceID = data[0].USER_DATA[0].NAME_OF_DEVICE_LIST_UNDER_TEST;
		if(deviceID === "all") {
			deviceID = "";
		}
		ModuleID = data[0].USER_DATA[0].NAME_OF_INTERFACE_LIST_UNDER_TEST;
		if(ModuleID === "all") {
			ModuleID = "";
		}
		console.log(deviceID +'_'+ModuleID);
	});

	readFile('./intval_environment.json', 'utf-8', (err, fileContent) => {
		if (err) {
			console.log(err);
			throw new Error(err);
		}
		  
		var fields = [];
		var validationErrorResults = [];
		var validationReport = [];

		var temp = JSON.parse(fileContent);
		for(let i=0; i < temp.values.length; i++ )
		{
			if (temp.values[i].key === "validationErrorResults") {
				validationErrorResults = temp.values[i].value;
			}
			if (temp.values[i].key === "validationReport") {
				validationReport = temp.values[i].value;
			}
		}
		
		if(validationReport.length > 0) {
			const csv = json2csv(validationReport, Object.keys(validationReport[0]));			
			writeFile('./'+deviceID+'_'+ModuleID+'_INTVAL_REPORT.csv', csv, (err) => {
				if(err) {
					console.log(err);
					throw new Error(err);
				}
				console.log('Success!');
			});
		}

		if(validationErrorResults.length > 0) {
			const csv = json2csv(validationErrorResults, Object.keys(validationErrorResults[0]));			
			writeFile('./'+deviceID+'_'+ModuleID+'_INTVAL_ERROR_REPORT.csv', csv, (err) => {
				if(err) {
					console.log(err);
					throw new Error(err);
				}
				console.log('Success!');
			});
		}
	});
});
