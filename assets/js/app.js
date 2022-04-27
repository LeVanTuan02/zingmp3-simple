const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'TuanDemo';

const inputElement = $$('input[type="range"]');
const audio = $('.audio');
const thumbControl = $('.content__player-control-img');
const player = $('.content__player-control-main');
const progress = inputElement[0];
const playlist = $('.content__main-songs');

const playBtn = $('.btn-toggle');
const nextBtn = $('.btn-next');
const preBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const muteBtn = $('.content__player-control-item-icon-volume');

const timeEnd = $('.content__player-control-end-time');
const currentTime = $('.content__player-control-start-time');
const volume = $('.content__player-control-volume');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isMuted: false,
    currentTime: 0,
    endTime: 0,
    currentVolume: 1,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Cưới Thôi',
            singer: 'Masew',
            path: './assets/music/CuoiThoi-MasiuMasew-7066112_hq.mp3',
            image: './assets/images/cuoithoi.jpg'
        },
        {
            name: 'Khuê Mộc Lang',
            singer: 'Hương Ly',
            path: './assets/music/7441.mp3',
            image: './assets/images/khuemoclang.jpg'
        },
        {
            name: 'Rồi Tới Luôn',
            singer: 'Nal',
            path: './assets/music/roitoiluon.mp3',
            image: './assets/images/roitoiluon.jpg'
        },
        {
            name: 'Yêu Là Cưới',
            singer: 'Phát Hồ',
            path: './assets/music/yeulacuoi.mp3',
            image: './assets/images/yeulacuoi.jpg'
        },
        {
            name: 'Cô Đơn Dành Cho Ai',
            singer: 'Lee Ken',
            path: './assets/music/codondanhchoai.mp3',
            image: './assets/images/codondanhchoai.jpg'
        },
        {
            name: 'Cậu Cả Remix',
            singer: 'Xavi Phạm',
            path: './assets/music/cauca.mp3',
            image: './assets/images/cauca.jpg'
        },
        {
            name: 'Người Lạ Thoáng Qua',
            singer: 'Đinh Tùng Huy',
            path: './assets/music/nguoilathoangqua.mp3',
            image: './assets/images/nguoilathoangqua.jpg'
        }
    ],
    setConfigs: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <li class="content__main-song ${index === this.currentIndex ? 'active' : ''}" data-id="${index}">
                    <div class="content__main-song-info">
                        <div class="content__main-song-thumb-wrap">
                            <img src="${song.image}" alt="" class="content__main-song-thumb">
                            <div class="content__main-song-thumb-playing">
                                <img src="./assets/images/icon-playing.gif" alt="">
                            </div>
                            <div class="content__main-song-pause">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>

                        <div class="content__main-song-title-wrap">
                            <span class="content__main-song-name">${song.name}</span>
                            <span class="content__main-song-singer">${song.singer}</span>
                        </div>

                    </div>

                    <div class="content__main-song-content">
                        <audio src="${song.path}" class="audio"></audio>
                        <div class="content__main-song-duaration">00:00</div>

                        <ul class="content__main-song-actions">
                            <li class="content__main-song-action">
                                <i class="fas fa-microphone"></i>
                            </li>
                            <li class="content__main-song-action">
                                <i class="fas fa-heart"></i>
                            </li>
                            <li class="content__main-song-action">
                                <i class="fas fa-ellipsis-h"></i>
                            </li>
                        </ul>
                    </div>
                </li>
            `;
        });

        $('.content__main-songs').innerHTML = htmls.join('');

        // render list image
        const htmlImage = this.songs.map(song => {
            return `
                <li class="content__main-songs-img-item">
                    <img src="${song.image}" alt="" class="content__main-song-img">
                </li>
            `;
        });

        $('.content__main-songs-img-list').innerHTML = htmlImage.join('');
    },
    handleEvents: function() {
        const _this = this;

        const thumbAnimate = thumbControl.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        });
        thumbAnimate.pause();


        // xử lý sự kiện play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            _this.scrollToActiveSong();
        }

        // xử lý khi play song
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.toggle('playing', _this.isPlaying);
            thumbAnimate.play();
            $('.content__main-song.active').classList.toggle('playing', _this.isPlaying);
        }

        // xử khí khi stop song
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.toggle('playing', _this.isPlaying);
            thumbAnimate.pause();
            $('.content__main-song.active').classList.toggle('playing', _this.isPlaying);
        }

        // xử lý tiến trình phát nhạc
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const timePercent = (audio.currentTime / audio.duration) * 100;
                progress.value = timePercent;
                _this.updateColorProgress(inputElement);
                currentTime.innerText = _this.convertTimeSong(audio.currentTime);
            }
            _this.currentTime = audio.currentTime;
            _this.setConfigs('currentTime', _this.currentTime);
        }

        // xử lý tua song
        progress.oninput = function() {
            const seekTime = audio.duration * progress.value / 100;
            audio.currentTime = seekTime;
            _this.setConfigs('currentTime', audio.currentTime);
        }

        // xử lý next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.scrollToActiveSong();
        }

        // pre song
        preBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.preSong();
            }
            audio.play();
        }

        // random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom);
            _this.setConfigs('isRandom', _this.isRandom);
        }

        // repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active", _this.isRepeat);
            _this.setConfigs('isRepeat', _this.isRepeat);
        }

        // xử lý khi kết thúc song
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // click to play
        playlist.onclick = function(e) {
            const nodeSong = e.target.closest('.content__main-song:not(.active)');
            if (nodeSong && !e.target.closest('.content__main-song-action')) {
                _this.currentIndex = nodeSong.dataset.id;
                _this.loadCurrentSong();
                audio.play();
                _this.scrollToActiveSong();
            }

        }

        // xử lý khi load xong song
        audio.onloadedmetadata = function() {
            const seconds = audio.duration;
            let timeSongEnd = _this.convertTimeSong(seconds);
            _this.endTime = timeSongEnd;
            timeEnd.innerText = _this.endTime;

        }

        // thay đổi âm lượng
        volume.oninput = function() {
            _this.updateVolume();
        }

        // xử lý sự kiện thay đổi âm lượng
        audio.onvolumechange = function() {
            muteBtn.classList.toggle('muted', !!!_this.currentVolume);
            _this.isMuted = !!!_this.currentVolume;
            _this.setConfigs('isMuted', _this.isMuted);
            _this.setConfigs('currentVolume', _this.currentVolume);
        }

        // xử lý sự kiện mute
        muteBtn.onclick = function() {
            _this.isMuted = !_this.isMuted;

            if (_this.isMuted) {
                audio.muted = true;
                volume.value = 0;
            } else {
                audio.muted = false;
                volume.value = 100;
            }
            
            _this.updateVolume();
            muteBtn.classList.toggle('muted', _this.isMuted);
        }

    },
    loadCurrentSong: function() {
        thumbControl.src = this.currentSong.image;
        audio.src = this.currentSong.path;

        const songActive = $('.content__main-song.active');
        const songList = $$('.content__main-song');
        songActive.classList.remove("active");
        songList[this.currentIndex].classList.add("active");
        this.setConfigs('currentIndex', Number(this.currentIndex));
    },
    loadConfig: function() {
        this.isRepeat = this.config.isRepeat || this.isRepeat;
        this.isRandom = this.config.isRandom || this.isRandom;
        this.isMuted = this.config.isMuted || this.isMuted;
        this.currentVolume = (this.config.currentVolume == 0 || this.config.currentVolume) ? this.config.currentVolume : this.currentVolume;
        this.currentIndex = this.config.currentIndex || this.currentIndex;
        this.currentTime = this.config.currentTime || this.currentTime;
    },
    updateColorProgress: function(inputElement) {
        Array.from(inputElement).forEach(input => {
            const value = (input.value / input.max) * 100;
            input.style.backgroundImage = `linear-gradient(to right, #fff 0%, #fff ${value}%, hsla(0,0%,100%,0.3) ${value}%)`;
        })
    },
    updateVolume: function() {
        const currentVolume = volume.value / 100;
        audio.volume = currentVolume;
        this.currentVolume = currentVolume;

        this.updateColorProgress(inputElement);
    },
    nextSong: function() {
        this.currentIndex++;
        
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }

        this.loadCurrentSong();
    },
    preSong: function() {
        this.currentIndex--;

        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        this.loadCurrentSong();
    },
    randomSong: function() {
        let newIndex;

        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (this.currentIndex == newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    loadSongTime: function() {
        const listSong = $$('.content__main-song');
        const _this = this;
        Array.from(listSong).forEach((song) => {
            const songElement = song.querySelector('audio');

            songElement.addEventListener('loadedmetadata', function() {
                const songDuration = this.duration;
                const timeElement = this.nextElementSibling;
                timeElement.innerText = _this.convertTimeSong(songDuration);
            })
            
        });
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            if (this.currentIndex <= 3) {
                $('.content__main-song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            } else {
                $('.content__main-song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                })
            }
        }, 400);
    },
    convertTimeSong: function(seconds) {
        let minutes = Math.floor(seconds / 3600 * 60);
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        let newSeconds = Math.round(seconds % 60);
        newSeconds = newSeconds < 10 ? `0${newSeconds}` : newSeconds;
        return `${minutes}:${newSeconds}`;
    },
    run: function() {
        // load config
        this.loadConfig();

        this.defineProperties();

        volume.value = this.currentVolume * 100;

        // load thanh tiến trình
        this.updateColorProgress(inputElement);

        // xử lý sự kiện
        this.handleEvents();

        // render song
        this.render();

        // load song hiện tại
        this.loadCurrentSong();

        // load all song time
        this.loadSongTime();

        repeatBtn.classList.toggle("active", this.isRepeat);
        randomBtn.classList.toggle("active", this.isRandom);
        muteBtn.classList.toggle("muted", this.isMuted);
        audio.volume = this.currentVolume;
        audio.currentTime = this.currentTime;
    }
}

app.run();