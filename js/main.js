(function($) {

  // Set #spreedyTextInput as a variable for reuse
  var spreedyTextInput = $('#spreedyTextInput');

  function wordCount(inputText) {
    inputText.on('keyup propertychange paste', function() {
      var words = spreedyTextInput.val().split(' ').length;

      // Start word count at 0
      if(spreedyTextInput.val().length === 0){
        words = 0;
      }

      // Update word count
      $('#spreedyWordCount').html(words + ' words');
    });
  }

  wordCount(spreedyTextInput);

})(jQuery);