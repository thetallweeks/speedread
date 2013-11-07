(function($) {

  // Set #spreedyTextInput as a variable for reuse
  var spreedyTextInput = $('#spreedyTextInput');

  var spreedyButtonStart = $('#spreedyButtonStart');

  // Set words in the global scope
  var words = [];

  // Watch textarea for changes
  spreedyTextInput.on('keyup propertychange paste', function() {
    splitIntoWords(spreedyTextInput);
    wordCounter(words);
  });

  spreedyButtonStart.click(function() {
    displayWords(words);
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


})(jQuery);