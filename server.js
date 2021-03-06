
const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');

//const createPath = (core, ...args) => path.resolve(core.options.root, 'vfs', req.session.user.username, ...args);
const createPath = (core, user,  ...args) => path.resolve(core.options.root, 'vfs/', user, ...args);
const runcmd = (core, cmd, user, respond, file) => new Promise((resolve, reject) => {
console.log("cmd:" + cmd);
console.log("user:" + user);
console.log("file.path:" + file.path);
	if (cmd === "lilypond") {
	
	const tmpFilename=  file.path.replace(/^.*[\\\/]/, '');
	const pdfFile= tmpFilename.replace(/\..+$/, '')  + ".pdf";
	const pdfPath= file.path.replace(/\..+$/, '')  + ".pdf";
	const realOutput = {path: pdfPath, filename: pdfFile};	
	const i = createPath(core, user, file.path.replace(/^home:\//, ''));

//	const o= i.replace(/\..+$/, '')  + ".pdf";	
//	const o= i.replace(/\..+$/, '')  + ".pdf";
	const o = i.substr(0, i.lastIndexOf(".")) + ".pdf";
	console.log(cmd, [
    	'-o',
  	  o,
	
 	   '--pdf',
   	 i
  	]);
  	var p = spawn(cmd, [
    	'-o',
  	  o.replace(/\.pdf$/, ''),
	
 	   '--pdf',
   	 i
  	]);
 	}


  p.stdout.on('data', data => respond(data.toString()));
  p.stderr.on('data', data => respond(data.toString()));

  p.on('error', error => reject(error));
  p.on('exit', code => {

    return !code ? resolve() : reject('Failed');
  });
});

module.exports = (core, proc) => ({

  // When server initializes
  init: async () => {
    // HTTP Route example (see index.js)
    core.app.post(proc.resource('/test'), (req, res) => {
      res.json({hello: 'World'});
    });

    // WebSocket Route example (see index.js)
    // NOTE: This creates a new connection. You can use a core bound socket instead
    core.app.ws(proc.resource('/socket'), (ws, req) => {

 //     ws.send('Hello World');
    });


  },

  // When server starts
  start: () => {},

  // When server goes down
  destroy: () => {},


  // When using an internally bound websocket, messages comes here
  onmessage: (ws, respond, msg) => {

			
			const {cmd, user, args} = JSON.parse(msg);

		//	runcmd(core, cmd, user, respond, ...args);
			
			runcmd(core, cmd, user, respond, ...args);			
			
//    respond('Internal socket');
  }
});