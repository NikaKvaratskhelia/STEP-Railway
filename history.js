const div = document.querySelector(".history-div");
const id = sessionStorage.getItem("mockUserId");

fetch(`https://68137244129f6313e2114929.mockapi.io/registeredUsers/${id}`)
  .then((res) => res.json())
  .then((data) => {
    if (!data.history || data.history.length === 0) {
      div.textContent = "No history available.";
      return;
    }

    data.history.forEach((element, index) => {
      const link = document.createElement("a");
      link.href = 'link.html'
      link.classList.add("ticket-link");
      link.dataset.index = index;

      const svgIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgIcon.setAttribute("class", "ticket-icon");
      svgIcon.setAttribute("viewBox", "0 0 24 24");
      svgIcon.setAttribute("fill", "none");
      svgIcon.innerHTML = `
        <path fill="#E62E2D" d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
        <path fill="#fff" d="M14 2v5h5"/>
        <text x="9" y="17" font-family="Arial" font-size="7" fill="#fff" font-weight="bold">PDF</text>
      `;

      const textSpan = document.createElement("span");
      textSpan.classList.add("ticket-text");
      textSpan.textContent = `Ticket ID: ${element.id}`;

      link.appendChild(svgIcon);
      link.appendChild(textSpan);
      div.appendChild(link);

      link.addEventListener("click", () => {
        sessionStorage.setItem("linkIndex", index);
      });
    });
  })
  .catch((err) => {
    console.error("Error fetching user data:", err);
    div.textContent = "Failed to load history.";
  });
