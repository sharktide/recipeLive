const sb = supabase.createClient(
    'https://mtlvudsptoqvtoxrbiob.supabase.co',
    'YOUR_SUPABASE_ANON_KEY'
);

sb.auth.getUser()
.then(result => {
    if (result.data && result.data.user) {
        window.location.href = "/myrecipes"
    } else {
        void 0
    }
});


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

document.getElementById("signup").addEventListener("click", signup);
document.getElementById("login").addEventListener("click", login);
