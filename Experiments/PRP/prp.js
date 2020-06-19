// Basic version of a PRP Task:

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const cc = "rgba(200, 200, 200, 1)";
const cs = [960, 720];
const cb = "5px solid black";

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum   = genVpNum();
const nFiles  = getNumberOfFiles("/Common/num_files.php", dirName + "data/");

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
    nTrlsP: 72,  // number of trials in first block (practice)
    nTrlsE: 72,  // number of trials in subsequent blocks 
    nBlks: 6,   
    fixDur: 500,
    fbDur: [1000, 3000, 3000, 3000],
    soa: [50, 200, 1000],
    iti: 500,
    tooFast: 100,
    tooSlow: 5000,
    fbTxt: ["Richtig", "Falsch", "Zu langsam", "Zu schnell"],
    cTrl: 1,  // count trials
    cBlk: 1,  // count blocks
    respCols: shuffle(["red", "blue", "green"]),
    respLetters: shuffle(["B","C","D","F","G","H","J","K","M","N","S","T","V","X","Y","Z"]),
    fixWidth: 2,
    fixSize: 10,
    fbSize: "20px monospace",
    respKeys1: ["Q", "W"],
    respKeys2: ["O", "P"],
    respKeys: ["Q", "W", "O", "P"],
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: "<h2 style='text-align: center;'>Willkommen bei unserem Experiment:</h2><br>" +
              "<h3 style='text-align: center;'>Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.</h3><br>" +
              "<h3 style='text-align: center;'>Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und </h3>" +
              "<h3 style='text-align: center;'>genügend Zeit hast, um das Experiment durchzuführen.</h3><br>" +
              "<h3 style='text-align: center;'>Wir bitten dich die ca. 45 Minuten konzentriert zu arbeiten.</h3><br>" +
              "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions2 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: 
    "<h2 style='text-align: center;'>Experiment:</h2>" +
    "<h3 style='text-align: left;'>In diesem Experiment musst du in jedem Durchgang zwei Aufgaben bearbeiten.</h3>" +
    "<h3 style='text-align: left;'>Jede Aufgabe wird mit einer Hand bearbeitet. </h3><br>" +
    "<h3 style='text-align: left;'>Aufgabe 1 = Linke Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger </h3>" +
    "<h3 style='text-align: left;'>auf die Tasten „Q“ und „W“.</h3><br>" +  
    "<h3 style='text-align: left;'>Aufgabe 2 = Rechte Hand: Bitte platziere hierzu den Zeigefinger und Mittelfinger </h3>" +
    "<h3 style='text-align: left;'>auf die Tasten „O“ und „P“.</h3><br>" +  
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions3 = {
    type: "html-keyboard-response-canvas",
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: 
    "<h3 style='text-align: left;'>In jedem Durchgang musst du erst auf den Buchstaben reagieren.</h3>" +
    "<h3 style='text-align: left;'>Nachdem du auf den Buchstaben reagiert hast, musst du auf die </h3>" +
    "<h3 style='text-align: left;'>Farbe reagieren: Reagiere wie folgt:</h3><br>" + 
    "<h3 style='text-align: left;'>Aufgabe 1 (Buchstabe) linke Hand:</h3>" +
    "<h3 style='text-align: center;'>Zeigefinger („W-Taste“): " + prms.respLetters[1] + "</h3>" +
    "<h3 style='text-align: center;'>Mittelfinger („Q-Taste“): " + prms.respLetters[0] + "</h3>" +
    "<h3 style='text-align: left;'>Aufgabe 2 (Farbe) rechte Hand:</h3>" +
    "<h3 style='text-align: center;'>Zeigefinger („O-Taste“): " + prms.respCols[0] + "</h3>" +
    "<h3 style='text-align: center;'>Mittelfinger („P-Taste“): " + prms.respCols[1] + "</h3><br>" +
    "<h2 style='text-align: center;'>Drücke eine beliebige Taste, um fortzufahren!</h2>"
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function drawFixation() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.lineWidth = prms.fixWidth;
    ctx.moveTo(-prms.fixSize, 0);
    ctx.lineTo( prms.fixSize, 0);
    ctx.stroke(); 
    ctx.moveTo(0, -prms.fixSize);
    ctx.lineTo(0,  prms.fixSize);
    ctx.stroke(); 
}

const fixation_cross = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    trial_duration: prms.fixDur,
    translate_origin: true,
    response_ends_trial: false,
    func: drawFixation
};

function drawFeedback() {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
    let dat = jsPsych.data.get().last(1).values()[0];
    ctx.font = prms.fbSize;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(prms.fbTxt[dat.corrCode-1], 0, 0); 


    // show response mapping if not correct
    ctx.font = "20px monospace";
    if (dat.corrCode !== 1) {
        ctx.fillText("Aufgabe 1 (Buchstabe) linke Hand:", -250, 50); 
        ctx.fillText("„W-Taste“: " + prms.respLetters[1], -250, 100); 
        ctx.fillText("„Q-Taste“: " + prms.respLetters[0], -250, 150); 
        ctx.fillText("Aufgabe 2 (Farbe) rechte Hand:", 250, 50); 
        ctx.fillText("„O-Taste“: " + prms.respCols[0], 250, 100); 
        ctx.fillText("„P-Taste“: " + prms.respCols[1], 250, 150); 
    }

}

function drawStimulus(args) {
    "use strict"
    let ctx = document.getElementById('canvas').getContext('2d');
   
    // draw first stimulus (letter)
    ctx.font = "40px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(args["letter"], 0, 0); 

    // draw second stimulus (square frame)
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = args["colour"];
    ctx.rect(-40, -40, 80, 80);
    ctx.stroke();

}

function codeTrial() {
    "use strict";
    let dat = jsPsych.data.get().last(1).values()[0];
    let corrCode = 0;
    let corrKeyNum1 = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp1);
    let corrKeyNum2 = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp2);

    let soa = dat.soa
    let rt1 = (dat.rt1 !== null) ? dat.rt1 : prms.tooSlow;
    let rt2 = (dat.rt2 !== null) ? dat.rt2 - dat.soa : prms.tooSlow;

    console.log(dat.key_press1 === corrKeyNum1)
    console.log(dat.key_press2 === corrKeyNum2)

    if ((dat.key_press1 === corrKeyNum1 && rt1 > prms.tooFast && rt1 < prms.tooSlow) & 
        (dat.key_press2 === corrKeyNum2 && rt2 > prms.tooFast && rt2 < prms.tooSlow)) {
        corrCode = 1;  // correct
    } else if ((dat.key_press1 !== corrKeyNum1 && rt1 > prms.tooFast && rt1 < prms.tooSlow) | 
               (dat.key_press2 !== corrKeyNum2 && rt2 > prms.tooFast && rt2 < prms.tooSlow)) {
        corrCode = 2;  // choice error
    } else if (rt2 >= prms.tooSlow) {
        corrCode = 3;  // too slow
    } else if (rt1 <= prms.tooFast) {
        corrCode = 4;  // too false
    }

    jsPsych.data.addDataToLastTrial({date: Date(), rt1: rt1, rt2: rt2, corrCode: corrCode, blockNum: prms.cBlk, trialNum: prms.cTrl});
    prms.cTrl += 1;
    if (dat.key_press === 27) {
        jsPsych.endExperiment();
    }
}


const trial_feedback = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    translate_origin: true,
    response_ends_trial: false,
    func: drawFeedback,
    on_start: function(trial) {
        let dat = jsPsych.data.get().last(1).values()[0];
        trial.trial_duration = prms.fbDur[dat.corrCode - 1]; 
    }
};

const iti = {
    type: 'static-canvas-keyboard-response',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    trial_duration: prms.iti,
    response_ends_trial: false,
    func: function() {}
};

const block_feedback = {
    type: 'html-keyboard-response-canvas',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    stimulus: "",
    response_ends_trial: true,
    on_start: function(trial) {
        trial.stimulus = blockFeedbackTxt_de_du({stim: "prp"});
    },
};

const prp_stimulus = {
    type: 'static-canvas-keyboard-multiple-response',
    canvas_colour: cc,
    canvas_size: cs,
    canvas_border: cb,
    trial_duration: prms.tooSlow,
    translate_origin: true,
    stimulus_onset: [0, jsPsych.timelineVariable("soa")],
    clear_screen: [1, 1],
    stimulus_duration: prms.tooSlow,
    response_ends_trial: true,
    choices: prms.respKeys,
    func: [drawStimulus, drawStimulus],
    func_args:[
        { 
            "letter": jsPsych.timelineVariable("t1_letter") ,
            "colour": jsPsych.timelineVariable("t2_1_colour") ,
        },
        { 
            "letter": jsPsych.timelineVariable("t1_letter") ,
            "colour": jsPsych.timelineVariable("t2_2_colour") ,
        },
    ],
    data: {
        stim: "prp",
        soa: jsPsych.timelineVariable('soa'),
        corrResp1: jsPsych.timelineVariable('corrResp1'),
        corrResp2: jsPsych.timelineVariable('corrResp2')
    },
    on_finish: function() { codeTrial(); }
};

const trial_timeline = {
    timeline: [
        fixation_cross,
        prp_stimulus,
        trial_feedback,
        iti,
    ],
    timeline_variables:[
        { t1_letter: prms.respLetters[0], t2_1_colour: cc, t2_2_colour: prms.respCols[0], soa: prms.soa[0], corrResp1: prms.respKeys1[0], corrResp2: prms.respKeys2[0] },
        { t1_letter: prms.respLetters[1], t2_1_colour: cc, t2_2_colour: prms.respCols[0], soa: prms.soa[0], corrResp1: prms.respKeys1[1], corrResp2: prms.respKeys2[0] },
        { t1_letter: prms.respLetters[0], t2_1_colour: cc, t2_2_colour: prms.respCols[1], soa: prms.soa[0], corrResp1: prms.respKeys1[0], corrResp2: prms.respKeys2[1] },
        { t1_letter: prms.respLetters[1], t2_1_colour: cc, t2_2_colour: prms.respCols[1], soa: prms.soa[0], corrResp1: prms.respKeys1[1], corrResp2: prms.respKeys2[1] },
        { t1_letter: prms.respLetters[0], t2_1_colour: cc, t2_2_colour: prms.respCols[0], soa: prms.soa[1], corrResp1: prms.respKeys1[0], corrResp2: prms.respKeys2[0] },
        { t1_letter: prms.respLetters[1], t2_1_colour: cc, t2_2_colour: prms.respCols[0], soa: prms.soa[1], corrResp1: prms.respKeys1[1], corrResp2: prms.respKeys2[0] },
        { t1_letter: prms.respLetters[0], t2_1_colour: cc, t2_2_colour: prms.respCols[1], soa: prms.soa[1], corrResp1: prms.respKeys1[0], corrResp2: prms.respKeys2[1] },
        { t1_letter: prms.respLetters[1], t2_1_colour: cc, t2_2_colour: prms.respCols[1], soa: prms.soa[1], corrResp1: prms.respKeys1[1], corrResp2: prms.respKeys2[1] },
        { t1_letter: prms.respLetters[0], t2_1_colour: cc, t2_2_colour: prms.respCols[0], soa: prms.soa[2], corrResp1: prms.respKeys1[0], corrResp2: prms.respKeys2[0] },
        { t1_letter: prms.respLetters[1], t2_1_colour: cc, t2_2_colour: prms.respCols[0], soa: prms.soa[2], corrResp1: prms.respKeys1[1], corrResp2: prms.respKeys2[0] },
        { t1_letter: prms.respLetters[0], t2_1_colour: cc, t2_2_colour: prms.respCols[1], soa: prms.soa[2], corrResp1: prms.respKeys1[0], corrResp2: prms.respKeys2[1] },
        { t1_letter: prms.respLetters[1], t2_1_colour: cc, t2_2_colour: prms.respCols[1], soa: prms.soa[2], corrResp1: prms.respKeys1[1], corrResp2: prms.respKeys2[1] },
    ],
};


const randomString = generateRandomString(16);


////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
    "use strict";

    let exp = [];

    exp.push(fullscreen_on);
    exp.push(welcome_de_du);
    exp.push(resize_de_du);
    exp.push(task_instructions1);
    exp.push(task_instructions2);
    exp.push(task_instructions3);
    exp.push(hideMouseCursor);
    
    for (let blk = 0; blk < prms.nBlks; blk += 1) {
        let blk_timeline = {...trial_timeline};
        blk_timeline.sample = {type: "fixed-repetitions", size: (blk === 0) ? (prms.nTrlsP/12) : (prms.nTrlsE/12)}
        exp.push(blk_timeline);    // trials within a block
        exp.push(block_feedback);  // show previous block performance 
    }
    exp.push(debrief_de);
    exp.push(showMouseCursor);
    exp.push(fullscreen_off);

    return exp;

}
const EXP = genExpSeq();

const data_filename = dirName + "data/" + expName + "_" + vpNum;
const code_filename = dirName + "code/" + expName;

jsPsych.init({
    timeline: EXP,
    fullscreen: true,
    show_progress_bar: false,
    exclusions: {
        min_width:cs[0],
        min_height:cs[1],
    },
    on_finish: function(){ 
        saveData("/Common/write_data.php", data_filename, {stim: "prp"});
        saveRandomCode("/Common/write_code.php", code_filename, randomString);
    }
});
