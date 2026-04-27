function goToState() {
  const state = document.getElementById('stateSelect').value;
  if (!state) {
    alert('Please select a state first!');
    return;
  }
  window.location.href = '/' + state;
}