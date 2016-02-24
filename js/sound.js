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

ChundaChunda.prototype.play = function (freq, init, duration) {
    let osc = this.ctx.createOscillator();
    osc.frequency.value = freq;
    osc.connect(this.volumeNode);

    osc.start(this.ctx.currentTime + init);
    osc.stop(this.ctx.currentTime + init + duration);
};

window.onload = function () {
    let instrument = new ChundaChunda(new AudioContext());

    let lastNoteTime = performance.now();
    let play = function (timestamp) {
        if (timestamp - lastNoteTime > NOTE_DUR * 1000) {
            let note = NOTE_NAMES[Math.floor(Math.random() * NOTE_NAMES.length)];
            instrument.play(NOTES[note], 0, NOTE_DUR);
            lastNoteTime = timestamp;
            document.querySelector(`#${note.toLowerCase()}`).emit('play');
        }
        requestAnimationFrame(play);
    };

    requestAnimationFrame(play);

    // document.getElementById('play').addEventListener('click', function () {
    //     ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'].forEach(function (note, index) {
    //         instrument.play(NOTES[note], index, 1);
    //     });
    // }, false);
};
