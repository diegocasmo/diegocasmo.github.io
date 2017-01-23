$(function() {
  $('a').click(function(event) {
    var dataGa = $(this).attr('data-ga');
    if (dataGa) {
      dataGa = dataGa.toLowerCase().replace(/ /g, '-');
      ga('send', 'event', 'page', 'click', dataGa);
    }
  });
});