document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const movesEl = document.getElementById('moves');
    const matchesEl = document.getElementById('matches');
    const restartBtn = document.getElementById('restartBtn');

    const emojis = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝'];
    let cardsArray = [...emojis, ...emojis];
    
    let flippedCards = [];
    let moves = 0;
    let matches = 0;
    let lockBoard = false;

    function initGame() {
        board.innerHTML = '';
        flippedCards = [];
        moves = 0;
        matches = 0;
        movesEl.innerText = moves;
        matchesEl.innerText = matches;
        lockBoard = false;

        // Kartları karıştır (Fisher-Yates shuffle)
        cardsArray.sort(() => 0.5 - Math.random());

        cardsArray.forEach(emoji => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.emoji = emoji;

            const front = document.createElement('div');
            front.classList.add('card-front', 'card-face');

            const back = document.createElement('div');
            back.classList.add('card-back', 'card-face');
            back.innerText = emoji;

            card.appendChild(front);
            card.appendChild(back);

            card.addEventListener('click', flipCard);
            board.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === flippedCards[0]) return;
        if (this.classList.contains('matched')) return;

        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            movesEl.innerText = moves;
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.emoji === card2.dataset.emoji;

        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        flippedCards[0].classList.add('matched');
        flippedCards[1].classList.add('matched');
        matches++;
        matchesEl.innerText = matches;
        flippedCards = [];

        if (matches === emojis.length) {
            setTimeout(() => {
                alert(`Tebrikler! ${moves} hamlede oyunu bitirdiniz! 🎉`);
            }, 500);
        }
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            flippedCards[0].classList.remove('flipped');
            flippedCards[1].classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
        }, 1000);
    }

    restartBtn.addEventListener('click', initGame);

    initGame();
});
