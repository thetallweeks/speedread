(function($) {

  // Set DOM elements as variables for reuse
  var spreedyTextInput = $('#spreedyTextInput');
  var spreedyStart = $('#spreedyStart');
  var spreedyStop = $('#spreedyStop');
  var spreedyTextInputContainer = $('#spreedyTextInputContainer');
  var spreedyWordDisplay = $('#spreedyWordDisplay');

  addClass(spreedyWordDisplay, 'is-hidden');

  // Set words in the global scope
  var words = [];

  // Watch textarea for changes
  spreedyTextInput.on('keyup propertychange paste', function() {
    splitIntoWords(spreedyTextInput);
    wordCounter(words);
  });

  spreedyStart.click(function() {
    removeClass(spreedyWordDisplay, 'is-hidden');
    addClass(spreedyTextInputContainer, 'is-invisible');
    displayWords(words);
  });

  spreedyStop.click(function() {
    addClass(spreedyWordDisplay, 'is-hidden');
    removeClass(spreedyTextInputContainer, 'is-invisible');
  });

  // Creates words array from input text
  function splitIntoWords(inputText) {
    words = spreedyTextInput.val().trim().split(' ');
  }

  // Counts items in the words array and updates word count
  function wordCounter(wordsArray) {
      // Start word count at 0
      var wordCount = wordsArray.length;

      // Update word count
      $('#spreedyWordCount').html(wordCount + ' words');
  }

  // Displays words at custom interval
  function displayWords(wordsArray, speed) {
    speed = speed || 300;
    var i = 0;

    var displayWordsInterval = setInterval(function() {

      // Replace html with subsequent word in the array
      document.getElementById('spreedyWordDisplay').innerHTML = wordsArray[i++];

      // Stop SetInterval when counter = array length
      if(i === wordsArray.length) {

        // SetIntervalID is the function name
        clearInterval(displayWordsInterval);
      }

    }, speed);
  }

  // Add Class to Element
  function addClass(elem, className) {
    elem.addClass(className);
  }

  // Remove Class from Element
  function removeClass(elem, className) {
    elem.removeClass(className);
  }


})(jQuery);