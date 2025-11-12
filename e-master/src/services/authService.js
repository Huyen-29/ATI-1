// Simple mock auth service. Replace with real API calls when backend is ready.
export async function signup({ username, email, password }) {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 600));

  // Basic client-side validation (demo)
  if (!email || !password) {
    return { success: false, message: 'Email and password are required' };
  }

  // In a real app you'd POST to your backend here, e.g.:
  // const resp = await fetch('/api/signup', { method: 'POST', body: JSON.stringify({ username, email, password }), headers: { 'Content-Type': 'application/json' } });
  // return await resp.json();

  // Mock successful response
  return { success: true, user: { id: Date.now(), username, email } };
}

export default { signup };
