﻿// Flanker Task with letter stimuli (A, E, O, U, B, H, T, S).
// VPs respond according to the central letter (vowel vs. consonant) whilst 
// ignoring the surrounding letters using key responses ("X" and "M"). 
// AAEAA (comp) vs. AAHAA (incomp)
// Flanker != Target (e.g., no AAAAA, TTTTT)
// Feedback is provided in colour "Correct" in green, "Error" in red
// On approx 20% of trials feedback colour is manipulated. For example, 
// when the participant responds correctly, they are provided with the
// feedback "Correct" but it is in red.

const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsP: 48,  
    nTrlsE: 96,
    nBlks: 1,
    flankerDur: 150,
    fbDur: 200,
    waitDur: 750,
    iti: 1000,
    tooFast:  250,   //  100 ms in total (150 ms flanker duration)
    tooSlow: 1150,   // 1000 ms in total (150 ms flanker duration)
    fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
    cTrl: 1,
    cBlk: 1,
    respMapping: jsPsych.randomization.sampleWithoutReplacement([1, 2], 1)[0],
    respKeys: [],
    respDir: []
}

if (prms.respMapping === 1) {
    prms.respKeys = ["X", "M", 27];
    prms.respDir  = ["left", "right", 27];
} else {
    prms.respKeys = ["M", "X", 27];
    prms.respDir  = ["right", "left", 27];
}

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
let respText = ""
if (prms.respMapping === 1) {
    respText = "<h3 align='left'>Handelt es sich bei dem mittleren Buchstaben um einen <b>Vokal (A, E, O, U)</b> drücken Sie die <b>Taste X</b> (linken Zeigefinger).</h2>" +
               "<h3 align='left'>Handelt es sich bei dem mittleren Buchstaben um einen <b>Konsonanten (B, H, T oder S)</b> drücken Sie die <b>Taste m</b> (rechten Zeigefinger).</h2>";
} else {
    respText = "<h3 align='left'>Handelt es sich bei dem mittleren Buchstaben um einen <b>Konsonanten (B, H, T, S)</b> drücken Sie die <b>Taste X</b> (linken Zeigefinger).</h2>" +
               "<h3 align='left'>Handelt es sich bei dem mittleren Buchstaben um einen <b>Vokal (A, E, O, U)</b> drücken Sie die <b>Taste M</b> (rechten Zeigefinger).</h2>";
}

const task_instructions1 = {
    type: "html-keyboard-response",
    stimulus: "<h2 align='center'>Willkommen bei unserem Experiment:</h2><br>" +
              "<h3 align='center'>Diese Studie wird im Rahmen einer B.Sc. Projektarbeit durchgeführt.</h3>" +
              "<h3 align='center'>Die Teilnahme ist freiwillig und Sie dürfen das Experiment jederzeit abbrechen.</h3><br>" +
              "<h2 align='center'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
    timing_post_trial: prms.waitDur
};

const task_instructions2 = {
    type: "html-keyboard-response",
    stimulus: 
    "<h1 align='center'>Aufgabe:</h1><br>" +
    "<h3 align='left'>Dieses Experiment besteht aus insgesamt 11 Blöcken. Jeder Block besteht wiederum aus mehreren Durchgängen.</h3>" +
    "<h3 align='left'>Sie werden in jedem Durchgang des Experiments eine Reihe von 5 Buchstaben sehen (z.B. BBHBB, AABAA).</h3>" +
    "<h3 align='left'>Bitte reagieren Sie immer auf den Buchstaben in der Mitte, die anderen Buchstaben sollen Sie möglichst ignorieren.</h3>" +
    respText +
    "<h3 align='left'>Bitte reagieren Sie so schnell und korrekt wie möglich.</h3>" +
    "<h3 align='left'>Nach jedem Tastendruck erhalten Sie die Rückmeldung, ob Ihre Antwort <b>richtig</b> oder <b>falsch</b> war.</h3>" +
    "<h3 align='left'>Am Ende jedes Blocks haben Sie die Möglichkeit eine kleine Pause zu machen.</h3><br>" +
    "<h2 align='center'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
    timing_post_trial: prms.waitDur
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function drawFixation() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.lineWidth = 5;
    ctx.moveTo(-25, 0);
    ctx.lineTo( 25, 0);
    ctx.stroke(); 
    ctx.moveTo(0, -25);
    ctx.lineTo(0,  25);
    ctx.stroke(); 
}

const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: "lightgrey",
    trial_duration: 500,
    translate_origin: true,
    canvas_border: "4px solid black",
    func: drawFixation
};

function drawFeedback() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = dat.corrColour;
    ctx.fillText(prms.fbTxt[dat.corrCode-1], 0, 0); 
}

function drawFlanker(args) {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = "50px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(args["text"], 0, 0); 
}

const trial_feedback = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: "lightgrey",
    trial_duration: 500,
    translate_origin: true,
    canvas_border: "4px solid black",
    func: drawFeedback
};

const block_feedback = {
    type: 'html-keyboard-response',
    stimulus: blockFeedbackTxtPES,
    response_ends_trial: true,
    post_trial_gap: prms.waitDur,
    data: { stim: "block_feedback" },
};

function generate_letter_arrays() {
    "use strict";
    let vowel = ["A", "E", "O", "U"];
    let consonant = ["B", "H", "T", "S"];
    let letters = vowel.concat(consonant);
    letters = letters.sort(() => Math.random() - 0.5);
    let letterCombs = [];
    let flankerCombs = [];
    let removed;
    for (let i = 0; i < letters.length; i++) {
        removed = false;
        for (let j = 0; j < letters.length; j++) {
            if (letters[i] === letters[j]) { // e.g., no AAAAAA, EEEEEE
                continue;
            }
            if (!removed) {  // need to remove 1 incompatible combination
                if ((vowel.includes(letters[i])) && (consonant.includes(letters[j]))) {
                    removed = true;
                    continue;
                } else if ((vowel.includes(letters[j])) && (consonant.includes(letters[i]))) {
                    removed = true;
                    continue;
                }
            }
            letterCombs.push(letters[i]  + letters[i] + letters[j] + letters[i] + letters[i]);
            flankerCombs.push(letters[i] + letters[i] + " "        + letters[i] + letters[i]);
        }
    }
    return [letterCombs, flankerCombs];
}

function generate_timeline_variables(stimuli) {
    "use strict";
    let timeline = [];
    let vowels = ["A", "E", "O", "U"];
    let rd, rk, comp;
    let letters = stimuli[0];
    let flankers = stimuli[1];
    for (let i = 0; i < letters.length; i++) {
        if (vowels.includes(letters[i][2])) {
            rd = prms.respDir[0];
            rk = prms.respKeys[0];
        } else {
            rd = prms.respDir[1];
            rk = prms.respKeys[1];
        }
        if (["A", "E", "O", "U"].includes(letters[i][0]) && ["A", "E", "O", "U"].includes(letters[i][2])) {
            comp = "comp";
        } else if (["B", "H", "T", "S"].includes(letters[i][0]) && ["B", "H", "T", "S"].includes(letters[i][2])) {
            comp = "comp";
        } else {
            comp = "incomp";
        }
        timeline.push({flankerArray: flankers[i], letterArray: letters[i], respDir: rd, respKey: rk, comp: comp});
    }
    return timeline;
}

function codeTrialPES() {
    "use strict";

    let data  = jsPsych.data.get().last(1).values()[0]; // current trial
    let dataP = jsPsych.data.get().last(4).values()[0]; // previous trial
    let corrCode   = 0;
    let corrColour = "";
    let corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.corrResp);

    // need to check that we don't give different feedback for direct 
    // stimulus + response repetitions
    let false_feedback_allowed = true;
    if (dataP !== undefined) {
        if (dataP.letterArray === data.letterArray) {
            false_feedback_allowed = false;
        }
    }

    if (data.key_press === corrKeyNum && data.rt > prms.tooFast && data.rt < prms.tooSlow) {
        corrCode   = 1;
        corrColour = "green";
        if (prms.cBlk > 1 && false_feedback_allowed) {  // only give false feedback after practice blocks
            corrColour = (Math.random() >= 0.8) ? "red" : "green";
        }
    } else if (data.key_press !== corrKeyNum && data.rt > prms.tooFast && data.rt < prms.tooSlow) {
        corrCode   = 2;
        corrColour = "red"
    } else if (data.rt === null) {
        corrCode   = 3;
        corrColour = "red"
    } else if (data.rt <= prms.tooFast) {
        corrCode   = 4;
        corrColour = "red"
    }

    jsPsych.data.addDataToLastTrial({
        date: Date(),
        corrCode:   corrCode,
        corrColour: corrColour,
        blockNum:   prms.cBlk,
        trialNum:   prms.cTrl
    });
    prms.cTrl += 1;
    if (data.key_press === 27) {
        jsPsych.endExperiment();
    }
}

function blockFeedbackTxtPES() {                                                   
    "use strict";                                                                                                                                                                                                                                                                                                                                        

    let dat = jsPsych.data.get().filter({ stim: "flanker", blockNum: prms.cBlk });
    let nTotal = dat.count();                                                     
    let nError = dat.select("corrCode").values.filter(function (x) { return x !== 1; }).length;
    let errorRate = Math.round((nError / nTotal) * 100);                          

    let errorRateTxt = "<h2>&nbsp;</h2><br>";                                     
    if (errorRate < 5) {                                                          
        errorRateTxt = "<h2><b>Bitte reagieren Sie schneller!</h2></b><br>";        
    } else if (errorRate > 15) {                                                  
        errorRateTxt = "<h2><b>Bitte reagieren Sie genauer!</h2></b><br>";          
    }                                                                             

    let meanRT = dat.select("rt").mean();                                         
    let fbTxtBlk = "<h1>Block: " + prms.cBlk + " von " + prms.nBlks + "</h1>" +           
        "<h1>Mittlere Reaktionszeit: " + Math.round(meanRT) + " ms </h1>" +         
        "<h1>Fehlerrate: " + errorRate + " %</h1><br>" +                            
        errorRateTxt +                                                              
        "<h1>Drücken Sie eine beliebige Taste, um fortzufahren!</h1>";              
    prms.cBlk += 1;                                                                    
    return fbTxtBlk;                                                              
}                                   

const stimuli  = generate_letter_arrays();
const timeline = generate_timeline_variables(stimuli);

const flanker_stimulus = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: "lightgrey",
    canvas_border: "4px solid black",
    trial_duration: prms.tooSlow,
    translate_origin: true,
    stimulus_onset: [0, 100],
    func: [drawFlanker, drawFlanker],
    func_args:[
        {"text": jsPsych.timelineVariable("flankerArray")},
        {"text": jsPsych.timelineVariable("letterArray")}
    ],
    data: {
        stim: "flanker",
        letterArray: jsPsych.timelineVariable('letterArray'), 
        comp: jsPsych.timelineVariable('comp'), 
        corrResp: jsPsych.timelineVariable('respKey')
    },
    on_finish: function() { codeTrialPES(); }
};

const trial_timeline = {
    timeline: [
        fixation_cross,
        flanker_stimulus,
        trial_feedback
    ],
    timeline_variables: timeline,
    randomize_order:true,
};

const randomString = generateRandomString(16);

const alphaNum = {
    type: 'html-keyboard-response',
    stimulus: "<h1>Wenn Sie für diesen Versuch eine Versuchspersonenstunde</h1>" +
    "<h1>benötigen, kopieren Sie den folgenden zufällig generierten Code</h1>" +
    "<h1>und senden Sie diesen zusammen mit Ihrer Matrikelnummer per Email an:</h1>" +
    "<h2>XXX@XXX</h2>" +
    "<h1>Code:" + randomString + "</h1>" +
    "<h2>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>"
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
    function genExpSeq() {
        "use strict";

        let exp = [];

        exp.push(welcome_de);
        exp.push(task_instructions1);
        exp.push(task_instructions2);

        for (let blk = 0; blk < prms.nBlks; blk += 1) {
            let blk_timeline = {...trial_timeline};
            blk_timeline.repetitions = (blk === 0) ? 1 : 2;
            exp.push(blk_timeline);    // trials within a block
            exp.push(block_feedback);  // show previous block performance 
        }
        exp.push(debrief_en);
        return exp;

    }
const EXP = genExpSeq();
const filename = dirName + "data/" + expName + "_" + genVpNum();

jsPsych.init({
    timeline: EXP,
    fullscreen: false,
    show_progress_bar: false,
    on_finish: function(){ 
        saveData("/Common/write_data.php", filename, rows = {stim: "flanker"}); 
    }
});

