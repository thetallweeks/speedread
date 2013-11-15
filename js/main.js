var SPREEDY = {

  config : {

    // Sets default words per minute
    speed : 300

  },

  init : function(config) {

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

    // Set the word display to hidden by default
    SPREEDY.wordDisplayContainer.addClass('is-hidden');

    // Hide Speed Settings popup
    SPREEDY.popupMenus.addClass('is-hidden');

    // Set new Speed value
    SPREEDY.speedInput.on('keyup propertychange paste', function() {
      SPREEDY.setSpeed();
    });

    // Hide menus when clicking off of target
    $('html').click(function() {
      SPREEDY.popupMenus.addClass('is-hidden');
      SPREEDY.speedSettings.removeClass('is-active');
    });

    // Begin watching text input
    SPREEDY.watch(SPREEDY.textInput);

    var displayWordsInterval;

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

    // Bind click for Speed Settings
    SPREEDY.speedSettings.click(function() {
      event.stopPropagation();
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
  },

  watch : function(input) {

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

  setSpeed : function() {

    SPREEDY.config.speed = SPREEDY.speedInput.val();

    // Update Speed display
    SPREEDY.speed.html(SPREEDY.config.speed);

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