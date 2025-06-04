const signUpName = document.getElementById("signUpName");
const signUpLastname = document.getElementById("signUpLastname");
const signUpAge = document.getElementById("signUpAge");
const signUpEmail = document.getElementById("signUpEmail");
const signUpPassword = document.getElementById("signUpPassword");
const signUpAddress = document.getElementById("signUpAddr");
const signUpPhone = document.getElementById("signUpPhone");
const signUpZIP = document.getElementById("signUpZIP");
const signUpAvatar = "https://api.dicebear.com/7.x/pixel-art/svg?seed=Jane";
const signUpGender = document.getElementById("signUpGender");
const signUpForm = document.querySelector(".signUpForm");
const zipRegex = /^\d{4}$/;
const phoneRegex = /^\+\d{1,3}[-\s]?\d{3,14}([-\s]?\d{2,4})*$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const signUpStatus = document.getElementById("signUpStatus");

const loader = document.querySelector(".loader-wrapper");

signUpForm.addEventListener("submit", function (e) {
  e.preventDefault();
  loader.style.display = "flex"; 

  let valid = true;

  if (!zipRegex.test(signUpZIP.value.trim())) {
    alert("ZIP code must be exactly 4 digits.");
    signUpZIP.style.borderColor = "red";
    valid = false;
    loader.style.display = "none"; 
    return;
  }

  if (!phoneRegex.test(signUpPhone.value.trim())) {
    alert("Phone number must include country code and start with '+'!");
    signUpPhone.style.borderColor = "red";
    valid = false;
    loader.style.display = "none";
    return;
  }

  if (!passwordRegex.test(signUpPassword.value.trim())) {
    alert("Weak Password! Please choose a stronger one.");
    signUpPassword.style.borderColor = "red";
    valid = false;
    loader.style.display = "none";
    return;
  }

  if (valid) {
    const newUser = {
      firstName: signUpName.value.trim(),
      lastName: signUpLastname.value.trim(),
      age: signUpAge.value.trim(),
      email: signUpEmail.value.trim(),
      password: signUpPassword.value.trim(),
      address: signUpAddress.value.trim(),
      phone: signUpPhone.value.trim(),
      zipcode: signUpZIP.value.trim(),
      avatar: signUpAvatar,
      gender: signUpGender.value.trim(),
    };

    fetch("https://api.everrest.educata.dev/auth/sign_up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "An unexpected error occurred.");
        }

        await fetch(
          "https://68137244129f6313e2114929.mockapi.io/adminNotifications",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: `${newUser.firstName} just signed up.`,
              type: "signup",
              timestamp: new Date().toISOString(),
            }),
          }
        );

        await fetch(
          "https://68137244129f6313e2114929.mockapi.io/registeredUsers",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
          }
        );

        return data;
      })
      .then((data) => {
        loader.style.display = "none"; 
        sessionStorage.setItem("newUser", JSON.stringify(data));
        showAlert("Successfully signed up!<br> Verification Email was sent to you, please verify and then sign in!", "green");
      })
      .catch((err) => {
        loader.style.display = "none";
        showAlert(`Sign-up failed: ${err.message}`, "red");
      });
  }
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
  }, 5000);
}

let burgerBtn = document.querySelector(".burger-btn");

burgerBtn.addEventListener("click", function () {
  document.querySelector(".burger-menu-list").classList.add("active");
});

let closeBtn = document.querySelector(".closeBtn");

closeBtn.addEventListener("click", function () {
  document.querySelector(".burger-menu-list").classList.remove("active");
});