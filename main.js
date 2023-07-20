document.addEventListener("DOMContentLoaded", function () {
    const videoPlayer = document.getElementById("video-player")
    const playButton = document.getElementById("play-btn")
    const pauseButton = document.getElementById("pause-btn")
    const restartButton = document.getElementById("restart-btn")
    const volumeSlider = document.getElementById("volume-slider")
    const restartButtonIcon = document.querySelector(".fa-refresh")
    const operationContainer = document.getElementById("operation-controls")
    const questionContainer = document.getElementById("question-container")
    const questionDiv = document.getElementById("question")
    const answersDiv = document.getElementById("answers")
    const endVideoDiv = document.getElementById("end-section")
    const messageDiv = document.getElementById("message")

    const questions = [
        {
            question: "מהו התהליך המאפשר לכמעט כל התאים להכיל מידע תורשתי זהה?",
            answers: ["התפצלות הדנ\"א", "תאומיות", "תהליך חילופי", "שכפול הדנ\"א"],
            correctAnswer: "שכפול הדנ\"א"
        },
        {
            question: "איזה אנזים בוצע בשלב הראשון של התהליך?",
            answers: ["דנ\"א פולימראז", "חלבונים מיוחדים", "דנ\"א הליקאז", "רוחסן"],
            correctAnswer: "דנ\"א פולימראז"
        },
        {
            question: "כמה מולקולות בדנ\"א יתקבלו בסיום השכפול המוצלח?",
            answers: ["שתי מולקולות", "ארבע מולקולות", "שלוש מולקולות", "חמישה מולקולות"],
            correctAnswer: "שתי מולקולות"
        }
    ]

    let currentQuestion = 0
    const questionTimes = [12.8, 36.3, 64.7] // Time to stop the video and show the questions
    let isAnswered = false

    function restart() {
        videoPlayer.pause()
        endVideoDiv.style.display = "none"
        operationContainer.style.display = "block"
        hideQuestion()
        currentQuestion = 0
        loadNextQuestion()
        isAnswered = false
        videoPlayer.currentTime = 0
        playVideo()
    }

    function playVideo() {
        videoPlayer.play()
        playButton.disabled = true
        pauseButton.disabled = false
    }

    function pauseVideo() {
        videoPlayer.pause()
        playButton.disabled = false
        pauseButton.disabled = true
    }

    function formatTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60)
        const seconds = (timeInSeconds % 60).toFixed(1)
        return `${minutes}:${seconds}`
    }

    function loadNextQuestion() {
        if (currentQuestion < questions.length) {
            questionDiv.textContent = questions[currentQuestion].question
            const answers = questions[currentQuestion].answers
            const answerButtons = answersDiv.querySelectorAll(".answer-btn")
            for (let i = 0; i < answerButtons.length; i++) {
                answerButtons[i].textContent = answers[i]
            }
        }
    }

    function showQuestion() {
        questionContainer.style.display = "flex"
        playButton.disabled = true
        pauseButton.disabled = true
        operationContainer.style.marginTop = ".5em"
    }

    function hideQuestion() {
        questionContainer.style.display = "none"
        const answerButtons = document.querySelectorAll(".answer-btn")
        for (const button of answerButtons) {
            button.style.backgroundColor = ""
        }
        operationContainer.style.marginTop = "4em"
    }

    // Function to display the flash message
    function flashMsg(msgTxt, type = 'success') {
        if (type === 'success') {
            messageDiv.style.color = '#28a745'
        } else {
            messageDiv.style.color = '#dc3545'
        }
        messageDiv.textContent = msgTxt
        messageDiv.style.display = "block"
        setTimeout(function () {
            messageDiv.style.display = "none"
        }, 3000) 
    }

    // Function to compare time within a tolerance of +/- 0.3 seconds
    function isTimeClose(currentTime, targetTime) {
        return Math.abs(currentTime - targetTime) <= 0.3
    }

    // Event listener for the "timeupdate" event of the video player
    videoPlayer.addEventListener("timeupdate", function () {
        const currentTime = videoPlayer.currentTime
        const duration = videoPlayer.duration
        const timeDisplay = document.getElementById("time-display")
        timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`
        if (currentQuestion < questionTimes.length && isTimeClose(currentTime, questionTimes[currentQuestion])) {
            pauseVideo()
            showQuestion()
        }
        // Wait 3 seconds and update question
        if (isAnswered && currentTime >= questionTimes[currentQuestion] + 3) {
            isAnswered = false
            hideQuestion()
            currentQuestion++
            loadNextQuestion()
        }
    })

    // Event listener for the "click" event of the play button
    playButton.addEventListener("click", playVideo)

    // Event listener for the "click" event of the pause button
    pauseButton.addEventListener("click", pauseVideo)

    // Event listener for the icon restart element
    restartButtonIcon.addEventListener("click", restart)

    // Event listener for the restart button element (at the end of video)
    restartButton.addEventListener("click", restart)

    // Event listener for the "input" event of the volume slider
    volumeSlider.addEventListener("input", function () {
        videoPlayer.volume = volumeSlider.value
    })

    // Event listener for the end of the video playback
    videoPlayer.addEventListener("ended", function () {
        endVideoDiv.style.display = "flex"
        operationContainer.style.display = "none"
    })

    // Event listeners for the answer buttons
    const answerButtons = document.querySelectorAll(".answer-btn")
    for (const button of answerButtons) {
        button.addEventListener("click", function () {
            if (!isAnswered) {
                isAnswered = true
                const selectedAnswer = button.textContent
                const correctAnswer = questions[currentQuestion].correctAnswer
                if (selectedAnswer === correctAnswer) {
                    flashMsg("צדקת - כל הכבוד ✅")
                    videoPlayer.currentTime += 0.6
                    this.style.backgroundColor = '#28a745'
                    playVideo()
                } else {
                    flashMsg("טעית - נסה שוב ❌", 'error')
                    isAnswered = false
                    this.style.backgroundColor = '#dc3545'
                }
            }
        })
    }

    // Load the first question
    loadNextQuestion()
})