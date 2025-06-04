const signInEmail = document.getElementById("signInEmail");
const signInPassword = document.getElementById("signInPass");
const form = document.querySelector(".signInForm");
const recover = document.getElementById("recover");
const loaderWrapper = document.querySelector(".loader-wrapper");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = signInEmail.value.trim();
  const password = signInPassword.value.trim();

  if (!email || !password) {
    showAlert("Please fill in all fields", "red");
    return;
  }

  loaderWrapper.style.display = "flex";

  const userDetails = { email, password };

  if (email === "admin@gmail.com" && password === "admin123") {
    sessionStorage.setItem("isAdmin", "true");
    loaderWrapper.style.display = "none";
    showAlert("Sign In Successful", "green");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } else {
    sessionStorage.setItem("isAdmin", "false");

    fetch("https://api.everrest.educata.dev/auth/sign_in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userDetails),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          return fetch(
            "https://68137244129f6313e2114929.mockapi.io/registeredUsers"
          )
            .then((res) => res.json())
            .then((mockUsers) => {
              const userExistsInMock = mockUsers.find(
                (user) => user.email === email
              );

              if (userExistsInMock) {
                sessionStorage.setItem("token", data.access_token);
                sessionStorage.setItem("mockUserId", userExistsInMock.id);

                return fetch(
                  "https://68137244129f6313e2114929.mockapi.io/adminNotifications",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      message: `${
                        userExistsInMock.firstName || "A user"
                      } signed in.`,
                      type: "signIn",
                      timestamp: new Date().toISOString(),
                    }),
                  }
                ).then(() => {
                  showAlert("Sign In successful!", "green");
                  setTimeout(() => {
                    loaderWrapper.style.display = "none";
                    window.location.href = "index.html";
                  }, 1000);
                });
              } else {
                loaderWrapper.style.display = "none";
                showAlert("Sign In Failed, user not authorized", "red");
              }
            });
        } else {
          loaderWrapper.style.display = "none";
          showAlert("Sign In Failed", "red");
        }
      })
      .catch((err) => {
        loaderWrapper.style.display = "none";
        showAlert("Sign In Failed", "red");
        console.error(err);
      });
  }
});

recover.addEventListener("click", function () {
  window.location.href = "recover.html";
});

function showAlert(message, color) {
  const alertDiv = document.getElementById("alertDiv");
  alertDiv.innerHTML = message;
  alertDiv.style.backgroundColor = color;
  alertDiv.style.bottom = "30px";
  alertDiv.style.opacity = "1";

  setTimeout(() => {
    alertDiv.style.bottom = "-100px";
    alertDiv.style.opacity = "0";
  }, 2000);
}
