// Negation task using the phrases "now left"/"not left" and mouse tracking responses.

////////////////////////////////////////////////////////////////////////
//                         Canvas Properties                          //
////////////////////////////////////////////////////////////////////////
const canvas_colour = 'rgba(255, 255, 255, 1)';
const canvas_size = [1280, 720];
const canvas_border = '5px solid black';

const check_screen = {
  type: 'check-screen-resolution',
  width: canvas_size[0],
  height: canvas_size[1],
  timing_post_trial: 0,
  on_finish: function () {
    reload_if_not_fullscreen();
  },
};

////////////////////////////////////////////////////////////////////////
//                             Experiment                             //
////////////////////////////////////////////////////////////////////////
const expName = getFileName();
const dirName = getDirName();
const vpNum = genVpNum();
const pcInfo = getComputerInfo();

////////////////////////////////////////////////////////////////////////
//                           Exp Parameters                           //
////////////////////////////////////////////////////////////////////////
const prms = {
  nTrlsP: 8, // number of trials in first block (practice)
  nTrlsE: 16, // number of trials in subsequent blocks
  nBlks: 2,
  fbDur: [500, 1000], // feedback duration for correct and incorrect trials, respectively
  waitDur: 1000,
  iti: 500,
  fixPos: [canvas_size[0] / 2, canvas_size[1] * 0.75], // x,y position of stimulus
  fixDur: 500,
  stimPos: [canvas_size[0] / 2, canvas_size[1] * 0.75], // x,y position of stimulus
  startBox: [canvas_size[0] / 2, canvas_size[1] * 0.9, 50, 50], // xpos, ypos, xsize, ysize
  leftBox: [200, 150, 50, 50], // xpos, ypos, xsize, ysize
  rightBox: [1080, 150, 50, 50], // xpos, ypos, xsize, ysize
  keepFixation: false, // is fixation cross kept on screen with stimulus
  drawStartBox: [true, true, true], // draw response boxes at trial initiation, fixation cross, and response execution stages
  drawResponseBoxes: [false, true, true], // draw response boxes at trial initiation, fixation cross, and response execution stages
  boxLineWidth: 2, // linewidth of the start/target boxes
  requireMousePressStart: true, // is mouse button press inside start box required to initiate trial?
  requireMousePressFinish: false, // is mouse button press inside response box required to end trial?
  stimFont: '50px arial',
  fbTxt: ['Richtig', 'Falsch'],
  fbFont: '40px Arial',
  cTrl: 1, // count trials
  cBlk: 1, // count blocks
};

////////////////////////////////////////////////////////////////////////
//                      Experiment Instructions                       //
////////////////////////////////////////////////////////////////////////
const task_instructions = {
  type: 'html-keyboard-response',
  stimulus:
    "<H1 style='text-align: left;'>BITTE NUR TEILNEHMEN, FALLS EINE</H1>" +
    "<H1 style='text-align: left;'>COMPUTER-MAUS ZUR VERF??GUNG STEHT!</H1><br>" +
    "<H2 style='text-align: left;'>Liebe/r Teilnehmer/in</H2><br>" +
    "<H2 style='text-align: left;'>...<br><br>" +
    "<h3 style='text-align: center;'>Dr??cke eine beliebige Taste, um fortzufahren!</h3>",
  post_trial_gap: prms.waitDur,
};

function drawFeedback() {
  'use strict';
  let ctx = document.getElementById('canvas').getContext('2d');
  let dat = jsPsych.data.get().last(1).values()[0];
  ctx.font = '50px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText(prms.fbTxt[dat.corrCode], dat.end_x, dat.end_y);
}

function codeTrial() {
  'use strict';
  let dat = jsPsych.data.get().last(1).values()[0];
  let corrCode = dat.resp_loc !== dat.end_loc ? 1 : 0;
  jsPsych.data.addDataToLastTrial({ date: Date(), corrCode: corrCode, blockNum: prms.cBlk, trialNum: prms.cTrl });
  prms.cTrl += 1;
  if (dat.key_press === 27) {
    jsPsych.endExperiment();
  }
}

let images = {
  healthy: {
    type: 'preload',
    auto_preload: true,
    images: ['imgs/health1.jpg', 'imgs/health1.jpg', 'imgs/health1.jpg', 'imgs/health1.jpg', 'imgs/health1.jpg'],
  },
  unhealthy: {
    type: 'preload',
    auto_preload: true,
    images: ['imgs/junk1.jpg', 'imgs/junk2.jpg', 'imgs/junk3.jpg', 'imgs/junk4.jpg', 'imgs/junk5.jpg'],
  },
};

const trial_stimulus = {
  type: 'mouse-image-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  fixation_duration: prms.fixDur,
  fixation_position: prms.fixPos,
  stimulus: jsPsych.timelineVariable('word'),
  stimulus_position: prms.stimPos,
  stimulus_colour: 'black',
  stimulus_font: prms.stimFont,
  start_box: prms.startBox,
  left_box: prms.leftBox,
  right_box: prms.rightBox,
  left_box_colour: 'rgb(200, 200, 200)',
  right_box_colour: 'rgb(200, 200, 200)',
  left_image: null,
  right_image: null,
  keep_fixation: prms.keepFixation,
  draw_start_box: prms.drawStartBox,
  draw_response_boxes: prms.drawResponseBoxes,
  box_linewidth: prms.boxLineWidth,
  require_mouse_press_start: prms.requireMousePressStart,
  require_mouse_press_finish: prms.requireMousePressFinish,
  word: jsPsych.timelineVariable('word'),
  scale_factor: null,
  data: {
    stim_type: 'mouse_negation',
    word: jsPsych.timelineVariable('word'),
    image_type_left: jsPsych.timelineVariable('image_type_left'),
    image_type_right: jsPsych.timelineVariable('image_type_right'),
    resp_loc: jsPsych.timelineVariable('resp_loc'),
  },
  on_start: function (trial) {
    trial.left_image = images[trial.data.image_type_left].images[getRandomInt(0, 4)];
    trial.right_image = images[trial.data.image_type_right].images[getRandomInt(0, 4)];
  },
  on_finish: function () {
    codeTrial();
  },
};

// prettier-ignore
const stimuli = [
  { word: 'jetzt gesund', aff_neg: 'aff', image_type_left: "healthy",   image_type_right: "unhealthy", resp_loc: "left"  },
  { word: 'jetzt junk',   aff_neg: 'aff', image_type_left: "healthy",   image_type_right: "unhealthy", resp_loc: "right" },
  { word: 'nicht gesund', aff_neg: 'neg', image_type_left: "healthy",   image_type_right: "unhealthy", resp_loc: "right" },
  { word: 'nicht junk',   aff_neg: 'neg', image_type_left: "healthy",   image_type_right: "unhealthy", resp_loc: "left"  },
  { word: 'jetzt gesund', aff_neg: 'aff', image_type_left: "unhealthy", image_type_right: "healthy",   resp_loc: "right" },
  { word: 'jetzt junk',   aff_neg: 'aff', image_type_left: "unhealthy", image_type_right: "healthy",   resp_loc: "left"  },
  { word: 'nicht gesund', aff_neg: 'neg', image_type_left: "unhealthy", image_type_right: "healthy",   resp_loc: "left"  },
  { word: 'nicht junk',   aff_neg: 'neg', image_type_left: "unhealthy", image_type_right: "healthy",   resp_loc: "right" },
];

const trial_feedback = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: null,
  translate_origin: false,
  func: drawFeedback,
  on_start: function (trial) {
    let dat = jsPsych.data.get().last(1).values()[0];
    trial.trial_duration = prms.fbDur[dat.corrCode];
  },
};

function blockFeedbackTxt(filter_options) {
  'use strict';
  let dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk });
  console.log(dat);
  let nTotal = dat.count();
  console.log(nTotal);
  let nError = dat.select('corrCode').values.filter((x) => x !== 0).length;
  console.log(nError);
  dat = jsPsych.data.get().filter({ ...filter_options, blockNum: prms.cBlk, corrCode: 0 });
  let blockFbTxt =
    '<H1>Block: ' +
    prms.cBlk +
    ' of ' +
    prms.nBlks +
    '</H1>' +
    '<H1>Mean RT: ' +
    Math.round(dat.select('end_rt').mean()) +
    ' ms </H1>' +
    '<H1>Error Rate: ' +
    Math.round((nError / nTotal) * 100) +
    ' %</H1>' +
    '<H2>Dr??cke eine beliebige Taste, um fortzufahren!</H2>';
  prms.cBlk += 1;
  prms.cTrl = 0;
  return blockFbTxt;
}

const iti = {
  type: 'static-canvas-keyboard-response',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  trial_duration: prms.iti,
  response_ends_trial: false,
  func: function () {},
};

const block_feedback = {
  type: 'html-keyboard-response',
  stimulus: '',
  response_ends_trial: true,
  post_trial_gap: prms.waitDur,
  on_start: function (trial) {
    trial.stimulus = blockFeedbackTxt({ stim_type: 'mouse_negation' });
  },
};

const trial_timeline = {
  timeline: [trial_stimulus, trial_feedback, iti],
  randomize_order: true,
  timeline_variables: stimuli,
};

// For VP Stunden
const randomString = generateRandomString(16);

const alphaNum = {
  type: 'html-keyboard-response-canvas',
  canvas_colour: canvas_colour,
  canvas_size: canvas_size,
  canvas_border: canvas_border,
  response_ends_trial: true,
  choices: [' '],
  stimulus: generate_formatted_html({
    text:
      `Vielen Dank f??r Ihre Teilnahme.<br><br>
        Wenn Sie Versuchspersonenstunden ben??tigen, kopieren Sie den folgenden
        zuf??llig generierten Code und senden Sie diesen zusammen mit Ihrer
        Matrikelnummer per Email mit dem Betreff 'Versuchpersonenstunde'
        an:<br><br>sprachstudien@psycho.uni-tuebingen.de<br> Code: ` +
      randomString +
      `<br><br>Dr??cken Sie die Leertaste, um fortzufahren!`,
    fontsize: 28,
    lineheight: 1.0,
    align: 'left',
  }),
};

////////////////////////////////////////////////////////////////////////
//                                Save                                //
////////////////////////////////////////////////////////////////////////
const save_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/' + expName + '_' + vpNum;
    saveData('/Common/write_data_json.php', data_filename, { stim: 'mouse_negation' }, 'json');
  },
  timing_post_trial: 1000,
};

const save_interaction_data = {
  type: 'call-function',
  func: function () {
    let data_filename = dirName + 'data/' + expName + '_interaction_data_' + vpNum;
    saveInteractionData('/Common/write_data.php', data_filename);
  },
  timing_post_trial: 200,
};

const save_code = {
  type: 'call-function',
  func: function () {
    let code_filename = dirName + 'code/' + expName;
    saveRandomCode('/Common/write_code.php', code_filename, randomString);
  },
  timing_post_trial: 200,
};

////////////////////////////////////////////////////////////////////////
//                    Generate and run experiment                     //
////////////////////////////////////////////////////////////////////////
function genExpSeq() {
  'use strict';

  let exp = [];

  // pre-load images
  exp.push(images.healthy);
  exp.push(images.unhealthy);

  exp.push(fullscreen_on);
  exp.push(check_screen);
  exp.push(welcome_de);
  exp.push(resize_de);
  // exp.push(vpInfoForm_de);
  exp.push(task_instructions);

  for (let blk = 0; blk < prms.nBlks; blk += 1) {
    let blk_timeline = { ...trial_timeline };
    blk_timeline.sample = {
      type: 'fixed-repetitions',
      size: blk === 0 ? prms.nTrlsP / 8 : prms.nTrlsE / 8,
    };
    exp.push(blk_timeline); // trials within a block
    exp.push(block_feedback); // show previous block performance
  }

  // save data
  exp.push(save_data);
  exp.push(save_interaction_data);
  exp.push(save_code);

  // debrief
  exp.push(debrief_de);
  exp.push(alphaNum);
  exp.push(fullscreen_off);

  return exp;
}
const EXP = genExpSeq();

jsPsych.init({
  timeline: EXP,
  on_interaction_data_update: function (data) {
    update_user_interaction_data(data);
  },
});
