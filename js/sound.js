'use strict';

const NOTES = {
    'C4': 261.63,
    'D4': 293.66,
    'E4': 329.63,
    'F4': 349.23,
    'G4': 392,
    'A4': 440,
    'B4': 493.88,
    'C5': 523.25
};

const NOTE_NAMES = Object.keys(NOTES);

const NOTE_DUR = 1; // seconds

function ChundaChunda(ctx) {
    this.ctx = ctx;
    this.volumeNode = this.ctx.createGain();
    this.volumeNode.gain.value = 0.5;
    this.volumeNode.connect(this.ctx.destination);
}

ChundaChunda.prototype.play = function (freq, duration) {
    const START_TIME = this.ctx.currentTime;
    const END_TIME = START_TIME + duration;

    let gain = this.ctx.createGain();
    let osc = this.ctx.createOscillator();

    gain.gain.setValueAtTime(1, START_TIME);
    gain.connect(this.volumeNode);
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(gain);

    osc.start(START_TIME);
    osc.stop(END_TIME);
    gain.gain.linearRampToValueAtTime(0, END_TIME - duration * 0.1);
};

window.onload = function () {
    let ctx = new AudioContext();
    let instrument = new ChundaChunda(ctx);

    let lastNoteTime = ctx.currentTime;
    let loop = function () {
        let timestamp = ctx.currentTime;
        if (timestamp - lastNoteTime > NOTE_DUR) {
            let note = NOTE_NAMES[Math.floor(Math.random() * NOTE_NAMES.length)];
            instrument.play(NOTES[note], NOTE_DUR);
            lastNoteTime = timestamp;
            document.querySelector(`#${note.toLowerCase()}`).emit('play');
        }
        requestAnimationFrame(loop);
    };

    loop();

    // document.getElementById('play').addEventListener('click', function () {
    //     ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'].forEach(function (note, index) {
    //         instrument.play(NOTES[note], index, 1);
    //     });
    // }, false);
};
