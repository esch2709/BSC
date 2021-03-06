// Standard Stroop combined with a negation language task (not left vs now left)
// VPs respond to font colour in the stroop task and phrase meaning in the
// negation task using the "C" and "M" keys.

const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 16,
  nTrlsE: 96,
  nBlks: 11,
  fixDur: 500,
  fbDur: 1000,
  waitDur: 1000,
  iti: 500,
  tooFast: 150,
  tooSlow: 1500,
  mapping: jsPsych.randomization.sampleWithoutReplacement([1, 2], 1)[0],
  fbTxt: ['Richtig', 'Falsch', 'Zu langsam', 'Zu schnell'],
  cTrl: 1,
  cBlk: 1,
};

prms.colours = prms.mapping === 1 ? ['ROT', 'BLAU'] : ['BLAU', 'ROT'];
prms.respKeys = prms.mapping === 1 ? ['C', 'M'] : ['M', 'C'];

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions = {
  type: 'html-keyboard-response',
  stimulus:
    "<h1 style='text-align:center;'>Aufgabe:</h1>" +
    "<h2 style='text-align:center;'>Reagieren Sie auf die Schriftfarbe bzw. auf die Bedeutung des Texts:</h2>" +
    "<h2 style='text-align:center;'>" +
    prms.colours[0] +
    ' bzw. Links = C Taste</h2>' +
    "<h2 style='text-align:center;'>" +
    prms.colours[1] +
    ' bzw. Rechts = M Taste</h2>' +
    "<h2 style='text-align:center;'>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>",
  post_trial_gap: prms.waitDur,
};

////////////////////////////////////////////////////////////////////////
//                              Stimuli                               //
////////////////////////////////////////////////////////////////////////
const fixation_cross = {
  type: 'html-keyboard-response',
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: prms.fixDur,
  post_trial_gap: 0,
  data: { stim: 'fixation' },
};

const stims = [
  ['<h1 style="color:red">rot</h1>'],
  ['<h1 style="color:red">rot</h1>'],
  ['<h1 style="color:red">grün</h1>'],
  ['<h1 style="color:red">gelb</h1>'],
  ['<h1 style="color:blue">blau</h1>'],
  ['<h1 style="color:blue">blau</h1>'],
  ['<h1 style="color:blue">grün</h1>'],
  ['<h1 style="color:blue">gelb</h1>'],
  ['<h1>jetzt links</h1>'],
  ['<h1>jetzt rechts</h1>'],
  ['<h1>nicht links</h1>'],
  ['<h1>nicht rechts</h1>'],
  ['<h1>jetzt links</h1>'],
  ['<h1>jetzt rechts</h1>'],
  ['<h1>nicht links</h1>'],
  ['<h1>nicht rechts</h1>'],
];

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = 0;
  let rt = dat.rt !== null ? dat.rt : prms.tooSlow;

  let correctKey;
  if (dat.response !== null) {
      correctKey = jsPsych.pluginAPI.compareKeys(dat.response, dat.corrResp);
  }

  if (correctKey && (rt > prms.tooFast && rt < prms.tooSlow)) {
    corrCode = 1; // correct
  } else if (!correctKey && (rt > prms.tooFast && rt < prms.tooSlow)) {
    corrCode = 2; // choice error
  } else if (rt >= prms.tooSlow) {
    corrCode = 3; // too slow
  } else if (rt <= prms.tooFast) {
    corrCode = 4; // too false
  }
  jsPsych.data.addDataToLastTrial({
    date: Date(),
    rt: rt,
    corrCode: corrCode,
    blockNum: prms.cBlk,
    trialNum: prms.cTrl,
  });
  prms.cTrl += 1;
}

const trial_stimulus = {
  type: 'html-keyboard-response',
  stimulus: jsPsych.timelineVariable('stimulus'),
  trial_duration: prms.tooSlow,
  response_ends_trial: true,
  choices: prms.respKeys,
  post_trial_gap: 0,
  data: {
    stimulus: 'negStroop',
    task: jsPsych.timelineVariable('task'),
    compatibility: jsPsych.timelineVariable('comp'),
    corrResp: jsPsych.timelineVariable('key'),
  },
  on_finish: function () {
    codeTrial();
  },
};

const trial_feedback = {
  type: 'html-keyboard-response',
  stimulus: '',
  trial_duration: prms.fbDur,
  response_ends_trial: false,
  post_trial_gap: prms.iti,
  data: { stim: 'feedback' },
  on_start: function (trial) {
    if (prms.cBlk === 1) {
      trial.stimulus = trialFeedbackTxt(prms.fbTxt);
    }
  },
};

const block_feedback = {
  type: 'html-keyboard-response',
  stimulus: blockFeedbackTxt,
  response_ends_trial: true,
  post_trial_gap: prms.waitDur,
};

const trial_timeline = {
  timeline: [fixation_cross, trial_stimulus, trial_feedback],
  timeline_variables: [
    { stimulus: stims[0], task: 'stroop', comp: 'comp', key: prms.respKeys[0] },
    { stimulus: stims[1], task: 'stroop', comp: 'comp', key: prms.respKeys[0] },
    { stimulus: stims[2], task: 'stroop', comp: 'incomp', key: prms.respKeys[0] },
    { stimulus: stims[3], task: 'stroop', comp: 'incomp', key: prms.respKeys[0] },
    { stimulus: stims[4], task: 'stroop', comp: 'comp', key: prms.respKeys[1] },
    { stimulus: stims[5], task: 'stroop', comp: 'comp', key: prms.respKeys[1] },
    { stimulus: stims[6], task: 'stroop', comp: 'incomp', key: prms.respKeys[1] },
    { stimulus: stims[7], task: 'stroop', comp: 'incomp', key: prms.respKeys[1] },
    { stimulus: stims[8], task: 'affneg', comp: 'comp', key: 'C' },
    { stimulus: stims[9], task: 'affneg', comp: 'comp', key: 'M' },
    { stimulus: stims[10], task: 'affneg', comp: 'incomp', key: 'M' },
    { stimulus: stims[11], task: 'affneg', comp: 'incomp', key: 'C' },
    { stimulus: stims[12], task: 'affneg', comp: 'comp', key: 'C' },
    { stimulus: stims[13], task: 'affneg', comp: 'comp', key: 'M' },
    { stimulus: stims[14], task: 'affneg', comp: 'incomp', key: 'M' },
    { stimulus: stims[15], task: 'affneg', comp: 'incomp', key: 'C' },
  ],
};

const randomString = generateRandomString(16);

const alphaNum = {
  type: 'html-keyboard-response',
  stimulus:
    '<h1>Wenn Sie für diesen Versuch eine Versuchspersonenstunde</h1>' +
    '<h1>benötigen, kopieren Sie den folgenden zufällig generierten Code</h1>' +
    '<h1>und senden Sie diesen zusammen mit Ihrer Matrikelnummer per Email an:</h1>' +
    '<h2>XXX@XXXe</h2>' +
    '<h1>Code:' +
    randomString +
    '</h1>' +
    '<h2>Drücken Sie eine beliebige Taste, um fortzufahren!</h2>',
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  exp.push(welcome_de);
  //exp.push(vpInfoForm);
  exp.push(task_instructions);

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    let blk_timeline = { ...trial_timeline };
    blk_timeline.sample = { type: 'fixed-repetitions', size: blk === 0 ? prms.nTrlsP / 16 : prms.nTrlsE / 16 };
    exp.push(blk_timeline); // trials within a block
    exp.push(block_feedback); // show previous block performance
  }
  exp.push(debrief_de);
  exp.push(alphaNum);
  return exp;
}
const EXP = genExpSeq();
const filename = dirName + 'data/' + expName + '_' + genVpNum();

jsPsych.init({
  timeline: EXP,
  show_progress_bar: false,
  on_finish: function () {
    saveRandomCode(expName);
    saveData('/Common/write_data.php', filename, { stim: 'negStroop' });
  },
});
