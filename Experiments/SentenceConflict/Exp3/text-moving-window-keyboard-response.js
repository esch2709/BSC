jsPsych.plugins['text-moving-window-keyboard-response'] = (function () {
  let plugin = {};

  plugin.info = {
    name: 'text-moving-window-keyboard-response',
    description: '',
    parameters: {
      sentence: {
        type: jsPsych.plugins.parameterType.STRING,
        array: false,
        pretty_name: 'Sentence',
        default: {},
        description: 'Sentence to be presented word-by-word',
      },
      max_width: {
        type: jsPsych.plugins.parameterType.INT,
        array: false,
        pretty_name: 'SentenceWidth',
        default: 1000,
        description: 'Maximum width of the sentence before line-break',
      },
      font: {
        type: jsPsych.plugins.parameterType.STRING,
        array: false,
        pretty_name: 'Font',
        default: '40px monospace',
        description: 'Font',
      },
      text_align: {
        type: jsPsych.plugins.parameterType.STRING,
        array: false,
        pretty_name: 'align',
        default: 'left',
        description: 'Text Alignment',
      },
      line_height: {
        type: jsPsych.plugins.parameterType.INT,
        array: false,
        pretty_name: 'LineHeight',
        default: 30,
        description: 'Line Height',
      },
      canvas_colour: {
        type: jsPsych.plugins.parameterType.STRING,
        array: false,
        pretty_name: 'Colour',
        default: 'white',
        description: 'Canvas colour.',
      },
      canvas_size: {
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        pretty_name: 'Size',
        default: [1280, 960],
        description: 'Canvas size.',
      },
      canvas_border: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Border',
        default: '0px solid black',
        description: 'Border style',
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.',
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'ResponseEndsTrial',
        default: true,
        description: 'If true, then trial will end when user responds.',
      },
    },
  };

  function textMask(txt) {
    return txt.replace(/[a-z.!????'-]/gi, '_');
  }

  plugin.trial = function (display_element, trial) {
    display_element.innerHTML = "<canvas id='canvas'></canvas>";
    let canvas = document.getElementById('canvas');

    // setup canvas
    canvas.style = 'position: absolute; top: 0px; left: auto; right: auto; bottom: 0px; margin: auto;';
    canvas.width = trial.canvas_size[0];
    canvas.height = trial.canvas_size[1];
    canvas.style.border = trial.canvas_border;
    canvas.style.left = -trial.canvas_size[0] / 2 + 'px';

    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.fillStyle = trial.canvas_colour;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2); // make center (0, 0)

    // basic font style
    ctx.font = trial.font;
    ctx.textAlign = trial.text_align;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';

    // text properties
    const numLines = Math.ceil(ctx.measureText(trial.sentence).width / trial.max_width);
    const words = trial.sentence.split(' ');
    const xpos = trial.text_align === 'left' ? -(trial.max_width / 2) : 0;
    let ypos = -(trial.line_height * numLines) / 2 + trial.line_height / 2;

    // keep adding word until it is too long
    let line = '';
    for (let n = 0; n < words.length; n++) {
      let word;
      if (trial.mask_type === 1) {
        word = n === trial.word_number ? words[n] : textMask(words[n]);
      } else if (trial.mask_type === 2) {
        word = n <= trial.word_number ? words[n] : textMask(words[n]);
      }
      let tmp = line + word + ' ';
      if (ctx.measureText(tmp).width > trial.max_width && n > 0) {
        ctx.fillText(line, xpos, ypos);
        ctx.fillText(textMask(line), xpos, ypos);
        line = word + ' ';
        ypos += trial.line_height;
      } else {
        line = tmp;
      }
    }
    ctx.fillText(line, xpos, ypos);
    ctx.fillText(textMask(line), xpos, ypos);

    // store response
    let response = {
      rt: null,
      key: null,
    };

    // function to end trial when it is time
    const end_trial = function () {
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      const trial_data = {
        rt: response.rt,
        key_press: response.key,
        word: words[trial.word_number],
      };

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    const after_response = function (info) {
      if (response.key == null) {
        response = info;
      }
      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices !== jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false,
      });
    }
  };

  return plugin;
})();
