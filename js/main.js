var SPREEDY = {

  config : {

    // Sets default font-family
    font: "lora",

    // Sets default words per minute
    speed : 300

  },

  init : function(config) {

    SPREEDY.createUIVariables();

    SPREEDY.bindUI();

    // Begin watching Speed Setting Input
    SPREEDY.watchSpeedSetting(SPREEDY.speedInput);

    // Begin watching text input
    SPREEDY.watchTextArea(SPREEDY.textInput);

    words = [];

    // Create a global variable for the setTimeout interval
    var interval;

    placeholder = 0;

    isPlaying = false;

    // Set the default font
    SPREEDY.chooseFont();

  },

  createUIVariables : function() {
    // Set DOM elements as variables for reuse
    SPREEDY.textInput = $('#spreedyTextInput');
    SPREEDY.textInputContainer = $('#spreedyTextInputContainer');
    SPREEDY.wordDisplayContainer = $('#spreedyWordDisplayContainer');
    SPREEDY.wordDisplay = $('#spreedyWordDisplay');
    SPREEDY.wordCount = $('#spreedyWordCount');
    SPREEDY.playPauseButton = $('#spreedyPlayPause');
    SPREEDY.stopButton = $('#spreedyStop');
    SPREEDY.popupButtons = $('.app-controls-menu-container');
    SPREEDY.popupMenus = $('.app-controls-menu');

    // Speed Settings
    SPREEDY.speedSettings = $('#spreedySpeedSettings');
    SPREEDY.speedSettingsMenu = $('#spreedySpeedSettingsMenu');
    SPREEDY.speedInput = $('#spreedySpeedInput');
    SPREEDY.speed = $('#spreedySpeed');

    // Font Settings
    SPREEDY.fontSettings = $('#spreedyFontSettings');
    SPREEDY.fontSettingsMenu = $('#spreedyFontSettingsMenu');

  },

  bindUI : function() {

    // Hide menus when clicking off of target
    $('html').click(function() {
      SPREEDY.popupMenus.addClass('is-hidden');
      SPREEDY.speedSettings.removeClass('is-active');
      SPREEDY.fontSettings.removeClass('is-active');
    });

    // Set the word display to hidden by default
    SPREEDY.wordDisplayContainer.addClass('is-hidden');

    // Hide Speed Settings popup
    SPREEDY.popupMenus.addClass('is-hidden');

    // Bind click function for play/pause
    SPREEDY.playPauseButton.click(function() {
      if(words.length > 0) {
        if(!isPlaying) {
          SPREEDY.play();
        } else {
          SPREEDY.pause();
        }
      }
    });

    // Bind click function for Stop
    SPREEDY.stopButton.click(function() {
      if(words.length > 0) {
        SPREEDY.stopDisplayWords();
      }
    });

    // Bind click for Speed Settings
    SPREEDY.popupButtons.click(function() {
      SPREEDY.popup();
    });

    SPREEDY.popupMenus.click(function() {
      event.stopPropagation();
    });

  },

  watchTextArea : function(input) {

    // Watch textarea for changes
    input.on('keyup propertychange paste', function() {
      SPREEDY.createWords(input);
      SPREEDY.wordCounter(words);
    });

  },

  createWords : function(input) {

    // Creates words array from input text
    words = input.val().trim().split(' ');

  },

  wordCounter : function(array) {

    // Create variable to hold word count
    var wordCount = array.length;

    // Update word count with new value
    SPREEDY.wordCount.html(wordCount);

  },

  popup : function() {

    event.stopPropagation();

    var target = $(event.target);

    if(target.hasClass('is-active')) {
      target.removeClass('is-active');
      target.find('.app-controls-menu').addClass('is-hidden');
    } else {
      SPREEDY.popupMenus.addClass('is-hidden');
      SPREEDY.popupButtons.removeClass('is-active');
      target.addClass('is-active');
      target.find('.app-controls-menu').removeClass('is-hidden');
    }
  },

  clearPopup : function() {
    SPREEDY.popupButtons.removeClass('is-active');
    SPREEDY.popupMenus.addClass('is-hidden');
  },

  watchSpeedSetting : function(input) {

    // Set new Speed value
    input.on('keyup propertychange paste', function() {
      SPREEDY.setSpeed();
    });
  },

  setSpeed : function() {

    SPREEDY.config.speed = SPREEDY.speedInput.val();

    // Update Speed display
    SPREEDY.speed.html(SPREEDY.config.speed);

  },

  chooseFont : function() {
    SPREEDY.setFont();
    SPREEDY.fontSettingsMenu.find('.font-option').click(function() {
      SPREEDY.fontSettingsMenu.find('.font-option').removeClass('is-active');

      // Don't create a jQuery object here
      SPREEDY.config.font = event.target.id;

      // Use the jQuery object form of event.target to addClass
      $(event.target).addClass('is-active');
      SPREEDY.removeFontClass();
      SPREEDY.setFont();
    });
  },

  removeFontClass : function() {
    SPREEDY.wordDisplay.removeClass('lora montserrat sanchez poly pt-serif roboto georgia');
  },

  setFont : function() {
    SPREEDY.wordDisplay.addClass(SPREEDY.config.font);
  },

  displayWords : function(speed) {

    // Show Word Display
    SPREEDY.wordDisplayContainer.removeClass('is-hidden');

    // Hide Input
    SPREEDY.textInputContainer.addClass('is-hidden');

    // Convert speed to ms
    var speedInMS = (1 / (speed / 60)) * 1000;

    var i = placeholder,
        j = words.length;

    (function timer() {
      SPREEDY.wordDisplay.html(words[i]);
      i++;
      if (i === j - 1) {
        SPREEDY.resetDisplayWords();
      } else if (i < j) {
        placeholder++;
        interval = setTimeout(timer,speedInMS);
      }
    })();

  },

  resetDisplayWords : function() {
    isPlaying = false;
    clearTimeout(interval);
    placeholder = 0;
    SPREEDY.playPauseButton.removeClass('icon-pause').addClass('icon-play');
  },

  stopDisplayWords : function() {

    // Prevent display speed from increasing
    clearTimeout(interval);
    placeholder = 0;
    isPlaying = false;
    SPREEDY.wordDisplayContainer.addClass('is-hidden');
    SPREEDY.wordDisplay.empty();
    SPREEDY.textInputContainer.removeClass('is-hidden');
    SPREEDY.playPauseButton.removeClass('icon-pause').addClass('icon-play');
  },

  play : function() {
    SPREEDY.playPauseButton.removeClass('icon-play').addClass('icon-pause');
    SPREEDY.displayWords(SPREEDY.config.speed);
    isPlaying = true;
  },

  pause : function() {
    SPREEDY.playPauseButton.removeClass('icon-pause').addClass('icon-play');
    clearTimeout(interval);
    isPlaying = false;
  }

};

$(document).ready(SPREEDY.init);