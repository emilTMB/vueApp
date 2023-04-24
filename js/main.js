let app = new Vue({
    el: '.main', // теперь див с классом майн будет элемментом Вью
    data: { //в ключе даты создадим две переменные
        showMain: true,
        showSocial: false,
        showAchivments: false,
        showQuestions:false,
        showResult: false,
        number: 0,
        score: {
            'zerg': 0,
            'primal': 0,
            'protoss': 0,
            'terran': 0,
            'taldarim': 0,
        },
        //создаем переменную
        totalGame: localStorage.getItem('sc2TotalGame') ? JSON.parse(localStorage.getItem('sc2TotalGame')) : {
            'zerg': 0,
            'primal': 0,
            'protoss': 0,
            'taldarim': 0,
            'terran': 0,
            'infested': 0,
            'hybrid': 0,
        },
        // количество сыгранных матчей
        totalGames: localStorage.getItem('sc2TotalGames') ? localStorage.getItem('sc2TotalGames') : 0,
        // questions это константа прописанная в файле конст, ровно как и резалтс
        questions: questions,
        results: results,
        resultRace: 'infested',
    },
    // создаем свои методы
    // при использовании метода переменные становятся равны этим значениям
    methods: {
        goToMain() {
        this.showMain = true
        this.showSocial = false
        this.showAchivments = false
        this.showQuestions = false
        this.showResult = false
        },
        goToSocial() {
        this.showMain = false
        this.showSocial = true
        this.showAchivments = false
        this.showQuestions = false
        this.showResult = false
        },
        goToAchivments() {
            // если ты уже играл и количество попыток больше нуля тогда
            if(this.totalGames > 0) {
                this.showMain = false
                this.showSocial = false
                this.showAchivments = true
                this.showQuestions = false
                this.showResult = false
            } else {
                // если ты не играл тогда
                this.goToQuestions()
            }
        },
        goToQuestions() {
            // счет будет равен нулю поскольку кадое начало игры обнуляет результат предыдущей
            this.score = {
            'zerg': 0,
            'primal': 0,
            'protoss': 0,
            'taldarim': 0,
            'terran': 0,
            'infested': 0,
            'hybrid': 0,
            }
            this.showMain = false
            this.showSocial = false
            this.showAchivments = false
            this.showQuestions = true
            this.showResult = false
        },
        goToResult(race) {
            this.showMain = false
            this.showSocial = false
            this.showAchivments = false
            this.showQuestions = false
            this.showResult = true
            this.resultRace = race
        },
        nextQuestions(answer) {
            if(this.number == 24) {
                this.number = 0
                this.endGame();
            } else {
                this.number++
            }
            eval(answer)
        },
        endGame() {
            this.totalGames++
            localStorage.setItem('sc2TotalGames', this.totalGames)
            // Зерг
            if(this.score.zerg > this.score.protoss && this.score.zerg > this.score.terran && this.score.primal < 8 && Math.abs(this.score.protoss - this.score.zerg) > 3) {
                this.goToResult('zerg')
                this.totalGame.zerg++
            }
            //Изначальный зерг
            else if (this.score.primal > this.score.protoss &&
            this.score.primal > this.score.terran &&
            this.score.primal == 8) {
                this.goToResult('primal');
                this.totalGame.primal++
            }
            // Протосс
            else if (this.score.protoss > this.score.zerg &&
            this.score.protoss > this.score.terran &&
            this.score.taldarim == 5 &&
            Math.abs(this.score.protoss - this.score.zerg) > 3) {
                this.goToResult('protoss');
                this.totalGame.protoss++
            }
            // Талдарим
            else if (this.score.protoss > this.score.zerg &&
            this.score.protoss > this.score.terran &&
            this.score.taldarim == 5) {
                this.goToResult('taldarim');
                this.totalGame.taldarim++
            }
            // Терран
            else if (this.score.terran > this.score.zerg &&
            this.score.terran > this.score.protoss) {
                this.goToResult('terran');
                this.totalGame.terran++
            }
            // Гибрид
            else if (Math.abs(this.score.protoss - this.score.zerg) <= 3) {
                this.goToResult('hybrid');
                this.totalGame.terran++
            }
            // Зараженный
            else {
                this.goToResult('infested');
                this.totalGame.terran++ 
            }
            localStorage.setItem('sc2TotalGame', JSON.stringify(this.totalGame))
        }
    },
    computed: {
        totalScore() {
            let score = 0
            for(let i in this.totalGame){
                score+=(this.totalGame[i]*results[i].points)
            }
            return score
        },
        openRaces() {
            let count = 0
            for(let i in this.totalGame){
                if(this.totalGame[i]>0) count++
            }
            return count
        },
        favoriteRace() {
            let max = 'zerg'
            for(let i in this.totalGame) {
                if(this.totalGame[i]>this.totalGame[max]) {
                    max=i
                }
            }
            return results[max].name
        },
        showResultRace() {
            return {
                'zerg': this.totalGame.zerg > 0 ? true : false,
                'primal': this.totalGame.primal > 0 ? true : false,
                'protoss': this.totalGame.protoss > 0 ? true : false,
                'terran': this.totalGame.terran > 0 ? true : false,
                'taldarim': this.totalGame.taldarim > 0 ? true : false,
                'infested': this.totalGame.infested > 0 ? true : false,
                'hybrid': this.totalGame.hybrid > 0 ? true : false,
            }
        }
    }

})

let audio = new Audio('audio/soundtrack.mp3') // записали звук в переменную
let audio_btn = document.querySelector('.btn_sound')
let audio_icon = document.querySelector('.btn_sound i')

audio.muted = true;
audio.autoplay = true;
audio.volume = 0.2 // от нуля до одного

audio.addEventListener('loadmetadata', function() {
    audio.currentTime = 0 + Math.random() * (audio.duration + 1 - 0) // случайное место с которого начинается воспроизведение звука в музыкальном треке
}) //loadmetadata - событие которое означает, что наш звук уже был загружен

audio_btn.addEventListener('click', function() {
    if(audio.muted) {
        audio.muted=false
        audio_icon.classList.add('fa-volume-up')
        audio_icon.classList.remove('fa-volume-off')
    } else if (!audio.muted) {
        audio.muted=true
        audio_icon.classList.add('fa-volume-off')
        audio_icon.classList.remove('fa-volume-up')
    }
})