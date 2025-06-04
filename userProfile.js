const mockUserId = sessionStorage.getItem("mockUserId");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userPhone = document.getElementById("userPhone");
const userImg = document.getElementById("userImg");
const alertDiv = document.getElementById("alertDiv");
const inputFirstName = document.getElementById("firstName");
const inputLastName = document.getElementById("lastName");
const inputPhone = document.getElementById("phone");
const inputAge = document.getElementById("Age");

function setupPasswordChange() {
  const oldPassword = document.getElementById("oldPass");
  const newPassword = document.getElementById("newPass");

  const oldVal = oldPassword.value.trim();
  const newVal = newPassword.value.trim();

  const updatedPassword = {
    oldPassword: oldVal,
    newPassword: newVal,
  };
  fetch(`https://api.everrest.educata.dev/auth/change_password`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify(updatedPassword),
  })
    .then((res) => {
      if (!res.ok) {
        showAlert("An Error Occurred While Updating Data", "red");
        return Promise.reject("Update failed");
      }
      showAlert("Profile Updated Successfully", "green");
      return res.json();
    })
    .then((data) => {
      if (data.access_token) {
        sessionStorage.setItem("token", data.access_token);
      }

      const mockUserId = sessionStorage.getItem("mockUserId");
      if (!mockUserId) {
        console.warn("No mockUserId found in sessionStorage.");
        return;
      }

      return fetch(
        `https://68137244129f6313e2114929.mockapi.io/registeredUsers/${mockUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: newVal }),
        }
      );
    })
    .then((res) => {
      if (res && !res.ok) {
        throw new Error("Failed to update password on MockAPI");
      }
      return res?.json();
    })
    .then(() => {
      oldPassword.value = "";
      newPassword.value = "";

      const mockUserId = sessionStorage.getItem("mockUserId");

      fetch("https://68137244129f6313e2114929.mockapi.io/adminNotifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `User ID:${mockUserId} just changed account password!`,
          type: "changePassword",
          timestamp: new Date().toISOString(),
        }),
      });
    })
    .catch((err) => {
      console.error("Password update failed:", err);
      showAlert("An Error Occurred While Updating Data", "red");
    });
}

function fetchUserInfo() {
  fetch("https://api.everrest.educata.dev/auth", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      sessionStorage.setItem("userData", JSON.stringify(data));
      userEmail.textContent = data.email;
      userName.textContent = `${data.firstName + " " + data.lastName}`;
      userPhone.textContent = data.phone;
      userImg.src = data.avatar;
      inputFirstName.placeholder = data.firstName;
      inputLastName.placeholder = data.lastName;
      inputPhone.placeholder = data.phone;
      inputAge.placeholder = data.age;
    });
}

function updateData() {
  let userData = JSON.parse(sessionStorage.getItem("userData"));
  let updatedUser = {
    firstName: inputFirstName.value.trim() || userData.firstName,
    lastName: inputLastName.value.trim() || userData.lastName,
    age: inputAge.value.trim() || userData.age,
    email: userData.email,
    address: userData.address,
    phone: inputPhone.value.trim() || userData.phone,
    zipcode: userData.zipcode,
    avatar: userData.avatar,
    gender: userData.gender,
  };

  console.log(updatedUser);

  fetch("https://api.everrest.educata.dev/auth/update", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify(updatedUser),
  })
    .then((response) => {
      if (!response.ok) {
        showAlert("An error Occurred While Updating Data", "red");
        throw new Error("Failed to update Everrest API");
      }
      return response.json();
    })
    .then(() => {
      showAlert("Profile Updated Successfully", "green");
      fetchUserInfo();

      const mockUserId = sessionStorage.getItem("mockUserId");

      return fetch(
        `https://68137244129f6313e2114929.mockapi.io/registeredUsers/${mockUserId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );
    })
    .then((mockApiResponse) => {
      if (!mockApiResponse.ok) {
        showAlert("Failed to update MockAPI user data", "red");
      }

      const reviewUrl = `https://683b5e1c28a0b0f2fdc47ef9.mockapi.io/reviews/${mockUserId}`;
      return fetch(reviewUrl)
        .then((res) => {
          if (res.ok) {
            return fetch(reviewUrl, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                avatar: updatedUser.avatar,
              }),
            });
          } else if (res.status === 404) {
            return null; 
          } else {
            throw new Error("Failed to check review existence");
          }
        });
    })
    .then((reviewResponse) => {
      if (reviewResponse && !reviewResponse.ok) {
        showAlert("Failed to update user review info", "red");
      }
    })
    .catch((error) => {
      console.error("Update error:", error);
    });
}

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

fetchUserInfo();

const openPfps = document.getElementById("altPfpShow");
const altPfpDiv = document.getElementById("altPfps");

openPfps.addEventListener("click", function () {
  altPfpDiv.classList.toggle("active");
});

let pfpCounter = 1;
const pfpImages = document.querySelectorAll(".altPfp");
const currentPfp = document.getElementById("userImg");

function reloadPfps() {
  pfpImages.forEach((img) => {
    const seed = `alt-${pfpCounter++}`;
    img.src = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`;
    img.setAttribute("data-seed", seed);
    img.classList.remove("selected");
  });
}

pfpImages.forEach((img) => {
  img.addEventListener("click", function () {
    pfpImages.forEach((el) => el.classList.remove("selected"));

    img.classList.add("selected");

    currentPfp.src = img.src;
  });
});

reloadPfps();

function changePfp() {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const mockUserId = sessionStorage.getItem("mockUserId");

  if (!mockUserId) {
    console.error("MockAPI user ID not found in sessionStorage");
    return;
  }

  let newPfp = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    age: userData.age,
    email: userData.email,
    address: userData.address,
    phone: userData.phone,
    zipcode: userData.zipcode,
    avatar: currentPfp.src,
    gender: userData.gender,
  };

  fetch("https://api.everrest.educata.dev/auth/update", {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify(newPfp),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to update avatar on Everrest");
      }
      return res.json();
    })
    .then(() => {
      return fetch(
        `https://68137244129f6313e2114929.mockapi.io/registeredUsers/${mockUserId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPfp),
        }
      );
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to update avatar on MockAPI registeredUsers");
      }
      return res.json();
    })
    .then(() => {
      const reviewUrl = `https://683b5e1c28a0b0f2fdc47ef9.mockapi.io/reviews/${mockUserId}`;
      return fetch(reviewUrl)
        .then((res) => {
          if (res.ok) {
            return fetch(reviewUrl, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                firstName: newPfp.firstName,
                lastName: newPfp.lastName,
                avatar: newPfp.avatar,
              }),
            });
          } else if (res.status === 404) {
            return null; 
          } else {
            throw new Error("Failed to check review existence");
          }
        });
    })
    .then((reviewRes) => {
      if (reviewRes && !reviewRes.ok) {
        showAlert("Failed to update user review info", "red");
      }

      return fetch(
        "https://68137244129f6313e2114929.mockapi.io/adminNotifications",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `User ID:${mockUserId} just changed avatar!`,
            type: "changeData",
            timestamp: new Date().toISOString(),
          }),
        }
      );
    })
    .then(() => {
      showAlert("Profile Updated Successfully", "green");
      fetchUserInfo();
    })
    .catch((error) => {
      console.error("Update error:", error);
    });
}
