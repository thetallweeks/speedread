var SPREEDY = {

  config : {

    // Sets default words per minute (in miliseconds)
    speed : 200

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

    // Set the word display to hidden by default
    SPREEDY.wordDisplayContainer.addClass('is-hidden');

    // Begin watching text input
    SPREEDY.watch(SPREEDY.textInput);

    var displayWordsInterval;

    // Bind click functions
    SPREEDY.playPauseButton.click(function() {
        SPREEDY.playPauseButton.removeClass('icon-play').addClass('icon-pause');
        SPREEDY.displayWords();

        // TODO: Set up state for play/pause
    });

    SPREEDY.stopButton.click(function() {
      SPREEDY.stopDisplayWords();
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
    SPREEDY.wordCount.html(wordCount + ' words');

  },

  displayWords : function() {

    // Show Word Display
    SPREEDY.wordDisplayContainer.removeClass('is-hidden');

    // Hide Input
    SPREEDY.textInputContainer.addClass('is-hidden');

    var i = 0;

    displayWordsInterval = setInterval(function() {

      // Replace html with subsequent word in the array
      // This can be done without jQuery using:
      // document.getElementById('spreedyWordDisplay').innerHTML = wordsArray[i++];
      SPREEDY.wordDisplay.html(words[i++]);

      // Stop SetInterval when counter = array length
      if(i === words.length) {

        // SetIntervalID is the function name
        clearInterval(displayWordsInterval);
      }

    }, SPREEDY.config.speed);

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