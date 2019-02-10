window.onload = function() {
    var audioContext = new AudioContext();

    document.getElementById("loadFile").addEventListener("click", function() {
        var reader = new FileReader();
        reader.onload = function() {
            var arrayBuffer = reader.result;
            console.log("arrayBuffer:");
            console.log(arrayBuffer);
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
        console.log("typedArray:");
        console.log(typedArray);
        var a = nj.array(typedArray);
        console.log(a);
        //fft = nj.fft(a);
        for (i = 0; i < 1000; i++) { 
            value =typedArray[i]);
        }
        document.getElementById("values").innerText = values;
    }
};
