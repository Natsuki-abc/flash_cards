<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>フラッシュカード</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #ffffff;
            padding: 20px;
        }

        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            max-width: 600px;
        }

        h1 {
            font-size: clamp(20px, 5vw, 28px);
            margin-bottom: 30px;
            font-weight: normal;
            text-align: center;
        }

        .card-counter {
            width: 100%;
            text-align: left;
            margin-bottom: 10px;
            color: #333;
            font-size: clamp(12px, 3vw, 14px);
        }

        .card {
            width: 100%;
            max-width: 450px;
            height: clamp(180px, 50vh, 250px);
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 30px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            position: relative;
            overflow: hidden;
        }

        .card-content {
            font-size: clamp(18px, 5vw, 24px);
            text-align: center;
            padding: 20px;
            width: 100%;
            word-wrap: break-word;
        }

        .card-indicator {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #f0f0f0;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: clamp(10px, 2.5vw, 12px);
        }

        .navigation {
            display: flex;
            justify-content: space-between;
            width: 100%;
            max-width: 450px;
        }

        .nav-button {
            padding: clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px);
            background-color: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            font-size: clamp(12px, 3vw, 14px);
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        }

        .nav-button:hover {
            background-color: #f5f5f5;
        }

        .prev-button::before {
            content: "〈";
            margin-right: 8px;
        }

        .next-button::after {
            content: "〉";
            margin-left: 8px;
        }

        .progress-bar {
            width: 100%;
            max-width: 450px;
            height: 4px;
            background-color: #e0e0e0;
            margin-bottom: 20px;
            border-radius: 2px;
            overflow: hidden;
        }

        .progress {
            height: 100%;
            background-color: #3498db;
            width: 0%;
            transition: width 0.3s ease;
        }

        .flashcard-container {
            width: 100%;
            max-width: 450px;
        }

        /* 完了画面のスタイル */
        .completion-screen {
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .completion-icon {
            font-size: 60px;
            color: #27ae60;
            margin-bottom: 20px;
        }

        .completion-message {
            font-size: clamp(18px, 4vw, 24px);
            margin-bottom: 30px;
            color: #333;
        }

        .completion-stats {
            margin-bottom: 30px;
            font-size: clamp(14px, 3vw, 16px);
            color: #555;
        }

        .restart-button {
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .restart-button:hover {
            background-color: #2980b9;
        }

        @media (max-width: 480px) {
            .container {
                padding: 0 10px;
            }

            .card {
                margin-bottom: 20px;
            }

            .navigation {
                margin-bottom: 20px;
            }
        }

        @media (max-height: 600px) {
            body {
                align-items: flex-start;
                padding-top: 40px;
            }

            .card {
                height: clamp(150px, 40vh, 200px);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>フラッシュカード</h1>

        <div class="progress-bar">
            <div class="progress" id="progress-indicator"></div>
        </div>

        <div class="flashcard-container" id="flashcard-container">
            <div class="card-counter">カード <span id="current-card">1</span> / <span id="total-cards">5</span></div>

            <div class="card" id="flashcard">
                <div class="card-content" id="card-content"></div>
                <div class="card-indicator" id="side-indicator"></div>
            </div>

            <div class="navigation">
                <button class="nav-button prev-button" id="prev-button">前へ</button>
                <button class="nav-button next-button" id="next-button">次へ</button>
            </div>
        </div>

        <div id="completion-screen" class="completion-screen">
            <div class="completion-icon">✓</div>
            <div class="completion-message">全てのカードを学習しました！</div>
            <div class="completion-stats">
                学習カード：<span id="total-cards-completed">5</span>枚
            </div>
            <button class="restart-button" id="restart-button">もう一度学習する</button>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // フラッシュカードのデータ（表面と裏面）
            const flashcards = [
                { front: "東京", back: "Tokyo" },
                { front: "大阪", back: "Osaka" },
                { front: "京都", back: "Kyoto" },
                { front: "北海道", back: "Hokkaido" },
                { front: "沖縄", back: "Okinawa" }
            ];

            let currentCardIndex = 0;
            let isShowingFront = true;

            const cardContentElement = document.getElementById('card-content');
            const sideIndicatorElement = document.getElementById('side-indicator');
            const currentCardElement = document.getElementById('current-card');
            const totalCardsElement = document.getElementById('total-cards');
            const prevButton = document.getElementById('prev-button');
            const nextButton = document.getElementById('next-button');
            const progressIndicator = document.getElementById('progress-indicator');
            const flashcardContainer = document.getElementById('flashcard-container');
            const completionScreen = document.getElementById('completion-screen');
            const totalCardsCompletedElement = document.getElementById('total-cards-completed');
            const restartButton = document.getElementById('restart-button');

            // カードの合計数を設定
            const totalSteps = flashcards.length * 2;
            totalCardsElement.textContent = flashcards.length;
            totalCardsCompletedElement.textContent = flashcards.length;

            // 最初のカードを表示
            updateCard();

            // 前へボタンのイベント
            prevButton.addEventListener('click', function() {
                if (isShowingFront && currentCardIndex > 0) {
                    // 前のカードの裏面に戻る
                    currentCardIndex--;
                    isShowingFront = false;
                    updateCard();
                } else if (!isShowingFront) {
                    // 同じカードの表面に戻る
                    isShowingFront = true;
                    updateCard();
                }
            });

            // 次へボタンのイベント
            nextButton.addEventListener('click', function() {
                if (isShowingFront) {
                    // 同じカードの裏面に進む
                    isShowingFront = false;
                    updateCard();
                } else if (currentCardIndex < flashcards.length - 1) {
                    // 次のカードの表面に進む
                    currentCardIndex++;
                    isShowingFront = true;
                    updateCard();
                } else {
                    // 最後のカードの裏面から完了画面へ
                    showCompletionScreen();
                }
            });

            // もう一度学習するボタンのイベント
            restartButton.addEventListener('click', function() {
                // 最初のカードに戻る
                currentCardIndex = 0;
                isShowingFront = true;
                updateCard();

                // 学習画面を表示
                completionScreen.style.display = 'none';
                flashcardContainer.style.display = 'block';
            });

            // スワイプ操作のサポート
            let touchStartX = 0;
            let touchEndX = 0;

            document.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, false);

            document.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, false);

            function handleSwipe() {
                const swipeThreshold = 50;

                if (touchEndX < touchStartX - swipeThreshold) {
                    // 左スワイプ（次へ）
                    nextButton.click();
                }

                if (touchEndX > touchStartX + swipeThreshold) {
                    // 右スワイプ（前へ）
                    prevButton.click();
                }
            }

            // 完了画面を表示する関数
            function showCompletionScreen() {
                flashcardContainer.style.display = 'none';
                completionScreen.style.display = 'flex';
                progressIndicator.style.width = '100%';
            }

            // カードの内容を更新する関数
            function updateCard() {
                // カードの内容を更新
                if (isShowingFront) {
                    cardContentElement.textContent = flashcards[currentCardIndex].front;
                    sideIndicatorElement.textContent = "表";
                } else {
                    cardContentElement.textContent = flashcards[currentCardIndex].back;
                    sideIndicatorElement.textContent = "裏";
                }

                // カード番号を更新（表示用）
                currentCardElement.textContent = currentCardIndex + 1;

                // 進捗バーを更新
                const currentStep = (currentCardIndex * 2) + (isShowingFront ? 0 : 1);
                const progressPercentage = (currentStep / totalSteps) * 100;
                progressIndicator.style.width = `${progressPercentage}%`;

                // ボタンの有効/無効状態を更新
                updateButtonStates();
            }

            // ボタンの有効/無効状態を更新する関数
            function updateButtonStates() {
                // 最初のカードの表面の場合は「前へ」ボタンを無効化
                if (currentCardIndex === 0 && isShowingFront) {
                    prevButton.disabled = true;
                    prevButton.style.opacity = 0.5;
                } else {
                    prevButton.disabled = false;
                    prevButton.style.opacity = 1;
                }

                // 最後のカードの裏面の場合は「次へ」ボタンのテキストを変更
                if (currentCardIndex === flashcards.length - 1 && !isShowingFront) {
                    nextButton.textContent = "完了";
                    nextButton.classList.remove("next-button");
                } else {
                    nextButton.textContent = "次へ";
                    if (!nextButton.classList.contains("next-button")) {
                        nextButton.classList.add("next-button");
                    }
                }
            }
        });
    </script>
</body>
</html>
