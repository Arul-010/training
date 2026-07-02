// Game Variables
let secretNumber;
let attemptsLeft;
let attemptsUsed;
let guessHistory;
const MAX_ATTEMPTS = 10;
const MIN_NUMBER = 1;
const MAX_NUMBER = 100;

// Initialize the game
function initGame() {
    secretNumber = Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
    attemptsLeft = MAX_ATTEMPTS;
    attemptsUsed = 0;
    guessHistory = [];
    
    document.getElementById('feedback').textContent = '';
    document.getElementById('message').textContent = '';
    document.getElementById('attemptsLeft').textContent = attemptsLeft;
    document.getElementById('attemptsUsed').textContent = attemptsUsed;
    document.getElementById('lastGuess').textContent = '-';
    document.getElementById('guessHistory').innerHTML = '';
    document.getElementById('guessInput').value = '';
    document.getElementById('guessInput').focus();
    
    console.log('Secret number:', secretNumber); // For debugging
}

// Check the guess
function checkGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = parseInt(guessInput.value);
    
    // Validation
    if (isNaN(guess) || guess < MIN_NUMBER || guess > MAX_NUMBER) {
        document.getElementById('feedback').textContent = '⚠️ Invalid input!';
        document.getElementById('feedback').className = 'feedback';
        document.getElementById('message').textContent = `Please enter a number between ${MIN_NUMBER} and ${MAX_NUMBER}`;
        return;
    }
    
    // Check if already guessed
    if (guessHistory.includes(guess)) {
        document.getElementById('feedback').textContent = '🔄 Already guessed!';
        document.getElementById('feedback').className = 'feedback';
        document.getElementById('message').textContent = `You already guessed ${guess}!`;
        return;
    }
    
    // Add to history
    guessHistory.push(guess);
    attemptsUsed++;
    attemptsLeft--;
    
    // Update display
    document.getElementById('attemptsUsed').textContent = attemptsUsed;
    document.getElementById('attemptsLeft').textContent = attemptsLeft;
    document.getElementById('lastGuess').textContent = guess;
    addGuessToHistory(guess);
    
    // Check the guess
    if (guess === secretNumber) {
        winGame(guess);
    } else {
        const diff = Math.abs(secretNumber - guess);
        let feedbackText = '';
        let messageText = '';

        if (guess < secretNumber) {
            document.getElementById('feedback').className = 'feedback too-low';
            if (diff <= 2) {
                feedbackText = '🔥 Too close! Keep it up!';
                messageText = `You're extremely close! The number is just above ${guess}.`;
            } else if (diff <= 10) {
                feedbackText = '🙂 Close! Keep going.';
                messageText = `You're within 10, so the guess is close.`;
            } else if (diff <= 30) {
                feedbackText = '📈 Far, but not too far.';
                messageText = `You're within 30, so you're still in range.`;
            } else {
                feedbackText = '⚠️ Too low! Aim much higher.';
                messageText = `The number is much higher than ${guess}.`;
            }
        } else {
            document.getElementById('feedback').className = 'feedback too-high';
            if (diff <= 2) {
                feedbackText = '🔥 Too close! Keep it up!';
                messageText = `You're extremely close! The number is just below ${guess}.`;
            } else if (diff <= 10) {
                feedbackText = '🙂 Close! Keep going.';
                messageText = `You're within 10, so the guess is close.`;
            } else if (diff <= 30) {
                feedbackText = '📉 Far, but not too far.';
                messageText = `You're within 30, so you're still in range.`;
            } else {
                feedbackText = '⚠️ Too high! You need a bigger drop.';
                messageText = `The number is much lower than ${guess}.`;
            }
        }

        document.getElementById('feedback').textContent = feedbackText;
        document.getElementById('message').textContent = messageText;
    }
    
    // Check if game over
    if (attemptsLeft === 0 && guess !== secretNumber) {
        loseGame();
    }
    
    guessInput.value = '';
    guessInput.focus();
}

// Add guess to history display
function addGuessToHistory(guess) {
    const historyDiv = document.getElementById('guessHistory');
    const guessItem = document.createElement('div');
    guessItem.className = 'guess-item';
    guessItem.textContent = guess;
    historyDiv.appendChild(guessItem);
}

// Win the game
function winGame(guess) {
    const winModal = document.getElementById('winModal');
    const winMessage = document.getElementById('winMessage');
    let winText = '';

    if (attemptsUsed <= 2) {
        winText = '🎉 You guessed it! Time to buy a lottery ticket! 🎉';
    } else if (attemptsUsed <= 7) {
        winText = '🔥 You nailed it! Incredible guess! 🔥';
    } else {
        winText = '👏 Congrats, you won! Well played! 👏';
    }

    const message = `${winText}\nThe number was ${guess}.\nYou used ${attemptsUsed} attempts out of ${MAX_ATTEMPTS}!`;
    winMessage.textContent = message;
    winModal.style.display = 'block';
    document.getElementById('guessInput').disabled = true;
}

// Lose the game
function loseGame() {
    const loseModal = document.getElementById('loseModal');
    const loseMessage = document.getElementById('loseMessage');
    const message = `😢 Game Over! The number was ${secretNumber}.\nBetter luck next time! You used all ${MAX_ATTEMPTS} attempts!`;
    loseMessage.textContent = message;
    loseModal.classList.add('blast');
    loseModal.style.display = 'block';
    document.getElementById('guessInput').disabled = true;
}

// Get a hint
function getHint() {
    if (attemptsLeft === 0) {
        alert('No more attempts left!');
        return;
    }
    
    const range = Math.floor((MAX_NUMBER - MIN_NUMBER) / 4);
    let hint = '';
    
    if (secretNumber <= range) {
        hint = `The number is in the lower quarter (${MIN_NUMBER} - ${range})`;
    } else if (secretNumber <= range * 2) {
        hint = `The number is in the lower-middle quarter (${range + 1} - ${range * 2})`;
    } else if (secretNumber <= range * 3) {
        hint = `The number is in the upper-middle quarter (${range * 2 + 1} - ${range * 3})`;
    } else {
        hint = `The number is in the upper quarter (${range * 3 + 1} - ${MAX_NUMBER})`;
    }
    
    document.getElementById('message').textContent = `💡 Hint: ${hint}`;
}

// Reset the game
function resetGame() {
    // Close modals
    const winModal = document.getElementById('winModal');
    const loseModal = document.getElementById('loseModal');
    winModal.style.display = 'none';
    loseModal.style.display = 'none';
    loseModal.classList.remove('blast');
    
    // Re-enable input
    document.getElementById('guessInput').disabled = false;
    
    // Initialize new game
    initGame();
}

// Allow Enter key to submit guess
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    
    document.getElementById('guessInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            checkGuess();
        }
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const winModal = document.getElementById('winModal');
        const loseModal = document.getElementById('loseModal');
        
        if (event.target == winModal) {
            winModal.style.display = 'none';
        }
        if (event.target == loseModal) {
            loseModal.style.display = 'none';
        }
    });
});
