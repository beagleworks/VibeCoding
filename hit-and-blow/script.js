document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const historyList = document.getElementById('history');
    const answerArea = document.querySelector('.answer-area');
    const correctAnswerDisplay = document.getElementById('correct-answer');
    const restartButton = document.getElementById('restart-button');
    const messageArea = document.querySelector('.message-area');

    let answer;
    let attempts;

    function generateAnswer() {
        const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let generatedAnswer = '';
        // 0から始まる4桁の数字を許容するため、最初の桁も0-9から選ぶ
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * digits.length);
            generatedAnswer += digits.splice(randomIndex, 1)[0];
        }
        return generatedAnswer;
    }

    function startGame() {
        answer = generateAnswer();
        attempts = 0;
        historyList.innerHTML = '';
        answerArea.style.display = 'none';
        guessInput.value = '';
        guessInput.disabled = false;
        guessButton.disabled = false;
        messageArea.textContent = '';
        console.log('CPU Answer:', answer); // デバッグ用
    }

    function showMessage(message, type = 'error') {
        messageArea.textContent = message;
        messageArea.style.color = type === 'error' ? '#dc3545' : '#28a745'; // エラーは赤、成功は緑
        setTimeout(() => {
            messageArea.textContent = '';
        }, 3000);
    }

    function checkGuess() {
        const guess = guessInput.value;

        if (guess.length !== 4 || !/^\d{4}$/.test(guess)) {
            showMessage('4桁の数字を入力してください。');
            guessInput.value = ''; // 不正な入力はクリア
            return;
        }

        // 重複チェック
        const guessDigits = guess.split('');
        if (new Set(guessDigits).size !== 4) {
            showMessage('4つの異なる数字を入力してください。');
            guessInput.value = ''; // 不正な入力はクリア
            return;
        }

        attempts++; // 有効な入力の場合のみカウントアップ
        let hits = 0;
        let blows = 0;

        for (let i = 0; i < 4; i++) {
            if (guess[i] === answer[i]) {
                hits++;
            } else if (answer.includes(guess[i])) {
                blows++;
            }
        }

        const listItem = document.createElement('li');
        const guessSpan = document.createElement('span');
        guessSpan.className = 'guess';
        guessSpan.textContent = `${attempts}回目: ${guess}`;

        const resultSpan = document.createElement('span');
        resultSpan.className = 'result';
        resultSpan.textContent = `${hits}H ${blows}B`;

        listItem.appendChild(guessSpan);
        listItem.appendChild(resultSpan);
        historyList.appendChild(listItem);
        historyList.scrollTop = historyList.scrollHeight; // 自動スクロール

        guessInput.value = ''; // 入力欄をクリア
        guessInput.focus(); // 入力欄にフォーカス

        if (hits === 4) {
            endGame(true);
        } else if (attempts >= 10) { // 例えば10回でゲームオーバー
            showMessage('残念！10回以内に当てられませんでした。', 'error');
            endGame(false);
        } else {
            // 楽しい演出: ヒット数に応じてメッセージを変える
            if (hits === 3) {
                showMessage('おしい！あと少し！', 'info');
            } else if (hits === 0 && blows > 0) {
                showMessage('うーん、場所が違うみたい…', 'info');
            } else if (hits === 0 && blows === 0) {
                showMessage('逆にラッキー？この数字は使われていないよ！', 'info');
            }
        }
    }

    function endGame(isWin) {
        guessInput.disabled = true;
        guessButton.disabled = true;
        answerArea.style.display = 'block';
        correctAnswerDisplay.textContent = answer;

        if (isWin) {
            showMessage(`おめでとうございます！${attempts}回で正解です！ 🎉`, 'success');
            // 正解時の楽しい演出 (例: 紙吹雪)
            confettiEffect();
        } else {
            showMessage(`ゲームオーバー！正解は ${answer} でした。`, 'error');
        }
    }

    guessButton.addEventListener('click', checkGuess);
    guessInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            checkGuess();
        }
    });
    restartButton.addEventListener('click', startGame);

    // 初期化
    startGame();

    // 紙吹雪エフェクト (簡易版)
    function confettiEffect() {
        const container = document.querySelector('.container');
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000); // 3秒後に削除
        }
    }

    // 紙吹雪用のスタイルを動的に追加
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: #f00; /* Default, will be overridden */
            opacity: 0.7;
            animation: fall 3s linear forwards;
            top: -20px; /* Start above the container */
            z-index: 9999;
        }
        @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(calc(100vh + 20px)) rotate(720deg); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);
});