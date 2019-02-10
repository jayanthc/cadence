const count = document.getElementById('count');
let sec = 10;

function interval() {
	sec = sec-1;
	count.innerHTML = sec+'<span>seconds</span>';
}

const countdown = function startCount (){
    setInterval(function() {
    	if(sec > 0) {
    		interval();
    	} else {
    		clearInterval(countdown);
    	}
    }, 1000);
};

const recordAudio = () =>
    new Promise(async resolve => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
        });

        const start = () => mediaRecorder.start();
        var audioContext = new AudioContext();
        const stop = () =>
        new Promise(resolve => {
            mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks);
                const audioUrl = URL.createObjectURL(audioBlob);
                var arrayBuffer;
                var fileReader = new FileReader();
                fileReader.onload = function(event) {
                    arrayBuffer = event.target.result;
                    audioContext.decodeAudioData(arrayBuffer, decodedDone);
                };
                fileReader.readAsArrayBuffer(audioBlob);
                
                const audio = new Audio(audioUrl);
                const play = () => audio.play();
                resolve({ audioBlob, audioUrl, play });
            });

            mediaRecorder.stop();
        });

        resolve({ start, stop });
    });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const handleAction = async () => {
    const recorder = await recordAudio();
    recorder.start();
    countdown();
    await sleep(5000);
    const audio = await recorder.stop();
    await sleep(3000);
    audio.play();
}
//attach handleAction to startRecord Button;
(function(){
    document.getElementById("startRecord").addEventListener('click', function(){
        handleAction();
    });
})();


function decodedDone(decoded) {
    var decodedArray = new Float32Array(decoded.length);
    decodedArray = decoded.getChannelData(0);
    
    console.log(decodedArray.length);
    bpm = get_bpm(decodedArray);
    document.getElementById("beat").innerHTML = bpm;
}

function get_bpm(decodedArray) {
    var data = nj.zeros([decodedArray.length, 2]);
    for (i = 0; i < decodedArray.length; i++) {
        decodedArray[i] = Math.abs(decodedArray[i]);
        data.set(i, 0, decodedArray[i]);
        data.set(i, 1, 0);
    }
    fft = nj.abs(nj.fft(data));
    // zero the DC bin in real and imaginary
    fft.set(0, 0, 0);
    fft.set(0, 1, 0);
    fft_len = fft.shape[0];

    // compute upper limit for plotting/peak-finding
    rate = 44100;       // Hz (figure out how to get this automatically
    upper_limit = 5;    // Hz (corresponding to 300 bpm)
    delta_f = (rate / 2) / fft_len;
    len_limit = Math.round(upper_limit / delta_f);

    fft = fft.reshape(fft.shape[0] * fft.shape[1], 1).flatten().tolist().slice(0, len_limit);
    for (i = 0; i < len_limit; i++) {
        if (i < 30) {
            filt = Math.exp(-30 / 60);
        }
        else {
            filt = Math.exp(-i / 60);
        }
        fft[i] *= filt;
    }

    var x = nj.arange(fft_len).tolist();
    var f = nj.arange(len_limit);
    for (i = 0; i < len_limit; i++) {
        f.set(i, f.get(i) * delta_f);
    }
    f = f.tolist();

    // get bpm
    freq = f[argMax(fft)];
    console.log(freq);
    bpm = Math.round(freq * 60);

    return bpm;
}

function argMax(array) {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}
