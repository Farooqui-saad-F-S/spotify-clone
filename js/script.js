let currentSong = new Audio();
let songs;
let currentTrack = "";

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
    const res = await fetch("songs.json");
    const data = await res.json();
    return data;
}

const playMusic = (track, pause = false) => {
    currentTrackName = track;
    console.log(currentTrackName);
    currentSong.src = "./songs/" + track + ".mp3";
    currentSong.load();
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {

    songs = await getSongs();
    playMusic(songs[0].name, true);
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
        <li> <img class="invert" src="img/music.svg" alt="music">
                            <div class="info">
                                <div>${song.title}</div>
                                <div>${song.artist}</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img id="playButton" class="invert" src="img/play.svg" alt="play">
                            </div>
                        </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li"))
        .forEach((e, index) => {
            e.addEventListener("click", () => {
                console.log(songs[index].name);
                playMusic(songs[index].name);
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
        if (currentSong.duration && !isNaN(currentSong.duration)) {
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }
    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let rect = e.currentTarget.getBoundingClientRect();
        let percent = (e.clientX - rect.left) / rect.width;

        document.querySelector(".circle").style.left = percent * 100 + "%";

        if (!isNaN(currentSong.duration)) {
            currentSong.currentTime = percent * currentSong.duration;
        }
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    previous.addEventListener("click", () => {
        let index = songs.findIndex(song => song.name === currentTrackName);

        if (index > 0) {
            playMusic(songs[index - 1].name);
        }
    });

    next.addEventListener("click", () => {
        let index = songs.findIndex(song => song.name === currentTrackName);

        if (index < songs.length - 1) {
            playMusic(songs[index + 1].name);
        } else {
            playMusic(songs[0].name);
        }
    });

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    })

    const handleMusicClick = (index) => {
        let currentTrack = currentSong.src.split("/songs/")[1]?.split(".mp3")[0];

        if (currentTrack === songs[index].name) {
            playMusic(songs[index].name, true);
        } else {
            playMusic(songs[index].name);
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