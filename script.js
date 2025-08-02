// ✅ Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔐 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDqSSTnamE6ZW79O4X-Fn2CPwi4R3BCE4c",
  authDomain: "transaction-fd4ff.firebaseapp.com",
  projectId: "transaction-fd4ff",
  storageBucket: "transaction-fd4ff.appspot.com",
  messagingSenderId: "364088936708",
  appId: "1:364088936708:web:a15fd1665af367bd48a851",
  measurementId: "G-QT79K2WJGD"
};

// 🔌 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📋 Render filtered transactions
function loadTransactions() {
  const dateFilter = document.getElementById("date-filter");
  const statusFilter = document.getElementById("status-filter");
  const tableBody = document.getElementById("transaction-table-body");

  const q = query(collection(db, "transactions"), orderBy("timestamp", "desc"));

  onSnapshot(q, (snapshot) => {
    tableBody.innerHTML = "";

    snapshot.forEach((doc) => {
      const data = doc.data();
      const transactionDate = data.date;
      const selectedDate = dateFilter.value;
      const selectedStatus = statusFilter.value;

      const isDateMatch = !selectedDate || transactionDate === selectedDate;
      const isStatusMatch = !selectedStatus || data.status === selectedStatus;

      if (isDateMatch && isStatusMatch) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${data.user || "-"}</td>
          <td>${transactionDate}</td>
          <td>${data.amount || "-"}</td>
          <td>${data.status || "-"}</td>
        `;
        tableBody.appendChild(row);
      }
    });
  });
}

// 🔁 Populate date dropdown from Firestore
function populateDateDropdown() {
  const dateFilter = document.getElementById("date-filter");
  const q = query(collection(db, "transactions"));

  onSnapshot(q, (snapshot) => {
    const dates = new Set();

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.date) {
        dates.add(data.date);
      }
    });

    // Update dropdown
    dateFilter.innerHTML = `<option value="">All Dates</option>`;
    Array.from(dates)
      .sort((a, b) => new Date(b) - new Date(a))
      .forEach((date) => {
        const option = document.createElement("option");
        option.value = date;
        option.textContent = date;
        dateFilter.appendChild(option);
      });
  });
}

// 🧪 Add dummy data (optional use)
async function addDummyTransactions(count = 50) {
  const transactionsRef = collection(db, "transactions");
  const users = ["Ali", "Fatima", "Bilal", "Areeba", "Ahmed"];
  const statuses = ["Success", "Pending", "Failed"];
  const amounts = [100, 200, 500, 750, 1000];

  for (let i = 0; i < count; i++) {
    const fakeDate = new Date();
    fakeDate.setDate(fakeDate.getDate() - Math.floor(Math.random() * 30));

    await addDoc(transactionsRef, {
      user: users[Math.floor(Math.random() * users.length)],
      date: fakeDate.toISOString().split("T")[0],
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: serverTimestamp()
    });
  }

  alert(`✅ ${count} Dummy Transactions added!`);
}

// 🚀 Init page
window.addEventListener("DOMContentLoaded", () => {
  const dateFilter = document.getElementById("date-filter");
  const statusFilter = document.getElementById("status-filter");

  // Events
  dateFilter?.addEventListener("change", loadTransactions);
  statusFilter?.addEventListener("change", loadTransactions);

  // Initial load
  loadTransactions();
  populateDateDropdown();
});
