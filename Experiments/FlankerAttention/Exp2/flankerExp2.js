﻿/*
 Standard Flanker Task with alternating fixed (centre) and random (clock positions)
 across sequential trials. VPs respond to the direction of the central arrow whilst
 ignoring the surrounding arrows using key responses ("C" and "M"). Feedback provided
 during the practice block.
*/

///////////////// Exp Parameters ////////////////////////////////////////////
var numTrlsP = 16;
var numTrlsE = 96;
var numBlks = 13;
var fixDur = 500;
var fbDur = 1000;
var waitDur = 1000;
var iti = 500;
var tooFast = 150;
var tooSlow = 1500;
var respKeys = ["C", "M", 27];
var fbTxt = ["Richtig", "Falsch", "Zu langsam", "Zu schnell"];
var nTrl = 1;
var nBlk = 1;

///////////////// Functions //////////////////////////////////////////////////
function recordScreenSize() {
    jsPsych.data.addProperties({
        screenHeight: screen.height,
        screenWidth: screen.width,
        aspectRatio: screen.height / screen.width
    });
}

var screenInfo = {
    type: "call-function",
    func: recordScreenSize,
    timing_post_trial: 0
};

function randomPositionClock() {

    var posx = [];
    var posy = [];
    var pos = Math.floor(Math.random() * 11);
    for (var i = 0; i < 2*Math.PI; i = i + 2*Math.PI/11){
        posx.push(Math.cos(i) * screen.height/4);
        posy.push(Math.sin(i) * screen.height/4);
    }

    posx = posx[pos];
    posy = posy[pos];

    return {x: posx, y: posy};

}

function setRandomPositions(pos) {
    pos = randomPositionClock();
    document.documentElement.style.setProperty('--posx', pos.x + 'px');
    document.documentElement.style.setProperty('--posy', pos.y + 'px');
}

function setCentrePositions() {
    document.documentElement.style.setProperty('--posx', 0 + 'px');
    document.documentElement.style.setProperty('--posy', 0 + 'px');
}

var setStimulusPositionsRandom = {
    type: "call-function",
    func: setRandomPositions,
    timing_post_trial: 0
};

var setStimulusPositionsCentre = {
    type: "call-function",
    func: setCentrePositions,
    timing_post_trial: 0
};

//////////////////// Text Instructions ////////////////////////////////////////
var welcome = {
  type: "text",
  text: "<h1>Willkommen. Drücken Sie eine beliebige Taste, um fortzufahren!</h1>",
};

var instructions = {
    type: "text",
    text: "<h1 align='center'>Aufgabe:</h1>" +
    "<h2 align='center'>Reagieren Sie auf die Ausrichtung des mittleren Pfeils:</h2><br>" +
    "<h2 align='center'>LINKS  = C Taste &nbsp &nbsp&nbsp&nbsp RECHTS = M Taste</h2><br>" +
    "<h2 align='center'>Bitte reagieren Sie so schnell und korrekt wie möglich</h2><br>" +
    "<h2 align='center'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
    timing_post_trial: waitDur
};

/////////////////////////////// VP Info ///////////////////////////////////////
function genVpNum() {
    "use strict";
    var num = new Date();
    num = num.getTime();
    return num;
}
var vpNum = genVpNum();

function checkVpInfoForm() {
    // get age, gender, handedness and VPs consent
    "use strict";
    var age = document.getElementById("age").value;

    var gender = "";
    if ($("#male").is(":checked")) {
        gender = "male";
    } else if ($("#female").is(":checked")) {
        gender = "female";
    }

    var hand = "";
    if ($("#left").is(":checked")) {
        hand = "left";
    } else if ($("#right").is(":checked")) {
        hand = "right";
    }

    var consent = false;
    if ($("#consent_checkbox").is(":checked")) {
        consent = true;
    }

    if (consent && age !== "" && gender !== "" && hand !== "") {
        jsPsych.data.addProperties({vpNum: vpNum, age: age, gender: gender, handedness: hand});
        return true;
    } else {
        window.alert("Bitte antworten Sie alle Fragen und klicken Sie auf die Zustimmungs box um weiter zumachen!");
        return false;
    }

}
var vpInfoForm = {
    type: "html",
    url: "vpInfoForm.html",
    cont_btn: "start",
    check_fn: checkVpInfoForm
};

/////////////////////////////// Resize ////////////////////////////////////////
var resize = {
    type: 'resize',
    item_width: 3 + 3/8,
    item_height: 2 + 1/8,
    prompt: "<p>Klicken Sie und ziehen Sie die untere rechte Ecke bis der Kasten die gleiche Größe wie eine Bankkarte oder Ihr Universitätsausweis hat.</p>",
    pixels_per_unit: 150
};

/////////////////////////////// Stimuli ///////////////////////////////////////
var fixAbsent = {
    type: "single-stim",
    stimulus: '<div class="fix"></div>',
    is_html: true,
    timing_stim: fixDur,
    timing_response: fixDur,
    timing_post_trial: 0,
    response_ends_trial: false,
    data: {stim: "fixation"}
};


var flanker= [{
    type: "single-stim",
    stimulus: '<div class="flank"><<<<<</div>',
    is_html: true,
    timing_response: tooSlow,
    timing_post_trial: 0,
    response_ends_trial: true,
    data: {stim: "flanker", respDir: "left", comp: "comp", corrResp: respKeys[0]}
}, {
    type: "single-stim",
    stimulus: '<div class="flank">>><>></div>',
    is_html: true,
    timing_response: tooSlow,
    timing_post_trial: 0,
    response_ends_trial: true,
    data: {stim: "flanker", respDir: "left", comp: "incomp", corrResp: respKeys[0]}
}, {
    type: "single-stim",
    stimulus: '<div class="flank">>>>>></div>',
    is_html: true,
    timing_response: tooSlow,
    timing_post_trial: 0,
    response_ends_trial: true,
    data: {stim: "flanker", respDir: "right", comp: "comp", corrResp: respKeys[1]}
}, {
    type: "single-stim",
    stimulus: '<div class="flank"><<><<</div>',
    is_html: true,
    timing_response: tooSlow,
    timing_post_trial: 0,
    response_ends_trial: true,
    data: {stim: "flanker", respDir: "right", comp: "incomp", corrResp: respKeys[1]}
}
];

var trlFbPrac = {
    type: "single-stim",
    stimulus: trialFeedbackTxt,
    is_html: true,
    timing_stim: fbDur,
    timing_response: fbDur,
    timing_post_trial: 0,
    response_ends_trial: false,
    data: {stim: "feedbackPrac"}
};

var trlFbExp = {
    type: "single-stim",
    stimulus: '',
    is_html: false,
    timing_stim: iti,
    timing_response: iti,
    timing_post_trial: 0,
    response_ends_trial: false,
    data: {stim: "feedbackExp"}
};

var interTrialInterval = {
    type: "single-stim",
    stimulus: '<div class="feedback">&nbsp;</div>',
    is_html: true,
    timing_stim: iti,
    timing_response: iti,
    timing_post_trial: 0,
    response_ends_trial: false,
    data: {stim: "iti"}
};

function trialFeedbackTxt(){
    var data = jsPsych.data.get().last(1).values()[0];
    return '<div class="feedback">' + fbTxt[data.corrCode-1] + '</div>';
}

function codeTrial(){
    var data = jsPsych.data.get().last(1).values()[0];
    var corrCode = 0;
    var corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.corrResp);
    if (data.stim === "flanker"){
        if (data.key_press === corrKeyNum && data.rt > tooFast && data.rt < tooSlow){
            corrCode = 1;
        } else if (data.key_press !== corrKeyNum && data.rt > tooFast && data.rt < tooSlow){
            corrCode = 2;
        } else if (data.rt === -1){
            corrCode = 3;
        } else if (data.rt <= tooFast){
            corrCode = 4;
        }

        jsPsych.data.addDataToLastTrial({
            date: Date(),
            corrCode: corrCode,
            blockNum: nBlk,
            trialNum: nTrl,
            posx: document.documentElement.style.getPropertyValue('--posx'),
            posy: document.documentElement.style.getPropertyValue('--posy')
        });

        nTrl += 1;
    }
    if (data.key_press === 27){
        jsPsych.endExperiment();
    }
}

function blockFeedbackTxt(){
    var dat = jsPsych.data.get().filter({stim:"flanker", blockNum: nBlk});
    var nTotal = dat.count();
    var nError = dat.select("corrCode").values.filter(function(x){return x !== 1;}).length;
    dat = jsPsych.data.get().filter({stim:"flanker", corrCode: 1});
    var meanRT = dat.select("rt").mean();
    var fbTxt = "<h1>Block: " + nBlk + " von " + numBlks + "</h1>" +
        "<h1>Mittlere Reaktionszeit: " + Math.round(meanRT) + " ms </h1>" +
        "<h1>Fehlerrate: " + Math.round((nError/nTotal)*100) + " %</h1>" +
        "<h2>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>";
    nBlk += 1;
    return fbTxt;
}

var blkFb = {
    type: "text",
    timing_post_trial: waitDur,
    text: blockFeedbackTxt
};

var debrief= {
    type: "text",
    timing_post_trial: waitDur,
    text: "<h1>Das Experiment ist beendet.</h1>" +
    "<h2>Drücken Sie eine beliebige Taste, um das Experiment zu beenden!</h2>"
};

/////////////////////////////// Save Data /////////////////////////////////////
var writeDataFile = function(){
    var fname = "flankerExp2_" + vpNum + ".csv";
    var data  = jsPsych.data.get().filter({stim: "flanker"}).csv();
    $.ajax({
        type:"post",
        cache: false,
        url: "write_data.php",
        data: {filename: fname, filedata: data}
    });
};

var saveData = {
    type: "call-function",
    func: writeDataFile,
    timing_post_trial: 50
};


var writeRandomCode = function(code){
    var fname = "flankerExp2.csv";
    $.ajax({
        type:"post",
        cache: false,
        url: "write_code.php",
        data: {filename: fname, filedata: code}
    });
};

function randomString(length) {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = "";
    for (var i = length; i > 0; --i)
        result += chars[Math.round(Math.random()*(chars.length - 1))];
    writeRandomCode(result);
    return result;
}

var alphaNum = {
    type: "text",
    text: "<h1 align='left'>Wenn Sie für diesen Versuch eine Versuchspersonenstunde,</h1>" +
          "<h1 align='left'>benötigen, kopieren Sie den folgenden zufällig generierten Code</h1>" +
          "<h1 align='left'>und senden Sie diesen zusammen mit Ihrer Matrikelnummer per Email an:</h1><br>" +
          "<h1>ian.mackenzie@uni-tuebingen.de</h1>" +
          "<h1>Code:" + randomString(16) + "</h1><br>" +
          "<h1 align='left'>Drücken Sie eine beliebige Taste, um fortzufahren!</h1>",
    choices: [32]
};

//////////////////// Generate experiment sequence /////////////////////////////
function genExpSeq(){
    "use strict";

    var blk;
    var trl;
    var stim;
    var exp = [];
    var flankers;
    var block;

    exp.push(welcome);
    exp.push(vpInfoForm);
    exp.push(resize);
    exp.push(screenInfo);
    exp.push(instructions);
    for (blk = 0; blk < numBlks; blk++){

        stim = [];
        if (blk === 0) {
            flankers = jsPsych.randomization.repeat(flanker, numTrlsP / flanker.length);
        } else {
            flankers = jsPsych.randomization.repeat(flanker, numTrlsE / flanker.length);
        }

        for (trl = 0; trl < flankers.length; trl++) {
            if (trl % 2 === 0) {
                stim.push(setStimulusPositionsCentre);
            } else {
                stim.push(setStimulusPositionsRandom);
            }
            stim.push(fixAbsent);
            stim.push(flankers[trl]);
            if (blk === 0) {
                stim.push(trlFbPrac);
            } else {
                stim.push(trlFbExp);
            }
            stim.push(interTrialInterval);
        }
        block = {
            type: "single-stim",
            choices: respKeys,
            on_finish: codeTrial,
            timeline: stim
        };
        exp.push(block);
        exp.push(blkFb);
    }

    exp.push(saveData);
    exp.push(alphaNum);
    exp.push(debrief);

    return exp;
}
EXP = genExpSeq();

/////////////////////////////// Run Experiment ////////////////////////////////
jsPsych.init({
    timeline: EXP,
    fullscreen: true,
    show_progress_bar: false
});
