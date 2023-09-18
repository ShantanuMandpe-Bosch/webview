"use strict";var r=Object.create;var n=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var h=Object.getOwnPropertyNames;var v=Object.getPrototypeOf,m=Object.prototype.hasOwnProperty;var b=(e,t)=>{for(var o in t)n(e,o,{get:t[o],enumerable:!0})},c=(e,t,o,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of h(t))!m.call(e,s)&&s!==o&&n(e,s,{get:()=>t[s],enumerable:!(a=d(t,s))||a.enumerable});return e};var p=(e,t,o)=>(o=e!=null?r(v(e)):{},c(t||!e||!e.__esModule?n(o,"default",{value:e,enumerable:!0}):o,e)),u=e=>c(n({},"__esModule",{value:!0}),e);var k={};b(k,{activate:()=>w,deactivate:()=>f});module.exports=u(k);var i=p(require("vscode"));function w(e){console.log('Congratulations, your extension "webview" is now active!');let t=i.commands.registerCommand("webview.helloWorld",()=>{i.window.showInformationMessage("Hello World from WebView!")});e.subscriptions.push(t),e.subscriptions.push(i.commands.registerCommand("webview.webWorld",()=>{let o=i.window.createWebviewPanel("webview","Web View",i.ViewColumn.One,{enableScripts:!0}),a=i.Uri.joinPath(e.extensionUri,"src","styles.css");console.log(a);let s=o.webview.asWebviewUri(a);o.webview.html=g(s),o.webview.onDidReceiveMessage(l=>{switch(l.command){case"alert":i.window.showErrorMessage(l.text),console.log(l.text);return}},void 0,e.subscriptions)}))}function f(){}function g(e){return`<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<link rel="stylesheet" href="${e}">
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

				const button = document.getElementById("connectButtonSerial");
				button.addEventListener('click', event => {
					vscode.postMessage({
						command: 'alert',
						text: 'This script has been reached'
					})
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
				})
			
			}())		
    	</script>

	</body>
	</html>`}0&&(module.exports={activate,deactivate});
