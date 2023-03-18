const tableDataEvents = document.getElementById("eventsStats");
const backgroundLoader = document.getElementById('back-loader');
const loader = document.getElementById('spinner');

const showLoader = () => {
    backgroundLoader.classList.remove('d-none');
    loader.classList.add('spinner-border');
};

const hideLoader = () => {
    backgroundLoader.classList.add('d-none')
    loader.classList.remove('spinner-border');
};

let data = [];

async function getData() {
  try {
    const apiUrl = "../assets/js/amazing.json";
    const response = await fetch(apiUrl);
    const json = await response.json();
    data = json;
    hideLoader();
    eventStaticstics(data);

    const upcomingEvents = data.events.filter(
      (elem) => elem.date > data.currentDate
    );
    const upEventsStats = getStats(upcomingEvents);
    drawStats(upEventsStats, "upEventsData");

    const pastEvents = data.events.filter(
      (elem) => elem.date < data.currentDate
    );
    const pastEventsStats = getStats(pastEvents);
    drawStats(pastEventsStats, "pastEventsData");
  } catch (error) {
    console.log(error);
  }
}
showLoader();
getData();

function eventStaticstics(array) {
  const highestPercentage = array.events.reduce((prev, current) => {
    const prevPercentage = prev.assistance
      ? prev.assistance / prev.capacity
      : prev.estimate / prev.capacity;
    const currentPercentage = current.assistance
      ? current.assistance / current.capacity
      : current.estimate / current.capacity;
    return prevPercentage > currentPercentage ? prev : current;
  });

  const lowestPercentage = array.events.reduce((prev, current) => {
    const prevPercentage = prev.assistance
      ? prev.assistance / prev.capacity
      : prev.estimate / prev.capacity;
    const currentPercentage = current.assistance
      ? current.assistance / current.capacity
      : current.estimate / current.capacity;
    return prevPercentage < currentPercentage ? prev : current;
  });

  const largestCapacity = array.events.reduce((prev, current) => {
    const prevCapacity = prev.capacity;
    const currentCapacity = current.capacity;
    return prevCapacity > currentCapacity ? prev : current;
  });

  tableDataEvents.innerHTML = `<td>${highestPercentage.name}</td>
    <td>${lowestPercentage.name}</td>
    <td>${largestCapacity.name}</td>`;
}

function getStats(array) {
  const eventsByCategory = [];
  for (const event of array) {
    const categoryIndex = eventsByCategory.findIndex(
      (category) => category.name === event.category
    );
    if (categoryIndex === -1) {
      eventsByCategory.push({
        name: event.category,
        events: [event],
      });
    } else {
      eventsByCategory[categoryIndex].events.push(event);
    }
  }

  const totalsByCategory = [];
  for (const category of eventsByCategory) {
    const eventsInCategory = category.events;
    let revenueTotal = 0;
    let estimateTotal = 0;
    let capacityTotal = 0;
    for (const event of eventsInCategory) {
      revenueTotal += event.price * (event.estimate || event.assistance)
      estimateTotal += event.estimate || event.assistance;
      capacityTotal += event.capacity;
    }
    const percentage = (estimateTotal / capacityTotal) * 100;
    totalsByCategory.push({
      name: category.name,
      revenue: revenueTotal,
      percentage: percentage,
    });
  }

  return totalsByCategory;
}

function drawStats(array, containerId) {
  const container = document.getElementById(containerId);

  array.forEach((item) => {
    const row = document.createElement('tr');

    const categoryCell = document.createElement("td");
    categoryCell.innerText = item.name;
    row.appendChild(categoryCell);

    const revenueCell = document.createElement("td");
    revenueCell.innerText = item.revenue;
    row.appendChild(revenueCell);

    const percentageCell = document.createElement("td");
    percentageCell.innerText = item.percentage.toFixed(2);
    row.appendChild(percentageCell);

  container.appendChild(row);
  });
}