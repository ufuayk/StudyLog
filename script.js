const dateInput = document.getElementById('date');
const minutesInput = document.getElementById('minutes');
const logList = document.getElementById('logList');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const logsPerPage = 5;
let currentPage = 1;

window.addEventListener('load', () => {
    const splash = document.getElementById('splash');
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 2000);
});  

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function loadLogs() {
  const allLogs = JSON.parse(localStorage.getItem('logs') || '[]');
  const sortedLogs = allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalPages = Math.ceil(sortedLogs.length / logsPerPage);
  currentPage = Math.min(currentPage, totalPages || 1);

  const start = (currentPage - 1) * logsPerPage;
  const end = start + logsPerPage;
  const logsToShow = sortedLogs.slice(start, end);

  logList.innerHTML = '';
  logsToShow.forEach((log, index) => {
    const li = document.createElement('li');
    li.textContent = `${formatDate(log.date)} - ${log.minutes} minutes`;
    if (start === 0 && index === 0) li.classList.add('latest');
    logList.appendChild(li);
  });

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function addLog() {
  const date = dateInput.value;
  const minutes = parseInt(minutesInput.value);

  if (!date || isNaN(minutes) || minutes <= 0) {
    alert("Please enter a valid date and minutes.");
    return;
  }

  const logs = JSON.parse(localStorage.getItem('logs') || '[]');
  logs.push({ date, minutes });
  localStorage.setItem('logs', JSON.stringify(logs));
  currentPage = 1;
  loadLogs();
  dateInput.value = '';
  minutesInput.value = '';
}

function clearLogs() {
  if (confirm("Are you sure you want to delete all entries?")) {
    localStorage.removeItem('logs');
    currentPage = 1;
    loadLogs();
  }
}

function nextPage() {
  currentPage++;
  loadLogs();
}

function prevPage() {
  currentPage--;
  loadLogs();
}

loadLogs();