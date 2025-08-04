const votes = {};
const formContainer = document.getElementById('formContainer');
const submitBtn = document.getElementById('submitBtn');
const resultsDiv = document.getElementById('results');
const beepSound = document.getElementById('beepSound');

let VotingActive = true;
const positions = ['President', 'Vice President', 'Treasurer', 'Secretary', 'Joint Secretary', 'Cultural Secretary', 'Sports Secretary', 'Sports Representative'];
 
formContainer.addEventListener('submit', function(event) {
  event.preventDefault();
  submitVote();
});

 

function startVoting() {
  formContainer.style.display = 'block';
  submitBtn.style.display = 'inline-block';
  resultsDiv.innerHTML = '';
  VotingActive = true;
}

function submitVote() {
  if (!VotingActive) {
    alert("Voting has ended.");
    return;
  }

  const tempVotes = {};
  
  for (let i = 0; i < positions.length; i++) {
    const position = positions[i];
    const selected = document.querySelector(`input[name='${position}']:checked`);
    
    if (!selected) {
      alert("⚠️ Please vote for all positions before submitting.");
      return; // ⛔ Exit immediately if any vote is missing
    }

    const name = selected.value;
    if (!tempVotes[position]) tempVotes[position] = {};
    tempVotes[position][name] = (tempVotes[position][name] || 0) + 1;
  }

  // ✅ All votes are present — now update the real votes object
  for (let position in tempVotes) {
    if (!votes[position]) votes[position] = {};
    for (let candidate in tempVotes[position]) {
      votes[position][candidate] = (votes[position][candidate] || 0) + tempVotes[position][candidate];
    }
  }

  beepSound.pause();
  beepSound.currentTime = 0;
  beepSound.play().catch((error) => {
    console.log("Beep sound failed:", error);
  });

  formContainer.reset();
  alert("✅ Your vote has been submitted successfully.");
}



function endVoting() {
  formContainer.style.display = 'none';
  submitBtn.style.display = 'none';
  VotingActive = false;
    
  let resultHTML = '<h3>Voting Results</h3>';
  for (let position in votes) {
    resultHTML += `<h4>${position}</h4><ul>`;
    let maxVotes = 0;
    let winner = '';

    for (let candidate in votes[position]) {
      const count = votes[position][candidate];
      if (count > maxVotes) {
        maxVotes = count;
        winner = candidate;
      } displayWinners();
    }

    for (let candidate in votes[position]) {
      const isWinner = candidate === winner ? 'class="winner"' : '';
      resultHTML += `<li ${isWinner}>${candidate} - ${votes[position][candidate]} votes</li>`;
    }

    resultHTML += '</ul>';
  }

  resultsDiv.innerHTML = resultHTML;

  
}


function displayWinners() {
  let resultHTML = '<h3>🏆 Final Winners</h3>';
  for (let position in votes) {
    let maxVotes = 0;
    let winners = [];

    for (let candidate in votes[position]) {
      const count = votes[position][candidate];
      if (count > maxVotes) {
        maxVotes = count;
        winners = [candidate];
      } else if (count === maxVotes) {
        winners.push(candidate); // Handle tie
      }
    }

    resultHTML += `<h4>${position}</h4>`;
    if (winners.length === 1) {
      resultHTML += `<p>Winner: <strong>${winners[0]}</strong> (${maxVotes} votes)</p>`;
    } else {
      resultHTML += `<p>It's a tie between: <strong>${winners.join(', ')}</strong> (${maxVotes} votes each)</p>`;
    }
  }

  resultsDiv.innerHTML = resultHTML;
}
