<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let username = '';
  let password = '';
  let error = '';

  async function login() {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token); // Save token locally
      goto('/'); // Redirect to the todo page
    } else {
      error = 'Invalid credentials';
    }
  }
</script>

<main class="login-container">
  <div class="login-box">
    <h1>Login</h1>
    <form on:submit|preventDefault={login}>
      <input type="text" bind:value={username} placeholder="Username" required />
      <input type="password" bind:value={password} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    {#if error}
      <p class="error-message">{error}</p>
    {/if}
    <p class="signup-prompt">Don't have an account? <a href="/signup">Sign up here</a>.</p>
  </div>
</main>

<style>
  /* Main container for centering content */
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f6f9;
  }

  /* Styling the login box */
  .login-box {
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  h1 {
    margin-bottom: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 600;
    color: #333;
  }

  input {
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    box-sizing: border-box;
    transition: border-color 0.3s ease-in-out;
  }

  input:focus {
    outline: none;
    border-color: #4A90E2;
  }

  button {
    width: 100%;
    padding: 12px;
    background-color: #4A90E2;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
  }

  button:hover {
    background-color: #357ABD;
  }

  .error-message {
    color: red;
    font-size: 14px;
    margin-top: 10px;
  }

  .signup-prompt {
    margin-top: 20px;
    font-size: 14px;
    color: #666;
  }

  .signup-prompt a {
    color: #4A90E2;
    text-decoration: none;
  }

  .signup-prompt a:hover {
    text-decoration: underline;
  }
</style>
