var SPEEDREAD = {

  config : {

    // Sets default font-family
    font: "lora",

    // Sets default words per minute
    speed : 300

  },

  init : function(config) {

    SPEEDREAD.createUIVariables();

    SPEEDREAD.bindUI();

    // Begin watching Speed Setting Input
    SPEEDREAD.watchSpeedSetting(SPEEDREAD.speedInput);

    // Begin watching text input
    SPEEDREAD.watchTextArea(SPEEDREAD.textInput);

    words = [];

    // Create a global variable for the setTimeout interval
    var interval;

    placeholder = 0;

    isPlaying = false;

    // Set the default font
    SPEEDREAD.chooseFont();

  },

  createUIVariables : function() {
    // Set DOM elements as variables for reuse
    SPEEDREAD.textInput = $('#speedReadTextInput');
    SPEEDREAD.textInputContainer = $('#speedReadTextInputContainer');
    SPEEDREAD.wordDisplayContainer = $('#speedReadWordDisplayContainer');
    SPEEDREAD.wordDisplay = $('#speedReadWordDisplay');
    SPEEDREAD.wordCount = $('#speedReadWordCount');
    SPEEDREAD.playPauseButton = $('#speedReadPlayPause');
    SPEEDREAD.stopButton = $('#speedReadStop');
    SPEEDREAD.popupButtons = $('.app-controls-menu-container');
    SPEEDREAD.popupMenus = $('.app-controls-menu');

    // Speed Settings
    SPEEDREAD.speedSettings = $('#speedReadSpeedSettings');
    SPEEDREAD.speedSettingsMenu = $('#speedReadSpeedSettingsMenu');
    SPEEDREAD.speedInput = $('#speedReadSpeedInput');
    SPEEDREAD.speed = $('#speedReadSpeed');

    // Font Settings
    SPEEDREAD.fontSettings = $('#speedReadFontSettings');
    SPEEDREAD.fontSettingsMenu = $('#speedReadFontSettingsMenu');

  },

  bindUI : function() {

    // Hide menus when clicking off of target
    $('html').click(function() {
      SPEEDREAD.popupMenus.addClass('is-hidden');
      SPEEDREAD.speedSettings.removeClass('is-active');
      SPEEDREAD.fontSettings.removeClass('is-active');
    });

    // Set the word display to hidden by default
    SPEEDREAD.wordDisplayContainer.addClass('is-hidden');

    // Hide Speed Settings popup
    SPEEDREAD.popupMenus.addClass('is-hidden');

    // Bind click function for play/pause
    SPEEDREAD.playPauseButton.click(function() {
      if(words.length > 0) {
        if(!isPlaying) {
          SPEEDREAD.play();
        } else {
          SPEEDREAD.pause();
        }
      }
    });

    // Bind click function for Stop
    SPEEDREAD.stopButton.click(function() {
      if(words.length > 0) {
        SPEEDREAD.stopDisplayWords();
      }
    });

    // Bind click for Speed Settings
    SPEEDREAD.popupButtons.click(function() {
      SPEEDREAD.popup();
    });

    SPEEDREAD.popupMenus.click(function() {
      event.stopPropagation();
    });

  },

  watchTextArea : function(input) {

    // Watch textarea for changes
    input.on('keyup propertychange paste', function() {
      SPEEDREAD.createWords(input);
      SPEEDREAD.wordCounter(words);
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
    SPEEDREAD.wordCount.html(wordCount);

  },

  popup : function() {

    event.stopPropagation();

    var target = $(event.target);

    if(target.hasClass('is-active')) {
      target.removeClass('is-active');
      target.find('.app-controls-menu').addClass('is-hidden');
    } else {
      SPEEDREAD.popupMenus.addClass('is-hidden');
      SPEEDREAD.popupButtons.removeClass('is-active');
      target.addClass('is-active');
      target.find('.app-controls-menu').removeClass('is-hidden');
    }
  },

  clearPopup : function() {
    SPEEDREAD.popupButtons.removeClass('is-active');
    SPEEDREAD.popupMenus.addClass('is-hidden');
  },

  watchSpeedSetting : function(input) {

    // Set new Speed value
    input.on('keyup propertychange paste', function() {
      SPEEDREAD.setSpeed();
    });
  },

  setSpeed : function() {

    SPEEDREAD.config.speed = SPEEDREAD.speedInput.val();

    // Update Speed display
    SPEEDREAD.speed.html(SPEEDREAD.config.speed);

  },

  chooseFont : function() {
    SPEEDREAD.setFont();
    SPEEDREAD.fontSettingsMenu.find('.font-option').click(function() {
      SPEEDREAD.fontSettingsMenu.find('.font-option').removeClass('is-active');

      // Don't create a jQuery object here
      SPEEDREAD.config.font = event.target.id;

      // Use the jQuery object form of event.target to addClass
      $(event.target).addClass('is-active');
      SPEEDREAD.removeFontClass();
      SPEEDREAD.setFont();
    });
  },

  removeFontClass : function() {
    SPEEDREAD.textInput.removeClass('lora montserrat sanchez poly pt-serif roboto georgia');
    SPEEDREAD.wordDisplay.removeClass('lora montserrat sanchez poly pt-serif roboto georgia');
  },

  setFont : function() {
    SPEEDREAD.textInput.addClass(SPEEDREAD.config.font);
    SPEEDREAD.wordDisplay.addClass(SPEEDREAD.config.font);
  },

  displayWords : function(speed) {

    // Show Word Display
    SPEEDREAD.wordDisplayContainer.removeClass('is-hidden');

    // Hide Input
    SPEEDREAD.textInputContainer.addClass('is-hidden');

    // Convert speed to ms
    var speedInMS = (1 / (speed / 60)) * 1000;

    var i = placeholder,
        j = words.length;

    (function timer() {
      SPEEDREAD.wordDisplay.html(words[i]);
      i++;
      if (i === j) {
        SPEEDREAD.resetDisplayWords();
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
    SPEEDREAD.playPauseButton.removeClass('icon-pause').addClass('icon-play');
  },

  stopDisplayWords : function() {

    // Prevent display speed from increasing
    clearTimeout(interval);
    placeholder = 0;
    isPlaying = false;
    SPEEDREAD.wordDisplayContainer.addClass('is-hidden');
    SPEEDREAD.wordDisplay.empty();
    SPEEDREAD.textInputContainer.removeClass('is-hidden');
    SPEEDREAD.playPauseButton.removeClass('icon-pause').addClass('icon-play');
  },

  play : function() {
    SPEEDREAD.playPauseButton.removeClass('icon-play').addClass('icon-pause');
    SPEEDREAD.displayWords(SPEEDREAD.config.speed);
    isPlaying = true;
  },

  pause : function() {
    SPEEDREAD.playPauseButton.removeClass('icon-pause').addClass('icon-play');
    clearTimeout(interval);
    isPlaying = false;
  }

};

$(document).ready(SPEEDREAD.init);