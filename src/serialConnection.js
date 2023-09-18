document.getElementById("connectButtonSerial").addEventListener("click",async () => {
    // Prompt user to select any serial port.
    const port = await navigator.serial.requestPort();

    // Wait for the serial port to open.
    await port.open({ baudRate: 115200 });

    while (port.readable) {
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();

        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    // Allow the serial port to be closed later.
                    reader.releaseLock();
                    break;
                }
                if (value) {
                    document.getElementById("serialText").innerHTML = value;
                    console.log(value);
                }
            }
        } catch (error) {
            // TODO: Handle non-fatal read error.
        }
    }
    
    await port.close();
})