const sb = supabase.createClient(
    'https://mtlvudsptoqvtoxrbiob.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10bHZ1ZHNwdG9xdnRveHJiaW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDIyMDEsImV4cCI6MjA2NTIxODIwMX0.di-OJWH-iN1dOZvzGl2-7VnL6hwxF-cFu1vAaSveRkk'
);

sb.auth.getUser()
.then(result => {
    if (result.data && result.data.user) {
        window.location.href = "/myrecipes"
    } else {
        void 0
    }
});

const params = new URLSearchParams(window.location.search);
const isResetFlow = params.get("reset") === "true";

if (isResetFlow) {
  document.querySelector("form").style.display = "none"; // Hide main login/signup form
  document.getElementById("reset-section").style.display = "block";

  // Listen for Supabase auth state changes (needed for reset token auth)
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      const btn = document.getElementById("reset-btn");
      btn.addEventListener("click", async () => {
        const newPassword = document.getElementById("new-password").value;

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
          alert("Failed to reset password: " + error.message);
        } else {
          alert("Password updated! You can now sign in.");
          window.location.href = location.pathname; // Remove ?reset=true
        }
      });
    }
  });
}

async function signup() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!email || !password) return showStatus("Please enter valid email and password.");

    const { error } = await sb.auth.signUp({ email, password });
    if (error) return showStatus(error.message);
    showStatus("Signup email sent! Check your inbox.");
}

async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!email || !password) return showStatus("Please enter valid credentials.");

    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return showStatus(error.message);
    window.location.href = "/";
}

function showStatus(message) {
    document.getElementById("status").textContent = message;
}

document.getElementById('github-login').addEventListener('click', async () => {
  const { data, error } = await sb.auth.signInWithOAuth({
    provider: 'github'
  });
  if (error) {
    document.getElementById('status').textContent = 'GitHub login failed';
  }
});


document.getElementById("signup").addEventListener("click", signup);
document.getElementById("login").addEventListener("click", login);

document.getElementById('forgot-password').addEventListener('click', async (e) => {
  e.preventDefault();

  const email = prompt("Enter your email to reset your password:");
  if (!email) return;

  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}${location.pathname}?reset=true`
  });

  if (error) {
    alert("Error: " + error.message);
  } else {
    alert("Password reset email sent. Please check your inbox.");
  }
});
