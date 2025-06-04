const submitBtn = document.getElementById("submitButton");
const input = document.getElementById("reviewInput");
const section = document.getElementById("reviews");
const stars = document.querySelectorAll("#rating span");
const admin = sessionStorage.getItem("isAdmin") === "true";
const mockUserId = sessionStorage.getItem("mockUserId");

fetch(
  `https://68137244129f6313e2114929.mockapi.io/registeredUsers/${mockUserId}`
)
  .then((res) => res.json())
  .then((data) => sessionStorage.setItem("userMockData", JSON.stringify(data)))
  .catch((err) => console.error("Failed to load user mock data:", err));

let selectedRating = 0;

stars.forEach((star) => {
  star.addEventListener("mouseover", () => {
    const value = parseInt(star.getAttribute("data-value"));
    highlightStars(value);
  });

  star.addEventListener("mouseout", () => {
    highlightStars(selectedRating);
  });

  star.addEventListener("click", () => {
    selectedRating = parseInt(star.getAttribute("data-value"));
    highlightStars(selectedRating);
  });
});

function highlightStars(rating) {
  stars.forEach((star) => {
    const value = parseInt(star.getAttribute("data-value"));
    if (value <= rating) {
      star.classList.add("selected");
    } else {
      star.classList.remove("selected");
    }
  });
}

function addReview() {
  if (admin) {
    showAlert("Admins cannot write reviews", "red");
    return;
  }

  let userData = JSON.parse(sessionStorage.getItem("userMockData"));

  if (selectedRating === 0) {
    showAlert("Please select a star rating", "red");
    return;
  }
  if (!input.value.trim()) {
    showAlert("Please write a review comment", "red");
    return;
  }

  let newReview = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    age: userData.age,
    email: userData.email,
    address: userData.address,
    phone: userData.phone,
    zipcode: userData.zipcode,
    avatar: userData.avatar,
    gender: userData.gender,
    id: mockUserId,
    comment: input.value.trim(),
    rating: selectedRating,
  };

  fetch("https://683b5e1c28a0b0f2fdc47ef9.mockapi.io/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newReview),
  })
    .then((res) => {
      if (res.ok) {
        showAlert("Review Added Successfully", "green");
        input.value = "";
        selectedRating = 0;
        highlightStars(0);
        loadReviews();
      } else {
        showAlert("Failed to add review", "red");
      }
    })
    .catch(() => {
      showAlert("Network error", "red");
    });
}

submitBtn.addEventListener("click", addReview);

function loadReviews() {
  fetch("https://683b5e1c28a0b0f2fdc47ef9.mockapi.io/reviews")
    .then((res) => res.json())
    .then((data) => {
      let div = "";
      data.forEach((review) => {
        const rating = review.rating || 0;
        const starsDisplay = "★".repeat(rating) + "☆".repeat(5 - rating);
        div += `<div class="review" data-id="${review.id}">
  <img src="${review.avatar}" alt="User" />
  <div class="name">${review.firstName} ${review.lastName}</div>
  <div class="text">${review.comment}</div>
  <div class="stars">${starsDisplay}</div>
  ${
    admin
      ? `<button class="delete-btn" onclick="deleteReview('${review.commentId}')">Delete</button>`
      : ""
  }
</div>`;
      });
      section.innerHTML = div;
    })
    .catch(() => {
      section.innerHTML = "<p>Failed to load reviews.</p>";
    });
}

loadReviews();

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

function deleteReview(id) {
  if (!confirm("Are you sure you want to delete this review?")) return;

  fetch(`https://683b5e1c28a0b0f2fdc47ef9.mockapi.io/reviews/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
        showAlert("Review deleted successfully", "green");
        loadReviews();
      } else {
        showAlert("Failed to delete review", "red");
      }
    })
    .catch(() => {
      showAlert("Network error", "red");
    });
}
