const API_URL = '/api';

async function fetchAPI(method, endpoint, body = {}) {
  const response = await fetch(`${endpoint}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.Error || 'Solicitud API fallida');
  }

  return data;
}

export async function getUsers() {
  return fetchAPI('POST', '/users/getUsers');
}

export async function getChatHistory(chatId, producer, consumer) {
  return fetchAPI('POST', '/chat/getChatHistory', { chat_id: chatId, producer: producer, consumer: consumer });
}

export async function getOnlineUsers() {
  return fetchAPI('POST', '/chat/getOnlineUsers');
}

export async function getToken() {
  return fetchAPI('POST', '/auth/token')
}

export async function uploadChatFiles(formData) {
  const response = await fetch('/media/upload', {
    method: 'POST',
    credentials: 'include',
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'File upload failed');
  }

  return data;
} 
