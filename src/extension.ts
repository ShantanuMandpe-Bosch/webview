import * as vscode from 'vscode';
import * as path from 'path';
const {SerialPort} = require('serialport');

// bundle the js files and reference the entry points 
const cats = {
	'codingCat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
	'compilingCat': 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif'
  };

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
			// Get path to resource on disk
			const onDiskPath = vscode.Uri.joinPath(context.extensionUri,'src','styles.css');
			console.log(onDiskPath);
			// And get the special URI to use with the webview
			const styleSheet = panel.webview.asWebviewUri(onDiskPath);

			//send msh from html when the button is clicked and then use this serial port in order to open serial port and choose the serial port
			const port = new SerialPort({
				path: '/dev/tty-usbserial1',
				baudRate: 11520,
			});
			console.log(port);


			panel.webview.html = getWebViewContent(styleSheet);

			      // Handle messages from the webview
			panel.webview.onDidReceiveMessage(
				message => {
					switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						console.log(message.text);
						return;
					}
				},
				undefined,
				context.subscriptions
			);
			
		})
	
	);
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
					<button id="connectButton", type="button">Connect to BLE</button>
					<span id="bluetoothText", class="textBox">jlskjaklsjfkl jaslkjfklajsklfjaskjfkas</span>
				</div>  
			<br>
			<br>
				<div>
					<button id="connectButtonSerial", type="button">Connect via Serial Port</button>
					<span id="serialText", class="textBox">jlskjaklsjfkl jaslkjfklajsklfjaskjfkas</span>
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
						command: 'alert',
						text: 'This script has been reached'
					})
						
				});
			
			}())		
    	</script>

	</body>
	</html>`;
}

