"use strict";
(function () {
    const vscode = acquireVsCodeApi();
    document.getElementById("connectButtonSerial").addEventListener("click", event => {
        // Prompt user to select any serial port.
        if (navigator.serial) {
            vscode.postMessage({
                command: 'alert',
                text: 'WebSerialAPI is available'
            });
        }
        else {
            vscode.postMessage({
                command: 'alert',
                text: 'No WebSerialAPI'
            });
        }
        vscode.postMessage({
            command: 'serialStart',
            text: 'Requesting and Opening Serial Port'
        });
    });
    document.getElementById("connectButton").addEventListener("click", event => {
        vscode.postMessage({
            command: 'serialStop',
            text: 'Closing Serial Port'
        });
    });
}());
window.addEventListener('message', event => {
    let message = event.data;
    document.getElementById("serialText").textContent = message;
});
//# sourceMappingURL=serialConnection.js.map