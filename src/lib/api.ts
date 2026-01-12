/**
 * API Configuration
 * Centralized API base URL for backend communication
 */

// API base URL - change this to your backend URL in production
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Contact API
 */
export async function submitContactForm(data: { name: string; email: string; message: string }) {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit contact form');
  }

  return response.json();
}

/**
 * Chat API
 */
export async function sendChatMessage(message: string, sessionId: string) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      session_id: sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send chat message');
  }

  return response.json();
}

