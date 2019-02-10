import sounddevice as sd

duration = 3.0 # seconds
fs = 44100
myrecording = sd.rec(int(duration * fs), samplerate=fs, channels=2)

sd.default.samplerate = fs
sd.default.channels = 2

myrecording = sd.rec(int(duration * fs))

sd.play(myrecording, fs)
