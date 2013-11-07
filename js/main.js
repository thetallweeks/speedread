(function($) {

  function wordCount(){
    var spreedyTextInputValue = $('#spreedyTextInput').val();
    var words = spreedyTextInputValue.split(' ').length;
    if(spreedyTextInputValue.length === 0){
      words = 0;
    }
    $('#spreedyWordCount').html(words + ' words');
  }

  $('#spreedyTextInput').on('keyup propertychange paste', function(){
      wordCount();
  });

})(jQuery);