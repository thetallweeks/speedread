var SPEEDREAD = {

  config : {

    // Sets default font-family
    font: "lora",

    // Sets default words per minute
    speed : 300,

    chunkSize : 1

  },

  init : function(config) {

    SPEEDREAD.createUIVariables();

    SPEEDREAD.bindUI();

    // Begin watching Speed Setting Input
    SPEEDREAD.watchSpeedSetting(SPEEDREAD.speedInput);
    SPEEDREAD.watchChunkSizeSetting(SPEEDREAD.chunkSizeInput);

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
    SPEEDREAD.speedDisplay = $('#speedReadSpeedDisplay');

    // ChunkSize
    SPEEDREAD.chunkSizeInput = $('#speedReadChunkSizeInput');
    SPEEDREAD.chunkSizeDisplay = $('#speedReadChunkSizeDisplay');

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
    input.on('input', function() {
      SPEEDREAD.createWords(input);
      SPEEDREAD.wordCounter(words);
    });

  },

  createWords : function(input) {

    // Create teh pattern using the chunkSize value
    var pattern = '[^ ]+( +[^ ]+){0,' + (SPEEDREAD.config.chunkSize - 1) + '}';

    // We need to create a RegEx object to be able to use the
    // pattern variable. 'g' prevents the RegEx from stopping at
    // the first match
    var re = new RegExp(pattern, 'g');

    // Creates words array from input text
    words = input.val().match(re);

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
    input.on('input', function() {
      SPEEDREAD.setSpeed();
    });
  },

  setSpeed : function() {

    // Make sure words per minute is greater than 0
    if(SPEEDREAD.speedInput.val() < 1) {
      SPEEDREAD.speedInput.val(1);
    }
    SPEEDREAD.config.speed = SPEEDREAD.speedInput.val();

    // Update Speed display
    SPEEDREAD.speedDisplay.html(SPEEDREAD.config.speed);

  },

  watchChunkSizeSetting : function(input) {

    // Set new Speed value
    input.on('input', function() {
      SPEEDREAD.setChunkSize();
    });
  },

  setChunkSize : function() {

    // Update Speed display
    if(SPEEDREAD.chunkSizeInput.val() < 1) {
      SPEEDREAD.chunkSizeInput.val(1);
    }
    SPEEDREAD.config.chunkSize = SPEEDREAD.chunkSizeInput.val();

    if(SPEEDREAD.config.chunkSize === 1) {
      SPEEDREAD.chunkSizeDisplay.html(SPEEDREAD.config.chunkSize + ' word');
    } else {
      SPEEDREAD.chunkSizeDisplay.html(SPEEDREAD.config.chunkSize + ' words');
    }

    SPEEDREAD.createWords(SPEEDREAD.textInput);

    // TODO: Add class on wordsDisplay to alter font size
    // based on chunkSize

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

  displayWords : function() {

    // Show Word Display
    SPEEDREAD.wordDisplayContainer.removeClass('is-hidden');

    // Hide Input
    SPEEDREAD.textInputContainer.addClass('is-hidden');

    console.log(SPEEDREAD.config.chunkSize);

    // Convert speed to ms
    var speedInMS = (1 / ((SPEEDREAD.config.speed / SPEEDREAD.config.chunkSize) / 60)) * 1000;

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

    // TODO: Error when chunkSize is larger than words.length
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
    SPEEDREAD.displayWords();
    isPlaying = true;
  },

  pause : function() {
    SPEEDREAD.playPauseButton.removeClass('icon-pause').addClass('icon-play');
    clearTimeout(interval);
    isPlaying = false;
  }

};

$(document).ready(SPEEDREAD.init);