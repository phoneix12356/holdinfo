
document.addEventListener('DOMContentLoaded', function() {
  
  fetchData();

  
  let countdown = 60;
  const countdownElement = document.getElementById('countdown');
  setInterval(() => {
      countdown--;
      if (countdown < 0) {
          countdown = 60;
          fetchData();
      }
      countdownElement.textContent = countdown;
  }, 1000);
});

function fetchData() {
  axios.get("https://holdinfo-rho.vercel.app/api/tickers")
    .then(response => {
      console.log(response.data);
      populateTable(response.data);
      updateStats(response.data);
    })
    .catch(err => console.log('Error fetching data:', err));
}

function populateTable(data) {
  const tableBody = document.querySelector('#cryptoTable tbody');
  tableBody.innerHTML = '';

  data.forEach((item, index) => {
      const row = tableBody.insertRow();
      row.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.name}</td>
          <td>₹ ${parseFloat(item.last).toLocaleString('en-IN')}</td>
          <td>₹ ${parseFloat(item.buy).toLocaleString('en-IN')} / ₹ ${parseFloat(item.sell).toLocaleString('en-IN')}</td>
          <td>${calculateDifference(item.buy,item.sell)}%</td>
          <td>₹ ${calculateSavings(item.buy, item.sell).toLocaleString('en-IN')}</td>
      `;
  });
}

function updateStats(data) {
  if (data.length > 0) {
      const bestPrice = Math.max(...data.map(item => parseFloat(item.last)));
      document.getElementById('bestPrice').textContent = `₹ ${bestPrice.toLocaleString('en-IN')}`;
      document.getElementById('difference').textContent = '0.1%';
      document.getElementById('savings').textContent = '▲ ₹ 1,272';
  }
}

function calculateDifference(buy, sell) {
  console.log(buy,sell);
  let buyValue = parseFloat(buy);
  let sellValue = parseFloat(sell);
  
  if (buyValue === 0) {
    return 0;
  }

  const diff = ((sellValue - buyValue) / buyValue) * 100;
  console.log(diff);
  return diff;
}


function calculateSavings(buy, sell) {
  return Math.abs(sell - buy);
}

const toggle = document.getElementById('modeToggle');
const body = document.body;

toggle.addEventListener('change', function() {
  if (this.checked) {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
});


if (localStorage.getItem('darkMode') === 'enabled') {
  body.classList.add('dark-mode');
  toggle.checked = true;
}


toggle.addEventListener('change', function() {
  if (this.checked) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});