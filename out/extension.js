"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const { SerialPort } = require('serialport');
const { readLine } = require('@serialport/parser-readline');
var currentPanel;
var port;
let uriFilePath;
const outputData = [];
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('webview.webWorld', () => {
        if (currentPanel) {
            currentPanel.reveal(vscode.ViewColumn.One);
            return;
        }
        // Create and show panel
        const panel = vscode.window.createWebviewPanel('webview', 'Web View', vscode.ViewColumn.One, {
            // Enable scripts in the webview
            enableScripts: true
        });
        currentPanel = panel;
        fs.readFile(path.join(context.extensionPath, 'src', 'index.html'), (err, data) => {
            if (err) {
                console.log(err);
            }
            let rawHTML = data.toString();
            // Replace all urls
            const srcList = rawHTML.match(/src\=\"(.*)\"/g);
            const hrefList = rawHTML.match(/href\=\"(.*)\"/g);
            if (srcList != null && hrefList != null) {
                for (let src of [...srcList, ...hrefList]) {
                    let url = src.split("\"")[1];
                    // Get path to resource on disk
                    const onDiskPath = vscode.Uri.joinPath(context.extensionUri, './src/' + url);
                    // And get the special URI to use with the webview
                    const extraSheet = panel.webview.asWebviewUri(onDiskPath);
                    const toReplace = src.replace(url, extraSheet.toString());
                    console.log(url, onDiskPath, extraSheet);
                    rawHTML = rawHTML.replace(src, toReplace);
                }
            }
            panel.webview.html = rawHTML;
        });
        //panel.webview.html = getWebViewContent(styleSheet);
        panel.onDidDispose(() => {
            port.on('open', () => {
                stopSerialTransmission();
            });
        });
        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(message => {
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
        }, undefined, context.subscriptions);
        uriFilePath = vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file('output.txt'),
        });
    }));
}
exports.activate = activate;
function startSerialTransmission() {
    //send msh from html when the button is clicked and then use this serial port in order to open serial port and choose the serial port
    console.log("reached serial function");
    port = new SerialPort({
        path: 'COM4',
        baudRate: 115200,
    }, function (err) {
        console.log("reached inner function");
        if (err) {
            console.log("error");
        }
        else {
            console.log("Opening serial port");
        }
    });
    console.log("Port Created next steop reading");
    port.on('readable', function () {
        let newData = port.read();
        if (newData === null) {
            console.log("No Data");
        }
        else {
            console.log("Readble Mode Data: ", port.read());
        }
    });
    port.on('data', function (data) {
        console.log("Flowing Mode Data: ", data.toString());
        currentPanel.webview.postMessage(data.toString());
        outputData.push(data.toString());
        const value = 'output.txt';
        exportDataWithConfirmation('output.txt', data.toString());
        /*fs.writeFile(value,data.toString(),(err:any)=>{
            if (err) {
                void vscode.window.showErrorMessage("Could not write to file: " + value + ": " + err.message);
                console.log(err.message);
            } else {
                void vscode.window.showInformationMessage("Saved " + value );
            }
        })*/
    });
    /*const parser = port.pipe(new ReadLine({delimiter: '\n'}));
    console.log("Waiting for data");
    parser.on('data',function(data:any){
        console.log(data);
        currentPanel.webview.postMessage(data.toString());
    });*/
    return;
}
function stopSerialTransmission() {
    port.close();
    return;
}
function exportDataWithConfirmation(fileName, data) {
    /*void vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(fileName),
    }).then*/ ((uri) => {
        if (uri) {
            const value = uri.fsPath;
            fs.writeFile(value, data, (error) => {
                if (error) {
                    void vscode.window.showErrorMessage("Could not write to file: " + value + ": " + error.message);
                }
                else {
                    void vscode.window.showInformationMessage("Saved " + value);
                }
            });
        }
    });
}
// This method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map