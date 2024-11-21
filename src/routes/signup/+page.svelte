<script>
  let username = '';
  let password = '';
  let confirmPassword = '';
  let error = '';
  let successMessage = '';

  async function signUp() {
    if (password !== confirmPassword) {
      error = 'Passwords do not match.';
      return;
    }

    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      successMessage = 'Account created successfully! Please login.';
      error = '';
    } else {
      error = 'Failed to create an account. Please try again.';
    }
  }
</script>

<main class="signup-container">
  <div class="signup-box">
    <h1>Sign Up</h1>
    <form on:submit|preventDefault={signUp}>
      <input type="text" bind:value={username} placeholder="Username" required />
      <input type="password" bind:value={password} placeholder="Password" required />
      <input type="password" bind:value={confirmPassword} placeholder="Confirm Password" required />
      <button type="submit">Sign Up</button>
    </form>
    {#if error}
      <p class="error-message">{error}</p>
    {/if}
    {#if successMessage}
      <p class="success-message">{successMessage}</p>
    {/if}
    <p class="login-prompt">Already have an account? <a href="/login">Login here</a>.</p>
  </div>
</main>

<style>
  /* Main container for centering content */
  .signup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f6f9;
  }

  /* Styling the signup box */
  .signup-box {
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

  .success-message {
    color: green;
    font-size: 14px;
    margin-top: 10px;
  }

  .login-prompt {
    margin-top: 20px;
    font-size: 14px;
    color: #666;
  }

  .login-prompt a {
    color: #4A90E2;
    text-decoration: none;
  }

  .login-prompt a:hover {
    text-decoration: underline;
  }
</style>
