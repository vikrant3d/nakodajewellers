function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
		  if(arr[i].substr(arr[i].length-1) == "C"){
			b.style.color="red"
		  }
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
			  getCustomerDetails(inp.value);
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
	  
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
	 
  });
}
var imgid = 0;
function getCustomerDetails(value){
	var value1 = value
  $('#lodaingModal').modal('show');
		value1 = value1.substr(0,value1.lastIndexOf("#")-1)
		$.ajax({
		  type: 'POST',
      data: '{"custid":"'+value1.substr(value1.lastIndexOf("#")+2)+'"}',
		  url: contextPath +"editCustomerIntrestData",
		  success: function (response) {
        $("#paymentDetailsSection").show();
					$("#custDetailsTable tbody").empty();			  
          var response1 = $(response).get(0);
          $("#custid").html($(response1).attr('id'));
          $("#customerid").val($(response1).attr('id'));
          $("#custName").html($(response1).attr('custName'));
          $("#phoneNo").html($(response1).attr('phoneNo'));
          $("#address").html($(response1).attr('address'));
          $("#itemDesc").html($(response1).attr('itemDescription'));
          $("#grossWt").html($(response1).attr('grossWt'));
          $("#netWt").html($(response1).attr('netWt'));
          $("#actualItemAmt").html($(response1).attr('actualItemAmount'));
          $("#amtLease").html($(response1).attr('amountForLease'));
          $("#rateOfIntrest").html($(response1).attr('rateOfIntrest'));
          $("#dateOfRequest").html($(response1).attr('dateOfRequest'));
          var response2 = $(response).get(1);
          $('#custPic-image').attr('src','data:image/png;base64,'+$(response2).attr('custPic'));   
          $('#itemPic-image').attr('src','data:image/png;base64,'+$(response2).attr('itemPic'));
		  $('#docPic-image').attr('src','data:image/png;base64,'+$(response2).attr('docPic')); 		  
          $('#lodaingModal').modal('hide');
          $("#intrestDetails").html( $(response).get(2));
          $('#lodaingModal').modal('hide');
			if($(response1).attr('currentStatus') == 'C'){
				$("#makePayment").hide();
			}

           $($(response1).attr('transactionList')).each(function(i,response3){
                var newRow = "<tr><td >"+(++i)+"</td><td>Payment made on "+$(response3).attr("dateOfTransaction")+", with amount "+$(response3).attr("amountPay")+" Rs, have Rate Of Intrest "+$(response3).attr("rateOfIntrest")+"%</td></tr>";
                $("#custDetailsTable tbody").append(newRow);
                });
		
        }
      
			});
}

var map={};
	map["token"]=sessionStorage.getItem(code + "_token");
$.ajax({
  type: 'POST',
  data: JSON.stringify(map),
  url: contextPath +"getAllCustomerInfo",
  success: function (response1) { 
/*An array containing all the country names in the world:*/
var countries = response1;

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"), countries);

		},
		error : function (response) { 
		alert("Error : "+response.responseText);
		location.href="login.html"
        }

});

	
	
	
	