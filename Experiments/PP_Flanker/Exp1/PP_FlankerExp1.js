// Modified version of a Prioritized Processing task with central flanker
// stimuli.  VPs respond to a central target stimulus (e.g., H,S,K) with left
// and right key-presses ("Q" and "P"). The central target is surrounded by
// task irrelevant flankers (e.g., HSH). Two of the three letters are assigned
// to left and right keys (primary task), whilst the third letter indicates
// that the background task is to be performed (respond according to the
// fllanker stimulus) The proportion of required primary vs. background
// responses is manipulated blockwise, with HighPri vs. LowPri at 90/10 and
// 50/50, respectively.

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const cc = 'rgba(200, 200, 200, 1)';
const cs = [960, 720];
const cb = '5px solid black';

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();
const nFiles = getNumberOfFiles('/Common/num_files.php', dirName + 'data/');

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsBase: 40, // number of trials in Flanker baseline blocks
  nBlksBase: 8, // number of blocks of Flanker baseline
  nTrlsPP: 40, // number of trials in subsequent blocks
  nBlksPP: 16,
  nBlks: 24,
  fixDur: 500,
  fbDur: [1000, 3000, 3000],
  iti: 500,
  tooFast: 100,
  tooSlow: 2000,
  respLetters: shuffle(['H', 'S', 'G']),
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
  fixWidth: 2,
  fixSize: 10,
  stimSize: '40px monospace',
  fbSize: '24px monospace',
  respKeys: ['Q', 'P', 27],
};

const nVersion = getVersionNumber(nFiles, 2);
jsPsych.data.addProperties({ version: nVersion });

// response keys for baseline flanker
let respText_base =
  "<h3 style='text-align:center;'><b>" +
  prms.respLetters[0] +
  " = linker Zeigefinger (Taste 'Q')</b></h3>" +
  "<h3 style='text-align:center;'><b>" +
  prms.respLetters[1] +
  " = rechter Zeigefinger (Taste 'P')</b></h3><br>";

let respText_pp =
  "<h3 style='text-align:center;'><b>" +
  prms.respLetters[0] +
  " = linker Zeigefinger (Taste 'Q')</b></h3>" +
  "<h3 style='text-align:center;'><b>" +
  prms.respLetters[1] +
  " = rechter Zeigefinger (Taste 'P')</b></h3><br>";

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions1 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h2 style='text-align: center;'>Willkommen bei unserem Experiment:</h2><br>" +
    "<h3 style='text-align: center;'>Die Teilnahme ist freiwillig und du darfst das Experiment jederzeit abbrechen.</h3><br>" +
    "<h3 style='text-align: center;'>Bitte stelle sicher, dass du dich in einer ruhigen Umgebung befindest und </h3>" +
    "<h3 style='text-align: center;'>gen??gend Zeit hast, um das Experiment durchzuf??hren.</h3><br>" +
    "<h3 style='text-align: center;'>Wir bitten dich die ca. 40 Minuten konzentriert zu arbeiten.</h3><br>" +
    "<h2 style='text-align: center;'>Dr??cke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions2 = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h3 style='text-align: left;'>Du erhaelst den Code f??r die Versuchspersonenstunden und weitere Anweisungen</h3>" +
    "<h3 style='text-align: left;'>am Ende des Experimentes. Bei Fragen oder Problemen wende dich bitte an:</h3><br>" +
    "<h3 style='text-align: center;'>hiwipibio@gmail.com</h3><br>" +
    "<h2 style='text-align: center;'>Dr??cke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions_base = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h2 style='text-align: center;'>Aufgabe:</h2>" +
    "<h3 style='text-align: left;'>In diesem Experiment musst du auf verschiedene Buchstaben</h3>" +
    "<h3 style='text-align: left;'>so schnell und so genau wie m??glich reagieren.</h3>" +
    "<h3 style='text-align: left;'>Der Ziel-Buchstabe erscheint in der Mitte des Bildschirms.</h3><br>" +
    "<h3 style='text-align: left;'>Reagiere auf diesen Ziel-Buchstaben wie folgt:</h3><br>" +
    respText_base +
    "<h2 style='text-align: center;'>Dr??cke eine beliebige Taste, um fortzufahren.</h2>",
};

const task_instructions_base_reminder = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus =
      "<h2 style='text-align: center;'>Block " +
      prms.cBlk +
      ' von 24:</h2><br>' +
      "<h3 style='text-align: left;'>Wenn du bereit f??r den Block bist dann positioniere die Zeigefinger </h3>" +
      "<h3 style='text-align: left;'>deiner beiden H??nde auf die Tastatur. Es gilt:</h3><br>" +
      respText_base +
      "<h2 style='text-align: center;'>Dr??cke eine beliebige Taste, um fortzufahren!</h2>";
  },
};

const task_instructions_pause = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h3 style='text-align: left;'>Kurze Pause. Bitte nutze die Pause, um dich zu erholen. Wenn du wieder bereit</h3>" +
    "<h3 style='text-align: left;'>f??r den n??chsten Block bist, dann dr??cke eine beliebige Taste.</h3>",
};

const task_instructions_pp = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus:
    "<h2 style='text-align: center;'>ACHTUNG: NEUE INSTRUKTIONEN!!!</h2>" +
    "<h3 style='text-align: left;'>Die erste Priorit??t ist auf den mittleren Buchstaben weiterhin wie folgt zu reagieren:</h3><br>" +
    respText_base +
    "<h3 style='text-align: left;'>Wenn der Buchstabe in der Mitte aber " +
    prms.respLetters[2] +
    ' ist, dann reagiere auf die</h3>' +
    "<h3 style='text-align: left;'>umliegenden (links/rechts) Buchstaben (zweite Priorit??t):</h3><br>" +
    respText_pp +
    "<h2 style='text-align: center;'>Dr??cke eine beliebige Taste, um fortzufahren!</h2>",
};

const task_instructions_pp_reminder = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus: '',
  on_start: function (trial) {
    trial.stimulus =
      "<h2 style='text-align: center;'>Block " +
      prms.cBlk +
      ' von 24:</h2><br>' +
      "<h3 style='text-align: left;'>Erste Priorit??t ist der mittige Buchstabe:</h3>" +
      respText_base +
      "<h3 style='text-align: left;'>Wenn der mittige Buchstabe aber " +
      prms.respLetters[2] +
      ' ist, dann reagiere auf die</h3>' +
      "<h3 style='text-align: left;'>umliegenden Buchstaben:</h3>" +
      respText_pp +
      "<h2 style='text-align: center;'>Dr??cke eine beliebige Taste, um fortzufahren!</h2>";
  },
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
function drawFixation() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.lineWidth = prms.fixWidth;
  ctx.moveTo(-prms.fixSize, 0);
  ctx.lineTo(prms.fixSize, 0);
  ctx.stroke();
  ctx.moveTo(0, -prms.fixSize);
  ctx.lineTo(0, prms.fixSize);
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
  func: drawFixation,
};

function drawFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = prms.fbSize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  if (dat.blk_type === 'B') {
    switch (dat.corrCode) {
      case 1: // correct
        ctx.fillText('Richtig', 0, 0);
        break;
      case 2: // Falsch
        ctx.fillText('Falsch!', 0, -50);
        ctx.fillText(prms.respLetters[0] + " = linker Zeigefinger (Taste 'Q')", 0, 0);
        ctx.fillText(prms.respLetters[1] + " = rechter Zeigefinger (Taste 'P')", 0, 50);
        break;
      case 3: // Too Slow
        ctx.fillText('Zu langsam!', 0, 0);
        break;
    }
  } else {
    switch (dat.corrCode) {
      case 1: // correct
        ctx.fillText('Richtig', 0, 0);
        break;
      case 2: // Falsch
        if (dat.task === 'T1') {
          ctx.fillText('Falsch!', 0, -75);
          ctx.fillText('Erste Priorit??t ist der mittige Buchstabe:', 0, -25);
          ctx.fillText(prms.respLetters[0] + " = linker Zeigefinger (Taste 'Q')", 0, 25);
          ctx.fillText(prms.respLetters[1] + " = rechter Zeigefinger (Taste 'P')", 0, 75);
        } else if (dat.task === 'T2') {
          ctx.fillText('Falsch!', 0, -75);
          ctx.fillText(
            'Wenn der Buchstabe ' + prms.respLetters[2] + ' ist, reagiere auf die umliegenden Buchstaben:',
            0,
            -25,
          );
          ctx.fillText(prms.respLetters[0] + " = linker Zeigefinger (Taste 'Q')", 0, 25);
          ctx.fillText(prms.respLetters[1] + " = rechter Zeigefinger (Taste 'P')", 0, 75);
        }
        break;
      case 3: // Too Slow
        ctx.fillText('Zu langsam!', 0, 0);
        break;
    }
  }
}

function drawFlanker(args) {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = prms.stimSize;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // draw Flanker
  ctx.fillStyle = 'black';
  ctx.fillText(args.letter, 0, 0);
}

function codeTrial() {
  'use strict';

  let dat = jsPsych.data.get().last(1).values()[0];

  let corrCode = 0;
  let corrKeyNum = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(dat.corrResp);
  let rt = dat.rt !== null ? dat.rt : prms.tooSlow;
  if (dat.key_press === corrKeyNum && rt < prms.tooSlow) {
    corrCode = 1; // correct
  } else if (dat.key_press !== corrKeyNum && rt < prms.tooSlow) {
    corrCode = 2; // choice error
  } else if (rt >= prms.tooSlow) {
    corrCode = 3; // too slow
  }

  jsPsych.data.addDataToLastTrial({
    date: Date(),
    keyPress: dat.key_press,
    rt: rt,
    corrCode: corrCode,
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
  });
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
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prms.fbDur[dat.corrCode - 1];
  },
};

const iti = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  trial_duration: prms.iti,
  response_ends_trial: false,
  func: function () {},
};

const block_feedback = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  stimulus: '',
  response_ends_trial: true,
  on_start: function (trial) {
    trial.stimulus = blockFeedbackTxt_de_du({ stim: 'pp_flanker' });
  },
};

const flanker_stimulus = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  translate_origin: true,
  response_ends_trial: true,
  choices: prms.respKeys,
  trial_duration: prms.tooSlow,
  func: drawFlanker,
  func_args: [{ letter: jsPsych.timelineVariable('letter') }],
  data: {
    stim: 'pp_flanker',
    letter: jsPsych.timelineVariable('letter'),
    task: jsPsych.timelineVariable('task'),
    blk_type: jsPsych.timelineVariable('blk_type'),
    comp: jsPsych.timelineVariable('comp'),
    corrResp: jsPsych.timelineVariable('corrResp'),
  },
  on_finish: function () {
    codeTrial();
  },
};

const flanker_t1 = [
  {
    letter: prms.respLetters[0] + prms.respLetters[0] + prms.respLetters[0],
    task: 'T1',
    comp: 'comp',
    corrResp: prms.respKeys[0],
  },
  {
    letter: prms.respLetters[1] + prms.respLetters[1] + prms.respLetters[1],
    task: 'T1',
    comp: 'comp',
    corrResp: prms.respKeys[1],
  },
  {
    letter: prms.respLetters[1] + prms.respLetters[0] + prms.respLetters[1],
    task: 'T1',
    comp: 'incomp',
    corrResp: prms.respKeys[0],
  },
  {
    letter: prms.respLetters[0] + prms.respLetters[1] + prms.respLetters[0],
    task: 'T1',
    comp: 'incomp',
    corrResp: prms.respKeys[1],
  },
];

const trial_timeline_flanker_base = {
  timeline: [fixation_cross, flanker_stimulus, trial_feedback],
  timeline_variables: repeatArray(flanker_t1, prms.nTrlsBase / 4),
};

const flanker_t2 = [
  {
    letter: prms.respLetters[0] + prms.respLetters[2] + prms.respLetters[0],
    task: 'T2',
    comp: 'na',
    corrResp: prms.respKeys[0],
  },
  {
    letter: prms.respLetters[1] + prms.respLetters[2] + prms.respLetters[1],
    task: 'T2',
    position: 'right',
    comp: 'na',
    corrResp: prms.respKeys[1],
  },
];

const trial_timeline_flanker_low = {
  timeline: [fixation_cross, flanker_stimulus, trial_feedback],
  timeline_variables: repeatArray(flanker_t1, (prms.nTrlsBase - 4) / 4).concat(
    repeatArray(flanker_t2, prms.nTrlsBase / 10 / 2),
  ), // 90% vs. 10%
};

const trial_timeline_flanker_high = {
  timeline: [fixation_cross, flanker_stimulus, trial_feedback],
  timeline_variables: repeatArray(flanker_t1, prms.nTrlsBase / 2 / 4).concat(
    repeatArray(flanker_t2, prms.nTrlsBase / 2 / 2),
  ), // 50% vs. 50%
};

const randomString = generateRandomStringWithExpName('PPF', 16);

const alphaNum = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: cc,
  canvas_size: cs,
  canvas_border: cb,
  response_ends_trial: true,
  choices: [32],
  stimulus:
    "<h3 style='text-align:left;'>Wenn du eine Versuchspersonenstunde ben??tigst, </h3>" +
    "<h3 style='text-align:left;'>kopiere den folgenden zuf??llig generierten Code</h3>" +
    "<h3 style='text-align:left;'>und sende diesen zusammen mit deiner Matrikelnummer</h3><br>" +
    "<h3 style='text-align:left;'>und deiner Universit??t (Bremen/T??bingen) per Email an:</h3><br>" +
    '<h2>hiwipibio@gmail.com</h2>' +
    '<h1>Code: ' +
    randomString +
    '</h1><br>' +
    "<h2 align='left'>Dr??cke die Leertaste, um fortzufahren!</h2>",
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  exp.push(fullscreen_on);
  exp.push(welcome_de_du);
  exp.push(resize_de_du);
  exp.push(vpInfoForm_de);
  exp.push(hideMouseCursor);
  exp.push(screenInfo);
  exp.push(task_instructions1);
  exp.push(task_instructions2);

  // baseline Flanker block
  exp.push(task_instructions_base);
  for (let blk = 0; blk < prms.nBlksBase; blk += 1) {
    exp.push(task_instructions_base_reminder);
    let blk_timeline_flanker_base = deepCopy(trial_timeline_flanker_base);
    blk_timeline_flanker_base.sample = { type: 'fixed-repetitions', size: 1 };
    // add (B)aseline block type to timeline variables
    for (let i = 0; i < blk_timeline_flanker_base.timeline_variables.length; i++) {
      blk_timeline_flanker_base.timeline_variables[i].blk_type = 'B';
    }
    exp.push(blk_timeline_flanker_base); // trials within a block
    exp.push(block_feedback); // show previous block performance
    exp.push(task_instructions_pause);
  }

  // PP Flanker block
  exp.push(task_instructions_pp);
  let blk_prob;
  if (nVersion % 2 == 0) {
    blk_prob = repeatArray(['L'], prms.nBlksPP / 2).concat(repeatArray(['H'], prms.nBlksPP / 2));
  } else {
    blk_prob = repeatArray(['H'], prms.nBlksPP / 2).concat(repeatArray(['L'], prms.nBlksPP / 2));
  }

  let blk_timeline_pp;
  for (let blk = 0; blk < prms.nBlksPP; blk += 1) {
    exp.push(task_instructions_pp_reminder);
    if (blk_prob[blk] === 'L') {
      blk_timeline_pp = deepCopy(trial_timeline_flanker_low);
    } else if (blk_prob[blk] === 'H') {
      blk_timeline_pp = deepCopy(trial_timeline_flanker_high);
    }

    // add (L)ow vs. (H)igh to block timeline variables
    for (let i = 0; i < blk_timeline_pp.timeline_variables.length; i++) {
      blk_timeline_pp.timeline_variables[i].blk_type = blk_prob[blk];
    }

    blk_timeline_pp.sample = { type: 'fixed-repetitions', size: 1 };
    exp.push(blk_timeline_pp); // trials within a block
    exp.push(block_feedback); // show previous block performance
    exp.push(task_instructions_pause);
  }

  exp.push(debrief_de);
  exp.push(showMouseCursor);
  exp.push(alphaNum);
  exp.push(fullscreen_off);

  return exp;
}
const EXP = genExpSeq();

const data_filename = dirName + 'data/' + expName + '_' + vpNum;
const code_filename = dirName + 'code/' + expName;

jsPsych.init({
  timeline: EXP,
  show_progress_bar: false,
  exclusions: {
    min_width: cs[0],
    min_height: cs[1],
  },
  on_finish: function () {
    saveData('/Common/write_data.php', data_filename, { stim: 'pp_flanker' });
    saveRandomCode('/Common/write_code.php', code_filename, randomString);
  },
});
