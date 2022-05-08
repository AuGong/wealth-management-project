let togglePassword = document.getElementById("togglePassword");
let password = document.querySelector("#password");

togglePassword.addEventListener("click", () => {
  // Toggle the type attribute using getAttribure() method
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";

  password.setAttribute("type", type);

  // Toggle the eye and bi-eye icon
  togglePassword.classList.toggle("bi-eye");
});
