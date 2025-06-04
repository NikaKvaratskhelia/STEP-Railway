const trainDiv = document.getElementById("trainTable");
let popularityData = {};

fetch("https://railway.stepprojects.ge/api/departures")
  .then((response) => response.json())
  .then((data) => {
    let allTrainList = [];
    let wantedTrains = [];

    allTrainList = data;
    allTrainList.forEach((item) => {
      if (
        item.source === sessionStorage.getItem("fromInputValue") &&
        item.destination === sessionStorage.getItem("toInputValue") &&
        item.date === sessionStorage.getItem("georgianWeekDay")
      ) {
        for (let i = 0; i < item.trains.length; i++) {
          wantedTrains.push(item.trains[i]);
        }
      }
    });

    let tr = "";

    if (wantedTrains.length > 0) {
      wantedTrains.forEach(
        (i) =>
          (tr += `
                <tr>
                  <td>
                    <p>#${i.number}</p>
                    <p data-translate="${i.name}">${i.name} Express</p>
                  </td>
                  <td>
                    <p>${i.departure}</p>
                    <p data-translate="${i.from}">${i.from}</p>
                  </td>
                  <td>
                    <p>${i.arrive}</p>
                    <p data-translate="${i.to}">
                    ${i.to}
                    </p>
                  </td>
                  <td>
                    <button class="btn" data-translate='დაჯავშნა'>
                    დაჯავშნა
                    </button>
                  </td>
                  
                  <td id="popularity-${i.id}">Loading...</td>
                </tr>
              `)
      );
    } else {
      tr += `<div class='error-div'><h2 data-translate="სასურველი მატარებელი ვერ მოიძებნა">სასურველი მატარებელი ვერ მოიძებნა </h2>
          <a href='index.html' data-translate="დაბრუნდი უკან">დაბრუნდი უკან</a>
          </div>`;
    }

    trainDiv.innerHTML = tr;

    const btns = document.querySelectorAll(".btn");
    console.log(btns);

    btns.forEach((btn, index) =>
      btn.addEventListener("click", function () {
        window.location.href = "booking.html";

        sessionStorage.setItem("indexOfBtn", index);
        sessionStorage.setItem("trainsArray", JSON.stringify(wantedTrains));
      })
    );

    wantedTrains.forEach((train) => {
      const trainId = train.id;
      fetch(`https://railway.stepprojects.ge/api/trains/${trainId}`)
        .then((res) => res.json())
        .then((data) => {
          let booked = 0;
          let total = 0;

          let vagonPromises = data.vagons.map((vagon) => {
            return fetch(
              `https://railway.stepprojects.ge/api/getvagon/${vagon.id}`
            )
              .then((res) => res.json())
              .then((vagonData) => {
                vagonData[0].seats.forEach((seat) => {
                  total++;
                  if (seat.isOccupied) booked++;
                });
              });
          });

          Promise.all(vagonPromises).then(() => {
            const percent = total > 0 ? Math.round((booked / total) * 100) : 0;
            popularityData[trainId] = { booked, total, percent };

            const percentCell = document.querySelector(
              `#popularity-${trainId}`
            );
            if (percentCell) {
              const percent = popularityData[train.id].percent;
              percentCell.innerHTML = `
              <div style="width: 100px; background: #eee; border-radius: 5px; overflow: hidden;">
                <div style="width: ${percent}%; background: ${
                percent > 80 ? "#e74c3c" : percent > 50 ? "#f1c40f" : "#2ecc71"
              }; height: 12px;"></div>
              </div>
              <small style="font-size:15px; font-weight: 500;">${percent}% <span data-translate="დაჯავშნილია">დაჯავშნილია</span></small>
            `;
            } else {
              console.warn(
                `Could not find element with ID: popularity-${trainId}`
              );
            }
          });
        });
    });
  })
  .catch((err) => {
    
    let tr = "";
    tr +=`<div class='error-div' ><h2 data-translate="სასურველი მატარებელი ვერ მოიძებნა">სასურველი მატარებელი ვერ მოიძებნა </h2>
          <a href='index.html' data-translate="დაბრუნდი უკან">დაბრუნდი უკან</a>
          </div>`;
          
    trainDiv.innerHTML = tr;
  });
