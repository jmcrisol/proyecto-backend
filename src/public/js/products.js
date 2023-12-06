const socket = io();

socket.on('realtimeProducts', (realtimeProducts) => {

    console.log('Productos en tiempo real:', realtimeProducts);
  });
