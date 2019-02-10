window.onload = function() {
    var audioContext = new AudioContext();

    document.getElementById("loadFile").addEventListener("click", function() {
        var reader = new FileReader();
        reader.onload = function() {
            var arrayBuffer = reader.result;
            //console.log("arrayBuffer:");
            //console.log(arrayBuffer);
            audioContext.decodeAudioData(arrayBuffer, decodedDone);
        };
        reader.addEventListener('load', function() {
            document.getElementById('file').innerText = this.result;
        });
        reader.readAsArrayBuffer(document.querySelector('input').files[0]);
    });

    function decodedDone(decoded) {
        var decodedArray = new Float32Array(decoded.length);
        decodedArray = decoded.getChannelData(0);
        /*
        var data = nj.zeros([decodedArray.length, 2]);
        for (i = 0; i < decodedArray.length; i++) {
            decodedArray[i] = Math.abs(decodedArray[i]);
            data.set(i, 0, decodedArray[i]);
            data.set(i, 1, 0);
        }
        fft = nj.abs(nj.fft(data));
        fft.set(0, 0, 0);
        fft.set(0, 1, 0);
        fft_len = fft.shape[0];

        // compute upper limit for plotting/peak-finding
        rate = 44100;       // Hz (figure out how to get this automatically
        upper_limit = 5;    // Hz (corresponding to 300 bpm)
        delta_f = (rate / 2) / fft_len;
        //console.log(delta_f);
        len_limit = Math.round(upper_limit / delta_f);
        //console.log(len_limit);

        fft = fft.reshape(fft.shape[0] * fft.shape[1], 1).flatten().tolist().slice(0, len_limit);
        var x = nj.arange(fft_len).tolist();
        var f = nj.arange(len_limit);
        for (i = 0; i < len_limit; i++) {
            f.set(i, f.get(i) * delta_f);
        }
        f = f.tolist();
        input = document.getElementById('input');
        Plotly.plot(input,
                    [{ x: x,
                       y: decodedArray}],
                    { margin: { t: 0 } });
        output = document.getElementById('output');
        Plotly.plot(output,
                    [{ x: f,
                       y: fft}],
                    { margin: { t: 0 } });*/
        bpm = get_bpm(decodedArray);
        console.log(bpm);
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
        var x = nj.arange(fft_len).tolist();
        var f = nj.arange(len_limit);
        for (i = 0; i < len_limit; i++) {
            f.set(i, f.get(i) * delta_f);
        }
        f = f.tolist();

        // plotting
        input = document.getElementById('input');
        Plotly.plot(input,
                    [{ x: x,
                       y: decodedArray}],
                    { margin: { t: 0 } });
        output = document.getElementById('output');
        Plotly.plot(output,
                    [{ x: f,
                       y: fft}],
                    { margin: { t: 0 } });

        // get bpm
        freq = f[argMax(fft)];
        console.log(freq);
        bpm = Math.round(freq * 60);

        return bpm;
    }

    function argMax(array) {
        return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
    }
};
