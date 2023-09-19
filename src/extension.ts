import * as vscode from 'vscode';
const {SerialPort} = require('serialport');
const {readLine} = require('@serialport/parser-readline');

var currentPanel:vscode.WebviewPanel;
var port: any;

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "webview" is now active!');

	let disposable = vscode.commands.registerCommand('webview.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from WebView!');
	});

	context.subscriptions.push(disposable);

	context.subscriptions.push(
		vscode.commands.registerCommand('webview.webWorld', () => {
			 // Create and show panel
			let panel = vscode.window.createWebviewPanel(
				'webview',
				'Web View',
				vscode.ViewColumn.One,
				{
					// Enable scripts in the webview
					enableScripts: true
				}
			);
			currentPanel = panel;
			// Get path to resource on disk
			const onDiskPath = vscode.Uri.joinPath(context.extensionUri,'src','styles.css');
			console.log(onDiskPath);
			// And get the special URI to use with the webview
			const styleSheet = panel.webview.asWebviewUri(onDiskPath);

			panel.webview.html = getWebViewContent(styleSheet);

			      // Handle messages from the webview
			panel.webview.onDidReceiveMessage(
				message => {
					switch (message.command) {
					case 'alert':
						vscode.window.showInformationMessage(message.text);
						console.log(message.text);
						return;
					case 'serialStart':
						vscode.window.showInformationMessage(message.text);
						console.log("Reached here");
						startSerialTransmission();
					case 'serialStop':
						vscode.window.showInformationMessage(message.text);
						stopSerialTransmission();
					}
				},
				undefined,
				context.subscriptions
			);		
		})
	
	);
}

function startSerialTransmission() {
	//send msh from html when the button is clicked and then use this serial port in order to open serial port and choose the serial port
	console.log("reached serial function");
	port = new SerialPort({
		path: 'COM4',
		baudRate: 115200,
	}, function(err:any){
		console.log("reached inner function");
		if(err){
			console.log("error");
		} else {
			console.log("Opening serial port");
		}
	});

	console.log("Port Created next steop reading");
	port.on('readable',function(){
		let newData = port.read();
		if(newData === null){
			console.log("No Data");
		} else {
			console.log("Readble Mode Data: ",port.read());
		}		
	});

	port.on('data',function(data:any){
		console.log("Flowing Mode Data: ",data.toString());
		currentPanel.webview.postMessage(data.toString());
	});

	/*const parser = port.pipe(new ReadLine({delimiter: '\n'}));
	console.log("Waiting for data");
	parser.on('data',function(data:any){
		console.log(data);
		currentPanel.webview.postMessage(data.toString());
	});*/
	return;
}

function stopSerialTransmission(){
	port.close();
	return;
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getWebViewContent(styleSheets: vscode.Uri){
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<link rel="stylesheet" href="${styleSheets}">
		<title>NiclaSense WebApp</title>   
	</head>
	<body>
		<header>
			<h1 id="main-header">NICLA WebApp Javascript</h1>
			<hr>
			<p class="name">This sample illustrates the use of the Web Bluetooth API and Web Serial APT 
				to retrieve sensor information from a nearby NICLA SENSE ME which is a 
				Bluetooth Low Energy Device.</p>
		</header>
		
		<h3>GIT REPOSITORIES USED:</h3>
		<nav>
			<ul>
				<li><a href="https://developer.chrome.com/articles/bluetooth/">WebBluetooth API</a></li>
				<li><a href="https://developer.chrome.com/en/articles/serial/">WebSerial API</a></li>
			</ul>
		</nav>
		<hr>
		<section>
			<div class="buttonBox">
				<div>
					<button id="connectButton", type="button">Disconnect</button>
					<span id="bluetoothText", class="textBox">Click to disconnect the serial port.</span>
				</div>  
			<br>
			<br>
				<div>
					<button id="connectButtonSerial", type="button">Connect via Serial Port</button>
					<span id="serialText", class="textBox">Click to open serial port at COM4.</span>
				</div>
			</div>    
		</section>

		<script>
			(function() {
				const vscode = acquireVsCodeApi();

				document.getElementById("connectButtonSerial").addEventListener("click",event => {
					// Prompt user to select any serial port.
					if(navigator.serial){
						vscode.postMessage({
							command: 'alert',
							text: 'WebSerialAPI is available'
						})
					} else {
						vscode.postMessage({
							command: 'alert',
							text: 'No WebSerialAPI'
						})						
					}	
					vscode.postMessage({
						command: 'serialStart',
						text: 'Requesting and Opening Serial Port'
					})
						
				});

				document.getElementById("connectButton").addEventListener("click",event => {
					vscode.postMessage({
						command: 'serialStop',
						text: 'Closing Serial Port'
					})		
				});
			
			}())
			window.addEventListener('message',event => {
				let message = event.data;
				document.getElementById("serialText").textContent = message;
			});		
    	</script>

	</body>
	</html>`;
}



