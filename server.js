const net = require('net');
const dgram = require('dgram');
const readline = require('readline');

//CONSOLE INPUT OUTPUT
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//START SERVER FROM USER'S OPTION TCP OR UDP WITH DYNAMIC IP AND PORT
rl.question('Please enter the protocol (TCP or UDP): ', (protocol) => {
  rl.question('Please enter the IP address: ', (ip) => {
    rl.question('Please enter the port number: ', (port) => {
      rl.close();
      
      if (protocol.toLowerCase() === 'tcp') {
        startTcpServer(ip, port);
      } else if (protocol.toLowerCase() === 'udp') {
        startUdpServer(ip, port);
      } else {
        console.log('Invalid protocol. Please enter TCP or UDP.');
      }
    });
  });
});

//TCP SERVER START FUNCTION
function startTcpServer(ip, port) {
  const server = net.createServer((socket) => {
    console.log('Client connected');
  
    socket.on('data', (data) => {
      console.log(`Received data: ${data}`);
      socket.write(`Echo: ${data}`);
    });
  
    socket.on('end', () => {
      console.log('Client disconnected');
    });
  });
  
  server.listen(port, ip, () => {
    console.log(`TCP Server is listening on ${ip}:${port}`);
  });
}

//UDP SERVER START FUNCTION
function startUdpServer(ip, port) {
  const server = dgram.createSocket('udp4');
  
  server.on('message', (msg, rinfo) => {
    console.log(`Received data: ${msg}`);
    server.send(`Echo: ${msg}`, rinfo.port, rinfo.address);
  });
  
  server.bind(port, ip, () => {
    console.log(`UDP Server is listening on ${ip}:${port}`);
  });
}
