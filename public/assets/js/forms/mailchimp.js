//TODO: add timeout handler and ui notification



// var ajaxPostInProgress = false

// var formPostTimedOut = function() {
//   if(ajaxPostInProgress)
//     $("#formRequestBuild").html('<h2>Something went wrong. Please refresh the page and try again.</h2>')
// }

$("#formRequestBuildSubmit").on('click', function() {
  var formData = $('#formRequestBuild').serializeObject()
  if(formData.MERGE0 && formData.MERGE0 != '') {
    if(!validateEmail(formData.MERGE0))
    {
      alert('Please check Email format.')
      return false
    }
    formData.call = 'getbrave'
    $("#formRequestBuildSubmit").text('Sending...')
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

$("#formNewsletterSubscriptionSubmit").on('click', function() {
  var formData = $('#formNewsletterSubscription').serializeObject()
  console.log(formData)
  if(formData.newsletteremail && formData.newsletteremail != '') {
    if(!validateEmail(formData.newsletteremail))
    {
      alert('Please check Email format.')
      return false
    }
    formData.call = 'newsletter'
    $("#formNewsletterSubscriptionSubmit").text('Sending...')
    $.ajax({
       url: '/api/mailchimp',
       type: 'POST',
       dataType: 'json',
       data: formData,
       error: function(err) {console.log('err',err)
          alert(err.responseText)
       },
       success: function(data) {
          console.log(data)
          if(data.euid)
          {
            $("#mailchimpNewsletterConfirmationModal").modal('show')
            $("#formNewsletterSubscriptionSubmit").text('Subscribed!')
            $("#formNewsletterSubscriptionSubmit").attr('disabled',true)
            $("#newsletteremail").attr('disabled',true)
          }
          else
          {
            console.log('failed',data)
            alert(data)
          }
       }
    });
  }
})

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
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


