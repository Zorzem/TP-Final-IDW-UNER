
// Toggle password visibility
const togglePassword = document.querySelector("#togglePassword");
const passwordInput = document.querySelector("#password");

togglePassword.addEventListener("click", function () {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.classList.toggle("bi-eye");
    this.classList.toggle("bi-eye-slash");
});

// Validación de login
document.querySelector("#loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    try {
    const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { 
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Usuario o contraseña incorrectos");

    const data = await response.json();

    if (!data.accessToken) throw new Error("Token inválido");

    sessionStorage.setItem("accessToken", data.accessToken);
    sessionStorage.setItem("username", username);

    Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        timer: 1500,
        showConfirmButton: false
    });

    setTimeout(() => {
        window.location.href = "../admin/menu.html";
    }, 1600);

    } catch (err) {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message
    });
    }
});