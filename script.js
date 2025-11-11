// --- 1. 音源データの定義 ---
// ここに、ご自身のファイルパスを記述します
const audioSources = {
    'diamond': [
        'audio/d01.mp3', 'audio/d02.mp3', 'audio/d03.mp3', 'audio/d04.mp3',
        'audio/d05.mp3', 'audio/d06.mp3', 'audio/d07.mp3', 'audio/d08.mp3',
        'audio/d09.mp3', 'audio/d10.mp3', 'audio/d11.mp3', 'audio/d12.mp3',
        'audio/d13.mp3', 'audio/d14.mp3', 'audio/d15.mp3', 'audio/d16.mp3'
    ],
    'heart': [
        'audio/h01.mp3', 'audio/h02.mp3', 'audio/h03.mp3', 'audio/h04.mp3',
        'audio/h05.mp3', 'audio/h06.mp3', 'audio/h07.mp3', 'audio/h08.mp3',
        'audio/h09.mp3', 'audio/h10.mp3', 'audio/h11.mp3', 'audio/h12.mp3',
        'audio/h13.mp3', 'audio/h14.mp3', 'audio/h15.mp3', 'audio/h16.mp3'
    ],
    'club': [
        'audio/c01.mp3', 'audio/c02.mp3', 'audio/c03.mp3', 'audio/c04.mp3',
        'audio/c05.mp3', 'audio/c06.mp3', 'audio/c07.mp3', 'audio/c08.mp3',
        'audio/c09.mp3', 'audio/c10.mp3', 'audio/c11.mp3', 'audio/c12.mp3',
        'audio/c13.mp3', 'audio/c14.mp3', 'audio/c15.mp3', 'audio/c16.mp3'
    ],
    'spade': [
        'audio/s01.mp3', 'audio/s02.mp3', 'audio/s03.mp3', 'audio/s04.mp3',
        'audio/s05.mp3', 'audio/s06.mp3', 'audio/s07.mp3', 'audio/s08.mp3',
        'audio/s09.mp3', 'audio/s10.mp3', 'audio/s11.mp3', 'audio/s12.mp3',
        'audio/s13.mp3', 'audio/s14.mp3', 'audio/s15.mp3', 'audio/s16.mp3'
    ]
};

// --- 2. 必要な要素を取得 ---
const topScreen = document.getElementById('top-screen');
const playbackScreen = document.getElementById('playback-screen');
const startButton = document.getElementById('start-button');
const checkboxes = document.querySelectorAll('.set-checkbox');
const audioPlayer = document.getElementById('audio-player');

const playAgainButton = document.getElementById('play-again-button');
const nextButton = document.getElementById('next-button');
const continuousPlayButton = document.getElementById('continuous-play-button');
const stopContinuousPlayButton = document.getElementById('stop-continuous-play-button');
const homeButton = document.getElementById('home-button');

// --- 3. アプリの状態を管理する変数 ---
let fullPlaylist = [];      // 再生対象の全リスト
let currentPlaylist = [];   // 現在の再生待ちリスト（シャッフル後）
let currentAudio = '';      // 現在再生中のファイルパス
let repeatCount = 0;        // 2回リピート用カウンター
let isContinuousPlay = false; // 連続再生モードか

// --- 4. メインロジック ---

// [再生開始] ボタンが押されたとき
startButton.addEventListener('click', () => {
    // プレイリストをリセット
    fullPlaylist = [];
    
    // チェックされたセットの音源を fullPlaylist に追加
    checkboxes.forEach(cb => {
        if (cb.checked) {
            fullPlaylist.push(...audioSources[cb.value]);
        }
    });

    if (fullPlaylist.length === 0) {
        alert('セットを1つ以上選んでください。');
        return;
    }

    // 画面切り替え
    topScreen.classList.add('hidden');
    playbackScreen.classList.remove('hidden');

    // 最初の再生を開始
    startNextPlayback();
});

// 次の音源をセットして再生する
function startNextPlayback() {
    // プレイリストが空になったら、元のリストから再度シャッフル
    if (currentPlaylist.length === 0) {
        // fullPlaylist をシャッフルして currentPlaylist にセット
        currentPlaylist = shuffleArray([...fullPlaylist]);
    }

    // リストから次の音源を取り出す
    currentAudio = currentPlaylist.pop();
    
    // 再生処理（リピートカウントをリセットして再生）
    playCurrentAudio();
}

// 現在の音源を（2回）再生する
function playCurrentAudio() {
    repeatCount = 0; // リピートカウントをリセット
    audioPlayer.src = currentAudio;
    audioPlayer.play();
}

// 音声の再生が1回終わるたびに呼ばれる
audioPlayer.addEventListener('ended', () => {
    repeatCount++;
    if (repeatCount < 2) {
        // 2回リピート
        audioPlayer.play();
    } else {
        // 2回再生が完了した
        if (isContinuousPlay) {
            // 連続再生モードなら、自動で次へ
            startNextPlayback();
        }
    }
});

// --- 5. 再生画面のボタン ---

// [もう一度流す]
playAgainButton.addEventListener('click', () => {
    playCurrentAudio(); // 現在の曲をリピートカウントリセットして再生
});

// [次に進む]
nextButton.addEventListener('click', () => {
    startNextPlayback();
});

// [連続再生]
continuousPlayButton.addEventListener('click', () => {
    isContinuousPlay = true;
    continuousPlayButton.classList.add('hidden');
    stopContinuousPlayButton.classList.remove('hidden');
    
    // もし今止まっていれば、次を再生開始
    if (audioPlayer.paused) {
        startNextPlayback();
    }
});

// [連続再生をやめる]
stopContinuousPlayButton.addEventListener('click', () => {
    isContinuousPlay = false;
    continuousPlayButton.classList.remove('hidden');
    stopContinuousPlayButton.classList.add('hidden');
});

// [← ホーム画面に戻る]
homeButton.addEventListener('click', () => {
    // 1. 画面を切り替える
    playbackScreen.classList.add('hidden');
    topScreen.classList.remove('hidden');

    // 2. 音声を停止・リセット
    audioPlayer.pause(); // 音声を停止
    audioPlayer.src = ""; // ソースをクリア

    // 3. 状態をリセット
    isContinuousPlay = false; // 連続再生モードをオフ
    currentPlaylist = [];     // プレイリストを空にする
    
    // 連続再生ボタンの表示をリセット
    continuousPlayButton.classList.remove('hidden');
    stopContinuousPlayButton.classList.add('hidden');
});

// --- 6. ユーティリティ (配列をシャッフルする関数) ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}