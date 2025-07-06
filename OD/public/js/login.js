const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const message = document.getElementById("message");

loginTab.onclick = () => {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
};

registerTab.onclick = () => {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
  loginTab.classList.remove("active");
  registerTab.classList.add("active");
};

loginForm.onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    window.location.href = "index.html";
  } else {
    message.textContent = data.message;
  }
};

registerForm.onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    message.textContent = "Registratie gelukt, je kan nu inloggen.";
    loginTab.click();
  } else {
    message.textContent = data.message;
  }
};
