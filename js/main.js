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

    // Create interval variable in the global scope
    // Needed for clearInterval to work
    var displayWordsInterval;

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
      // TODO: Check for empty textarea
      SPREEDY.playPauseButton.removeClass('icon-play').addClass('icon-pause');
      SPREEDY.displayWords(SPREEDY.config.speed);

      // TODO: Set up state for play/pause
    });

    // Bind click function for Stop
    SPREEDY.stopButton.click(function() {
      SPREEDY.stopDisplayWords();
    });

    // TODO: Abstract show popup to work for both
    // Speed Settings and Font Settings

    // Bind click for Speed Settings
    SPREEDY.speedSettings.click(function() {
      event.stopPropagation();

      // Toggle off Font Settings popup
      SPREEDY.fontSettings.removeClass('is-active');
      SPREEDY.fontSettingsMenu.addClass('is-hidden');
      if(SPREEDY.speedSettingsMenu.hasClass('is-hidden')) {
        $(this).addClass('is-active');
        SPREEDY.speedSettingsMenu.removeClass('is-hidden');
      } else {
        $(this).removeClass('is-active');
        SPREEDY.speedSettingsMenu.addClass('is-hidden');
      }
    });

    SPREEDY.speedSettingsMenu.click(function() {
      event.stopPropagation();
    });

    // Bind click for Font Settings
    SPREEDY.fontSettings.click(function() {
      event.stopPropagation();
      SPREEDY.speedSettings.removeClass('is-active');
      SPREEDY.speedSettingsMenu.addClass('is-hidden');
      if(SPREEDY.fontSettingsMenu.hasClass('is-hidden')) {
        $(this).addClass('is-active');
        SPREEDY.fontSettingsMenu.removeClass('is-hidden');
      } else {
        $(this).removeClass('is-active');
        SPREEDY.fontSettingsMenu.addClass('is-hidden');
        SPREEDY.fontSettingsMenu.addClass('is-hidden');
      }
    });

    SPREEDY.fontSettingsMenu.click(function() {
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

  removeFontClass : function () {

    // TODO: Refactor this to work more efficiently
    // Can this be set up to work without needing to know
    // the class that shoud be removed?
    if(SPREEDY.wordDisplay.hasClass('lora')) {
      SPREEDY.wordDisplay.removeClass('lora');
    } else if(SPREEDY.wordDisplay.hasClass('montserrat')) {
      SPREEDY.wordDisplay.removeClass('montserrat');
    } else if(SPREEDY.wordDisplay.hasClass('sanchez')) {
      SPREEDY.wordDisplay.removeClass('sanchez');
    } else if(SPREEDY.wordDisplay.hasClass('poly')) {
      SPREEDY.wordDisplay.removeClass('poly');
    } else if(SPREEDY.wordDisplay.hasClass('pt-serif')) {
      SPREEDY.wordDisplay.removeClass('pt-serif');
    } else if(SPREEDY.wordDisplay.hasClass('roboto')) {
      SPREEDY.wordDisplay.removeClass('roboto');
    } else if(SPREEDY.wordDisplay.hasClass('georgia')) {
      SPREEDY.wordDisplay.removeClass('georgia');
    }
  },

  setFont : function() {
    SPREEDY.wordDisplay.addClass(SPREEDY.config.font);
  },

  displayWords : function(speed) {

    // Show Word Display
    SPREEDY.wordDisplayContainer.removeClass('is-hidden');

    // Hide Input
    SPREEDY.textInputContainer.addClass('is-hidden');

    speed = (1 / (speed / 60)) * 1000;

    var i = 0;

    // TODOS: Speed causes wait before first word and
    // pace seems inconsistent
    displayWordsInterval = setInterval(function() {

      SPREEDY.wordDisplay.html(words[i++]);

      // Stop SetInterval when counter = array length
      if(i === words.length) {

        // SetIntervalID is the function name
        clearInterval(displayWordsInterval);

        SPREEDY.playPauseButton.removeClass('icon-pause').addClass('icon-play');
      }

    }, speed);

  },

  stopDisplayWords : function() {

    // Prevent display speed from increasing
    clearInterval(displayWordsInterval);

    SPREEDY.wordDisplayContainer.addClass('is-hidden');
    SPREEDY.wordDisplay.empty();
    SPREEDY.textInputContainer.removeClass('is-hidden');
    SPREEDY.playPauseButton.removeClass('icon-pause').addClass('icon-play');

  }

};

$(document).ready(SPREEDY.init);