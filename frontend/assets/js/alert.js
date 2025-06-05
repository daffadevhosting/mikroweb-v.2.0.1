function showAlert(message, type = 'info') {
  const alertBox = document.getElementById("globalAlert");
  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;
  alertBox.classList.remove("d-none");

  // Optional: auto-hide setelah 5 detik
  setTimeout(() => {
    alertBox.classList.add("d-none");
  }, 5000);
}

function showToast(header, message, type = 'primary') {
    const toastEl = document.getElementById('liveToast');
    const toastHeader = document.getElementById('toastHeadr');
    const toastHead = document.getElementById('toast-head');
    const toastBody = document.getElementById('toast-body');

    toastHead.innerText = header;
    toastBody.innerText = message;
    toastEl.className = `toast align-items-center text-bg-${type} border-0`;
    toastHeader.className = `toast-header text-bg-${type}`;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}