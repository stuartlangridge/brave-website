
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};



$("#formRequestBuildSubmit").on('click', function() {
  var formData = $('#formRequestBuild').serializeObject()
  if(formData.MERGE0 && formData.MERGE0 != '') {
    formData.call = 'getbrave'
    $("#formRequestBuildSubmit").text('Sending...')
    $.ajax({
       url: '/api/mailchimp',
       type: 'POST',
       dataType: 'json',
       data: formData,
       error: function(err) {console.log('err',err)
            $("#formRequestBuild").html('<h2>'+err.responseText+'</h2>')
       },
       success: function(data) {console.log(data)
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

