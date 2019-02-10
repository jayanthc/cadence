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
        var typedArray = new Float32Array(decoded.length);
        typedArray = decoded.getChannelData(0);
        RI = nj.concatenate(nj.ones([10,1]), nj.zeros([10,1]));
        var data = nj.zeros([typedArray.length, 2]);
        for (i = 0; i < typedArray.length; i++) {
            typedArray[i] = Math.abs(typedArray[i]);
            data[i, 0] = typedArray[i];
            data[i, 1] = typedArray[i];
        }
        var foo = nj.random([typedArray.length, 2]);
        for (i = 0; i < typedArray.length; i++) {
            foo.set(i, 0, typedArray[i]);
            foo.set(i, 1, typedArray[i]);
        }
        console.log(data);
        console.log(foo);
        //data = nj.concatenate(data, data);
        //data = foo;
        fft = nj.abs(nj.fft(foo));
        fft.set(0, 0, 0);
        fft.set(0, 1, 0);
        //console.log(fft);
        len = fft.shape[0];
        //console.log(fft.shape[0]);
        fft = fft.reshape(fft.shape[0] * fft.shape[1], 1).flatten().tolist();
        //console.log(fft);
        //document.getElementById("values").innerText = typedArray.slice(1, 10);
        var x = nj.arange(len).tolist();
        //console.log(x);
        input = document.getElementById('input');
        Plotly.plot(input,
                    [{ x: x,
                       y: typedArray}],
                    { margin: { t: 0 } });
        output = document.getElementById('output');
        Plotly.plot(output,
                    [{ x: x,
                       y: fft}],
                    { margin: { t: 0 } });
    }
};
