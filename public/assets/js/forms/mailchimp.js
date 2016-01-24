var ajaxPostInProgress = false

var formPostTimedOut = function() {
  if(ajaxPostInProgress)
    $("#formRequestBuild").html('<h2>Something went wrong. Please refresh the page and try again.</h2>')
}

$.fn.serializeObject = function()
{
    var o = {}
    var a = this.serializeArray()
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]]
            }
            o[this.name].push(this.value || '')
        } else {
            o[this.name] = this.value || ''
        }
    })
    return o
}



$("#formRequestBuildSubmit").on('click', function() {
  var formData = $('#formRequestBuild').serializeObject()
  if(formData.MERGE0 && formData.MERGE0 != '') {
    formData.call = 'getbrave'
    // ajaxPostInProgress = true
    $("#formRequestBuildSubmit").text('Sending...')
    // window.setTimeout(formPostTimedOut, 300);
    $.ajax({
       url: '/api/mailchimp',
       type: 'POST',
       dataType: 'json',
       data: formData,
       error: function(err) {console.log('err',err)
          // ajaxPostInProgress = false
          $("#formRequestBuild").html('<h2>'+err.responseText+'</h2>')
       },
       success: function(data) {
          // ajaxPostInProgress = false
          if(data.euid)
          {
            $("#formRequestBuild").html($('#formRequestBuildThankYou').html())
          }
          else
          {
            console.log('failed',data)
            $("#formRequestBuild").html(data)
          }
       }
    });
  }
})


