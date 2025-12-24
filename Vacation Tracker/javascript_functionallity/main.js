// JS file for vacationTracker app

// -------------
// Variable declarations
// -------------
const newVacationFormEl = document.getElementsByTagName("form")[0];
const startDateInputEl = document.getElementById("start-date");
const endDateInputEl = document.getElementById("end-date");
const pastVacationContainer = document.getElementById("past-vacations");

// Storage key is an app-wide constant
const STORAGE_KEY = "vacation-tracker";

// -------------
// Event Handlers
// -------------
newVacationFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const startDate = startDateInputEl.value;
  const endDate = endDateInputEl.value;
  if (checkDatesInvalid(startDate, endDate)) {
    return;
  }
  storeNewVacation(startDate, endDate);
  renderPastVacations();
  newVacationFormEl.reset();
});

// -------------
// Functionality
// -------------

// 1. Form validation
function checkDatesInvalid(startDate, endDate) {
  if (!startDate || !endDate || startDate > endDate) {
    newVacationFormEl.reset();
    return true;
  }
  return false;
}

// 2. Get, add, sort, and store data
function storeNewVacation(startDate, endDate) {
  const vacations = getAllStoredVacations();
  vacations.push({ startDate, endDate });
  vacations.sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  });
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vacations));
}

// 3. Get and parse data
function getAllStoredVacations() {
  const data = window.localStorage.getItem(STORAGE_KEY);
  const vacations = data ? JSON.parse(data) : [];
  return vacations;
}

// 4. Display data
function renderPastVacations() {
  const pastVacationHeader = document.createElement("h2");
  const pastVacationList = document.createElement("ul");
  const vacations = getAllStoredVacations();
  if (vacations.length === 0) {
    return;
  }
  pastVacationContainer.innerHTML = "";
  pastVacationHeader.textContent = "Past vacations";
  vacations.forEach((vacation) => {
    const vacationEl = document.createElement("li");
    vacationEl.textContent = `From ${formatDate(
      vacation.startDate,
    )} to ${formatDate(vacation.endDate)}`;
    pastVacationList.appendChild(vacationEl);
  });

  pastVacationContainer.appendChild(pastVacationHeader);
  pastVacationContainer.appendChild(pastVacationList);
}

// 5. format dates for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { timeZone: "UTC" });
}

// -------------
// Call render on page load
// -------------

renderPastVacations();

let installPrompt = null;
const installButton = document.querySelector("#install");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.removeAttribute("hidden");
});


installButton.addEventListener("click", async () => {
  if (!installPrompt) {
    return;
  }
  const result = await installPrompt.prompt();
  console.log(`Install prompt was: ${result.outcome}`);
  disableInAppInstallPrompt();
});

function disableInAppInstallPrompt() {
  installPrompt = null;
  installButton.setAttribute("hidden", "");
}

window.addEventListener("appinstalled", () => {
  disableInAppInstallPrompt();
});
