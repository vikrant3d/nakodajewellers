var code = "NK/";
var contextPath = "https://53uqb9vn2m.execute-api.ap-southeast-1.amazonaws.com/dev/"+code;
var NumberRegex = /^[0-9]*$/;
function getFormData(form){
    var unindexed_array = $(form).serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
		var name = n['name'];
		var value = n['value'];
		if(name == 'custDOJ'){
			var value1 = value.split("/");			
			value = value1[2]+"-"+value1[1]+"-"+value1[0];
		}
        indexed_array[name] = value;
    });

    return indexed_array;
}

function doLogin(obj){
	var map={};
	map["venderPass"]=$("#password").val();
	$(obj).attr('value','Please wait...').prop('disabled',true);		
	$.ajax({
		  type: 'POST',
		  data: JSON.stringify(map),		 
		  url: contextPath +"checkLogin",
		  success: function (response1) { 	
					if(response1.length == 8){
						sessionStorage.setItem(code + "_token", response1);
						location.href="CustRegistration.html"
					}else{
						$(obj).attr('value','Login').prop('disabled',false);
						$("#passwordError").show();
					}					
				}
			});
}

function submitCustDetails(obj){
	if(! checkValidation()){		
		return false;
	}
	
	$('#lodaingModal').modal('show');
	
	if($("#itemPic-image").attr('src') != undefined && $("#itemPic-image").attr('src') != ""){
		$("#itemPic").val($("#itemPic-image").attr('src').split(',')[1]);
	}
	if($("#custPic-image").attr('src') != undefined && $("#custPic-image").attr('src') != ""){
		$("#custPic").val($("#custPic-image").attr('src').split(',')[1]);
	}
	if($("#docPic-image").attr('src') != undefined && $("#docPic-image").attr('src') != ""){
		$("#docPic").val($("#docPic-image").attr('src').split(',')[1]);
	}
	 $.ajax({
	  type: 'POST',
	  url: contextPath +"saveCustomerData",
	 data: JSON.stringify(getFormData("#customerDetails")),
	 
	  success: function (response) { 
			$('#lodaingModal').modal('hide');
			alert(response);
			location.reload();
			},
	  error : function (response) { 		
			$('#lodaingModal').modal('hide');
			alert(response.responseText);	
			}
	});
}

function checkValidation(){
	var numbers = /^[0-9]+$/;
	if($("#custName").val() == "" ){
		alert('Please Enter Customer Name');
		return false;
	}else if($("#phoneNo").val() == "" || $("#phoneNo").val().length != 10 || ! NumberRegex.test($("#phoneNo").val())){
		alert('Please Enter valid Customer mobile number');
		return false;
	}else if($("#itemDesc").val() == "" ){
		alert('Please Enter valid Item Description');
		return false;
	}
	
	if(! $("#actualItemAmt").val().match(numbers))
	{
		alert('Please Enter valid Number to Actual Item Amount field');
		return false;
	}
	if(! $("#amtLease").val().match(numbers))
	{
		alert('Please Enter valid Number to AmountForLease field');
		return false;
	}
	if(! $("#rateOfIntrest").val().match(numbers))
	{
		alert('Please Enter valid Number to RateOfIntrest % field');
		return false;
	}
	
	return true;
	
}

function submitCustAmount(obj){
	if($("#currentStatus").val() == 'C'){
		var r = confirm("Are you sure you to Close this case, Once you closed this case you will not able to reopen it again");
		if (r == false) {
			return false;
		}
	}
	if($("#amountPay").val() =="" || $("#dateOfTransaction").val() == ""){
			alert("Please enter required details");
	}else{
		var r = confirm("Are you sure you want to make payment?");
		if (r == true) {
			$('#lodaingModal').modal('show');
			var map={};
			map["custid"]=$("#customerid").val();
			map["amountPay"]=$("#amountPay").val();
			map["dateOfTransaction"]=$("#dateOfTransaction").val();
			map["additionalNote"]=$("#additionalNote").val();
			map["currentStatus"]=$("#currentStatus").val();
					
			  $.ajax({
			  type: 'POST',
			  url: contextPath +"payMoney",
			 data: JSON.stringify(map),		 
			  success: function (response) { 
					$('#lodaingModal').modal('hide');
					alert(response);
					location.reload();
					},
			  error : function (response) { 						
					$('#lodaingModal').modal('hide');
					alert(response);
					}

			});
		}
	}
}

function generateCustRow(response1){
	var count = 1;
	var jsonData = {};
	$.each(response1, function(key,response) {	
			var active ="In-Active";
			if($(response).attr("smsEmailStatus") == 'A'){
				active = "Active";
			}
			var newRow = "<tr><td >"+count+"</td><td>"+$(response).attr("custName")+"</td><td>"+$(response).attr("phoneNo")+"</td>"+
				"<td>"+$(response).attr("itemDescription")+"</td><td>"+$(response).attr("grossWt")+"</td><td>"+$(response).attr("netWt")+"</td><td>"+$(response).attr("actualItemAmount")+"</td>"+
				"<td>"+$(response).attr("amountForLease")+"</td><td>"+$(response).attr("rateOfIntrest")+"</td>"+
				
				'<td class="center"><input type="button" attr-id="'+$(response).attr("id")+'" class="btn btn-primary btn-xs" value="View" onclick="return fetchCustomerDetails(this)"></td>'+
				'</tr>';
			$("#custDetailsTable tbody").append(newRow);
			count++;		
			jsonData["91"+$(response).attr("custMobileNo")] = $(response).attr("custFullName");			
		 });
		 localStorage.setItem("custDetails",JSON.stringify(jsonData));
		 $('#custDetailsTable').DataTable().destroy();
		$('#custDetailsTable').DataTable({
	        responsive: true,
			"order": [],			
			iDisplayLength:50,
			lengthMenu:[[10,50,100,200,-1],[10,50,100,200,"ALL"]]			
        	});
 		$("#custDetailsTable").parent().addClass('table-responsive');
		
}

function fetchCustomerDetails(obj){
	$('#lodaingModal').modal('show');
	 $.ajax({
  type: 'POST',
   data: '{"custid":"'+$(obj).attr('attr-id')+'"}',
  url: contextPath +"editCustomerData",
  success: function (response) { 
		
		var response1 = $(response).get(0);
		$("#custid").val($(response1).attr('id'));
		$("#custName").val($(response1).attr('custName'));
		$("#phoneNo").val($(response1).attr('phoneNo'));
		$("#address").val($(response1).attr('address'));
		$("#itemDesc").val($(response1).attr('itemDescription'));
		$("#grossWt").val($(response1).attr('grossWt'));
		$("#netWt").val($(response1).attr('netWt'));
		$("#actualItemAmt").val($(response1).attr('actualItemAmount'));
		$("#amtLease").val($(response1).attr('amountForLease'));
		$("#rateOfIntrest").val($(response1).attr('rateOfIntrest'));
		$("#dateOfRequest").val($(response1).attr('dateOfRequest'));
		var response2 = $(response).get(1);
		$('#custPic-image').attr('src','data:image/png;base64,'+$(response2).attr('custPic'));   
		$('#itemPic-image').attr('src','data:image/png;base64,'+$(response2).attr('itemPic'));  
		$('#docPic-image').attr('src','data:image/png;base64,'+$(response2).attr('docPic'));  		
		$('#lodaingModal').modal('hide');
		$("html, body").animate({ scrollTop: 0 }, "slow");
	}
});	
	return false;
}

function newCustDetails(){
	location.reload();
}

function getAllCustDetails(){
	$('#lodaingModal').modal('show');
	var map={};
	map["token"]=sessionStorage.getItem(code + "_token");
			
  $.ajax({
  type: 'POST',
  data: JSON.stringify(map),
  url: contextPath +"listCustomer",
  success: function (response) { 
		generateCustRow(response);
		$('#lodaingModal').modal('hide');
       },
  error : function (response) { 
		alert("Error : "+response.responseText);
		location.href="login.html"
		$('#lodaingModal').modal('hide');
        }

});
}

function fetchCustPayImageDetails(custid){
	return fetchImageDetails(custid,'image-sec-'+custid);
}

	
	function resizeItemPic(){
		resizeImageToSpecificWidth("itemPic",input);
		
	}
	function resizeCustPic(){
		resizeImageToSpecificWidth("custPic",input2);
		
	}
	
	function resizeDocPic(){
		resizeImageToSpecificWidth("docPic",input3);
		
	}

    function resizeImageToSpecificWidth(imgPath,myInput) {
		var width = 200;
        if (myInput.files && myInput.files[0]) {
            var reader = new FileReader();
            reader.onload = function(event) {
                var img = new Image();
                img.onload = function() {
                    if (img.width > width) {
                        var oc = document.createElement('canvas'), octx = oc.getContext('2d');
                        oc.width = img.width;
                        oc.height = img.height;
                        octx.drawImage(img, 0, 0);
                        while (oc.width * 0.5 > width) {
                            oc.width *= 0.5;
                            oc.height *= 0.5;
                            octx.drawImage(oc, 0, 0, oc.width, oc.height);
                        }
                        oc.width = width;
                        oc.height = oc.width * img.height / img.width;
                        octx.drawImage(img, 0, 0, oc.width, oc.height);
						$(".fa-refresh").remove();
                        document.getElementById(imgPath+"-image").src = oc.toDataURL();
                    }
                };
                document.getElementById(imgPath+"-orignal").src = event.target.result;
                img.src = event.target.result;
            };
            reader.readAsDataURL(myInput.files[0]);
        }
    }

function changePassword(){
	if($("#newpassword").val() == ""){
		alert('Please enter valid Password')
	}
	
	if($("#newpassword").val() == $("#confirmpassword").val()){
		
			var map={};
			map["token"]=sessionStorage.getItem(code + "_token");
			map["venderPass"]=$("#newpassword").val();
					
		  $.ajax({
		  type: 'POST',
		  data: JSON.stringify(map),
		  url: contextPath +"updatePassword",
		  success: function (response) { 
				alert("Password updated successfully.")
				
				location.href="login.html"
			   },
		  error : function (response) { 
				alert("Error : "+response.responseText);
				
				location.href="login.html"
				}

		});
		
		
	}else{
		alert("Your New Password and Confirm Password does not match")
	}
	
	
}