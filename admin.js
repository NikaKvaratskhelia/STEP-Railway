if (
  sessionStorage.getItem("isAdmin") === "false" ||
  !sessionStorage.getItem("isAdmin")
) {
  window.location.href = "signIn.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#userTable tbody");
  const noUsers = document.getElementById("noUsers");

  function loadUsers() {
    fetch("https://68137244129f6313e2114929.mockapi.io/registeredUsers")
      .then((res) => res.json())
      .then((users) => {
        tableBody.innerHTML = "";
        if (users.length === 0) {
          noUsers.innerHTML = "No One Is Registered On your Web Site!";
        } else {
          users.forEach((user) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${user.id}</td>
              <td><img src="${user.avatar}" alt="user avatar"/></td>
              <td>${user.firstName} ${user.lastName}</td>
              <td>${user.email}</td>
              <td>${user.phone}</td>
              <td>${user.zipcode}</td>
              <td><button class="btn btn-danger" data-id="${user.id}">Delete</button></td>
            `;
            tableBody.appendChild(row);
          });

          document.querySelectorAll(".btn-danger").forEach((btn) => {
            btn.addEventListener("click", () => {
              const id = btn.getAttribute("data-id");
              const userName = btn.closest("tr").children[2].textContent;
              if (confirm(`Are you sure you want to delete ${userName}?`)) {
                fetch(
                  `https://68137244129f6313e2114929.mockapi.io/registeredUsers/${id}`,
                  {
                    method: "DELETE",
                  }
                )
                  .then(() => {
                    showAlert("Successfully deleted user!", "green")
                    loadUsers();

                    fetch(
                      "https://68137244129f6313e2114929.mockapi.io/adminNotifications",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          message: `You deleted ${userName}'s account`,
                          type: "delete",
                          timestamp: new Date().toISOString(),
                        }),
                      }
                    );

                    fetchNotifications();
                  })
                  .catch((error) => showAlert("Failed to Delete User", "red"));
              }
            });
          });
        }
      })
      .catch(() => {
        tableBody.innerHTML =
          "<tr><td colspan='6'>Error loading users.</td></tr>";
      });
  }

  loadUsers();
});

function fetchNotifications() {
  fetch("https://68137244129f6313e2114929.mockapi.io/adminNotifications")
    .then((res) => res.json())
    .then((notifications) => {
      const list = document.getElementById("notificationList");
      list.innerHTML = "";

      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Tbilisi",
      });

      const todaysNotifications = notifications.filter((n) => {
        const notifDate = new Date(n.timestamp).toLocaleDateString("en-CA", {
          timeZone: "Asia/Tbilisi",
        });
        return notifDate === today;
      });

      if (todaysNotifications.length === 0) {
        const li = document.createElement("li");
        li.innerHTML = "NO notifications yet!";
        list.appendChild(li);
      } else {
        todaysNotifications.reverse().forEach((n) => {
          const li = document.createElement("li");
          li.textContent = `${n.message} (${new Date(
            n.timestamp
          ).toLocaleString("en-GB", { timeZone: "Asia/Tbilisi" })})`;
          list.appendChild(li);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching notifications:", error);
    });
}

setInterval(() => {
  fetchNotifications();
}, 10000);

fetchNotifications();

const analyticSignUp = document.getElementById("analyticSignUp");
const analyticSignIn = document.getElementById("analyticSignIn");
const analyticSignOut = document.getElementById("analyticSignOut");
const analyticChangeData = document.getElementById("analyticChangeData");
const ticketCount = document.getElementById("analyticsTicket");
const ticketDeleted = document.getElementById("ticketDeletedCount");

async function fetchTodaysAnalytics() {
  try {
    const response = await fetch(
      "https://68137244129f6313e2114929.mockapi.io/adminNotifications"
    );
    const data = await response.json();

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Tbilisi",
    });

    let signUpCount = 0;
    let signInCount = 0;
    let signOutCount = 0;
    let changeDataCount = 0;
    let ticketRegisteredCount = 0;
    let ticketDeletedCount = 0;

    data.forEach((entry) => {
      const entryDate = new Date(entry.timestamp).toLocaleDateString("en-CA", {
        timeZone: "Asia/Tbilisi",
      });

      if (entryDate === today) {
        // Debug log to inspect entry types
        console.log("Type detected:", entry.type);

        switch (entry.type) {
          case "signup":
            signUpCount++;
            break;
          case "signIn":
            signInCount++;
            break;
          case "signOut":
            signOutCount++;
            break;
          case "changeData":
          case "changePassword":
            changeDataCount++;
            break;
          case "ticketRegistered":
            ticketRegisteredCount++;
            break;
          case "ticketDeleted":
            ticketDeletedCount++;
            break;
          default:
            break;
        }
      }
    });

    analyticSignUp.textContent = signUpCount;
    analyticSignIn.textContent = signInCount;
    analyticSignOut.textContent = signOutCount;
    analyticChangeData.textContent = changeDataCount;
    ticketCount.textContent = ticketRegisteredCount;
    ticketDeleted.textContent = ticketDeletedCount; 
  } catch (error) {
    console.error("Error fetching analytics data:", error);
  }
}

window.addEventListener("DOMContentLoaded", fetchTodaysAnalytics);

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