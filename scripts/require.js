const sb = supabase.createClient(
    'https://mtlvudsptoqvtoxrbiob.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10bHZ1ZHNwdG9xdnRveHJiaW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDIyMDEsImV4cCI6MjA2NTIxODIwMX0.di-OJWH-iN1dOZvzGl2-7VnL6hwxF-cFu1vAaSveRkk'
);

async function logout() {
    await sb.auth.signOut();
    location.reload();
}

// sb.auth.getUser().then(({ data, error }) => {
//     const userInfo = document.getElementById("user-info");
//     if (error || !data.user) {
//         userInfo.textContent = "Not logged in";
//     } else {
//         userInfo.textContent = "Logged in as: " + data.user.email;
//     }
// });

async function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const { error } = await sb.auth.signUp({ email, password });
    if (error) return alert(error.message);
    document.getElementById("status").textContent = "Signup email sent!";
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    window.location.href = "/"; // Redirect on login
}

document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const navItems = document.querySelectorAll(".nav-links a");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });

    navItems.forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove("show");
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', async () => {
  const authLinks = document.getElementById("auth-links");
  const userDropdown = document.getElementById("user-dropdown");
  const profileBtn = document.getElementById("profile-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const dropdownMenu = userDropdown?.querySelector(".dropdown-menu");

  // Only run if navbar elements exist
  if (!authLinks || !userDropdown) return;

  const { data } = await sb.auth.getUser();

  if (data.user) {
    authLinks.style.display = "none";
    userDropdown.style.display = "flex";
  } else {
    authLinks.style.display = "flex";
    userDropdown.style.display = "none";
  }

  profileBtn?.addEventListener("click", () => {
    if (dropdownMenu) {
      dropdownMenu.style.display = dropdownMenu.style.display === "flex" ? "none" : "flex";
    }
  });

  logoutBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    await sb.auth.signOut();
    window.location.reload();
  });
});
