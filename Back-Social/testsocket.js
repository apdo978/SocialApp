const { io } = require('./node_modules/socket.io-client');

const socket = io('http://127.0.0.1:5000', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzU4MWIzMTgwMWMzMjdhOThiNDg5YyIsImlhdCI6MTc1Mjk1MzQ1MSwiZXhwIjoxNzU1NTQ1NDUxfQ.EHRoyxo0nXSvLELrz3Isw8R0IvYNlaX2yGb52RvAtAQ'
  }
});

socket.on('connect', () => {
  console.log('🟢 Connected as second user!');
});
socket.on('connect_error', err => {
  console.error('❌ Error:', err.message);
});
socket.on('chat accessed', (data) => {
  console.log('📥 Chat accessed event received:', data);
});
socket.on('new friend request', (data) => {
  console.log('📥 Chat accessed event received:', data);
});
socket.on('new message', (messageData) => {
  console.log('📥 New message received:');
  console.log(messageData);

  // تقدر هنا تحط أي لوجيك عايز تعمله لما توصلك الرسالة
  handleIncomingMessage(messageData);
});
function handleIncomingMessage(message) {
  console.log('👉 Handling message...');
  console.log('From:', message.sender);
  console.log('Text:', message.content);
  console.log('At:', message.createdAt);
}

socket.on('new chat', (data) => {
  console.log('📥 New chat event received:', data);
});