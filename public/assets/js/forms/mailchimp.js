// var ajaxReq = function (uri, params, callback) {
//   if ($.browser) 
//   {
//     if ($.browser.msie && window.XDomainRequest) 
//     {
//       // Use Microsoft XDR
//       var qs = "?" + $.param(params);
//       var xdr = new XDomainRequest();
//       console.log(uri + qs);
//       xdr.open("get", uri + qs);
//       xdr.onload = function() {
//           // XDomainRequest doesn't provide responseXml, so if you need it:
//           var dom = new ActiveXObject("Microsoft.XMLDOM");
//           dom.async = false;
//           var res = JSON.parse(xdr.responseText);
//           callback(res);
//       };
//       xdr.send();
//     } 
//     else 
//     {
//       $.ajax({ 
//           type: "POST",
//           // contentType: "text/html; charset=utf-8",
//           data: params,  
//           crossDomain: true,
//           dataType: "json",
//           url: uri,
//           success: function (res) {
//             callback(res);
//           },
//           error: function (XMLHttpRequest, textStatus, errorThrown) {
//             var err = JSON.stringify(errorThrown)
//               console.log(err)
//               callback(err)
//           }
//       });
//     }
//   } 
//   else 
//   {
//     $.ajax({ 
//         type: "POST",
//         // contentType: "text/html; charset=utf-8",
//         data: params,  
//         crossDomain: true,
//         dataType: "json",
//         url: uri,
//         success: function (res) {
//           callback(res);
//         },
//         error: function (XMLHttpRequest, textStatus, errorThrown) {
//             console.log(JSON.stringify(errorThrown));
//               }
//     });
//   }
//  };

// var formToJSON = function(f) {

//   // create JSON object from form contents
//   // v0.1.2 'better checkbox'
//   var j = {};
//   $.each(f.find('textarea'), function() {
//     j[$(this).attr('name')] = $(this).val();
//   })
//   $.each(f.find('input'), function() {
//     j[$(this).attr('name')] = $(this).val();
//   })
//   $.each(f.find('select'), function() {
//     j[$(this).attr('name')] = $(this).val();
//   })
//   $.each(f.find('input[type="checkbox"]'), function() {
//     if($(this).val() != "on")
//     {
//       if($(this).is(':checked'))
//       {
//         j[$(this).attr('name')] = $(this).val();
//       }
//       else
//       {
//         j[$(this).attr('name')] = false;
//       }
//     }
//     else
//     {
//       j[$(this).attr('name')] = $(this).is(':checked');
//     }
//   })
//   return j;
//  };

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
       // contentType: "application/json; charset=utf-8",
       data: formData,
       error: function(err) {console.log('err',err)
          // $('#formRequestBuildSubmit').text(err.description);
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
            // $("#formRequestBuildSubmit").text(data)
            $("#formRequestBuild").html(data)
        }
       }
    });


    // ajaxReq("/api/mailchimp",
    //   f,
    //   function(r) {
    //     if(r.euid)
    //     {
    //         // console.log('success',r)
    //         $("#formRequestBuild").html($('#formRequestBuildThankYou').html())
    //     }
    //     else
    //     {
    //         console.log('failed',r)
    //         $("#formRequestBuildSubmit").text(r)
    //     }
    //   }
    // );
  }
})

