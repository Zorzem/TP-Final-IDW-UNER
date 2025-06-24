document.querySelector("#loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value.trim();

  try {
    const response = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Datos incorrectos");

    const data = await response.json();
    // console.dir(data);

    if (!data.accessToken) {
      throw new Error("Recibido un token inválido");
    }

    console.log("login.js:\n", data.accessToken);

    sessionStorage.setItem("accessToken", data.accessToken);
    sessionStorage.setItem("username", username);

    window.location.href = "../admin/menu.html";
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error al iniciar sesión",
      text: error.message,
    });
  }
});
