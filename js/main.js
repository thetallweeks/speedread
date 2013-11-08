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
    clearInterval(displayWordsInterval);
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

  // Creates variable in the global scope to use clearInterval in other places
  var displayWordsInterval;

  // Displays words at custom interval
  function displayWords(wordsArray, speed) {
    speed = speed || 300;
    var i = 0;

    displayWordsInterval = setInterval(function() {

      // Replace html with subsequent word in the array
      // This can be done without jQuery using:
      // document.getElementById('spreedyWordDisplay').innerHTML = wordsArray[i++];
      spreedyWordDisplay.html(wordsArray[i++]);

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