let currentSong = new Audio();
let songs;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    const a = await fetch("http://127.0.0.1:3000/songs/");
    const response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {

            songs.push(element.href.split("s%5C")[1].split(".mp3")[0]);
        }
    }
    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track + ".mp3";
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {

    songs = await getSongs();
    playMusic(songs[0], true);
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
        <li> <img class="invert" src="img/music.svg" alt="music">
                            <div class="info">
                                <div>${song.replace(/%20/g, " ")}</div>
                                <div>Artist Name</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img id="playButton" class="invert" src="img/play.svg" alt="play">
                            </div>
                        </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        });
    });

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";

        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (percent / 100) * currentSong.duration;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("s/")[1].split(".mp3")[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    });

    next.addEventListener("click", () => {
        console.log("next clicked");
        let index = songs.indexOf(currentSong.src.split("s/")[1].split(".mp3")[0])
        if (index < songs.length - 1) {
            playMusic(songs[index + 1]);
        }
        else {
            playMusic(songs[0]);
        }
    });

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    })

    const handleMusicClick = (index) => {
        let currentTrack = currentSong.src.split("s/")[1].split(".mp3")[0];
        if (currentTrack == songs[index]) {
            playMusic(songs[index], true);
        } else {
            playMusic(songs[index]);
        }
    };

    document.querySelectorAll(".card").forEach((el) => {
        el.addEventListener("click", () => {
            let index = parseInt(el.dataset.index);
            handleMusicClick(index);
        });
    });

    document.querySelector(".volume img").addEventListener("click", (e) => {
        console.log(e.target.src);
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
        }
    });
}

main();