const net = require('net');
const dgram = require('dgram');
const readline = require('readline');

//CONSOLE INPUT OUTPUT
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//START CLIENT FROM USER'S OPTION TCP OR UDP WITH DYNAMIC IP AND PORT
rl.question('Please enter the protocol (TCP or UDP): ', (protocol) => {
  rl.question('Please enter the IP address: ', (ip) => {
    rl.question('Please enter the port number: ', (port) => {
      if (protocol.toLowerCase() === 'tcp') {
        const client = net.connect({ port: port, host: ip }, () => {
          console.log('Connected to server');
          askForMessage(client);
        });

        client.on('data', (data) => {
          console.log(`Received data: ${data}`);
        });

        client.on('end', () => {
          console.log('Disconnected from server');
        });
      } else if (protocol.toLowerCase() === 'udp') {
        const client = dgram.createSocket('udp4');
        askForMessage(client, ip, port);
      } else {
        console.log('Invalid protocol. Please enter TCP or UDP.');
        rl.close();
      }
    });
  });
});

//ASK MESSAGE FROM USER AND SEND IT DEPENDS ON TCP OR UDP VIA SOCKET
function askForMessage(client, ip, port) {
  rl.question('Please enter the message to send: ', (message) => {
    // WRITE CLOSE TO END CLIENT
    if (message === 'CLOSE') {
        if (client instanceof net.Socket) {
            client.end();
          } else {
            client.close();
          }
          rl.close();
          return;
    }

    //IF TCP CLIENT
    if (client instanceof net.Socket) {
      client.write(message);
    } else { //IF UDP CLIENT
      const buffer = Buffer.from(message);
      client.send(buffer, 0, buffer.length, port, ip, (err) => {
        if (err) throw err;
      });
    }
    //RECURSION UNTIL USER SEND CLOSE MESSAGE
    askForMessage(client, ip, port);
  });
}
