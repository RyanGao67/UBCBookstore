var cart = {};
var total = 0; 
var inactiveTime = 0;
var oldCart = {};
var URL = "https://cpen400a-bookstore.herokuapp.com/products";
var Product=function(name){
	this.name=name.name;
	this.price=name.price;
	this.imageUrl=name.imageUrl;
};

Product.prototype.computeNetPrice=function(quantity){
	return quantity*this.price;
}
var products={
	Box1 : {},
    Box2 : {},
    Clothes1 : {},
    Clothes2 : {},
    Jeans : {},        
    Keyboard : {},
    KeyboardCombo : {},
    Mice : {},
    PC1 : {},  
    PC2 : {},
    PC3 : {},
    Tent : {}, 
};


/*
successCallback for ajaxGet
initialize a product list once the ajaxGet is a success
*/
var ifSuccess=function(productss){
	console.log("hello");
	products["Box1"].product = new Product(productss.Box1);
	products["Box1"].quantity =productss.Box1.quantity;
	products["Box2"].product = new Product(productss.Box2);
	products["Box2"].quantity =productss.Box2.quantity;
	products["Clothes1"].product = new Product(productss.Clothes1);
	products["Clothes1"].quantity =productss.Clothes1.quantity;
	products["Clothes2"].product = new Product(productss.Clothes2);
	products["Clothes2"].quantity =productss.Clothes2.quantity;
	products["Jeans"].product = new Product(productss.Jeans);
	products["Jeans"].quantity =productss.Jeans.quantity;
	products["Keyboard"].product = new Product(productss.Keyboard);
	products["Keyboard"].quantity =productss.Keyboard.quantity;
	products["KeyboardCombo"].product = new Product(productss.KeyboardCombo);
	products["KeyboardCombo"].quantity =productss.KeyboardCombo.quantity;
	products["Mice"].product = new Product(productss.Mice);
	products["Mice"].quantity =productss.Mice.quantity;
	products["PC1"].product = new Product(productss.PC1);
	products["PC1"].quantity =productss.PC1.quantity;
	products["PC2"].product = new Product(productss.PC2);
	products["PC2"].quantity =productss.PC2.quantity;
	products["PC3"].product = new Product(productss.PC3);
	products["PC3"].quantity =productss.PC3.quantity;
	products["Tent"].product = new Product(productss.Tent);
	products["Tent"].quantity =productss.Tent.quantity;
	var product =document.getElementsByClassName("product");
	for(var i=0;i<product.length;i++){
		var productName = product[i].id;
		console.log(productName);
		var productPrice = product[i].getElementsByClassName("price");
		console.log(productPrice+"NONONONONONONONONO|||||||||");
		productPrice[0].innerHTML = "$"+productss[productName].price+".00";
		console.log(productss[productName].price+"Yes!!!!!!");
		var productImg = product[i].getElementsByClassName("productPic");
		productImg[0].src=productss[productName].imageUrl;

	}

};


/*errorCallback for ajaxGet, using recursive method to ensure the page is successfully loaded*/
var ifError=function(error){
	console.log(error);
	var totalError = 0;
        if (totalError < 10)
             ajaxGet(URL,ifSuccess,ifError);
        else
            alert('Unknown Error');
}

 function ajaxGet(url, successCallback,errorCallback){
	var productListXhr = new XMLHttpRequest();
	productListXhr.open("GET", url);
	productListXhr.timeout = 2000;
	productListXhr.onload = function() {
		if(productListXhr.status == 200) {
			console.log("Request successful, status 200.");

			if (productListXhr.getResponseHeader('Content-Type').includes('application/json')) {
				var products = JSON.parse(productListXhr.responseText);
				console.log(products);
				successCallback(products);
			}
		} else {
			console.log("Received error code. Status " + productListXhr.status + ". Trying new AJAX call");
			//productListXhr.send();
			ajaxGet(url,successCallback,errorCallback);//reuse ajaxGet
		}
	};

	productListXhr.ontimeout = function() {
		console.log("Request timeout occurred. Trying new AJAX call.");
		errorCallback("Request timed out");
		//productListXhr.send();
	};

	productListXhr.onerror = function() {
		console.log("Error occurred on request: " + productListXhr.status + " Trying new AJAX call.");
		//productListXhr.send();
		errorCallback(productListXhr.status);
	};

	productListXhr.send();
};

/*confirm price and quantity during checkout, by updating the information from server*/

 function ajaxCheckout(url,oldCart,productss){

	var productListXhr = new XMLHttpRequest();
	productListXhr.open("GET", url);
	productListXhr.timeout = 2000;
	productListXhr.onload = function() {
		if(productListXhr.status == 200) {
			console.log("Request successful, status 200.");

			if (productListXhr.getResponseHeader('Content-Type').includes('application/json')) {
				var Products = JSON.parse(productListXhr.responseText);
				for(var i in oldCart){
					if(i!="total"){
					console.log(oldCart[i]);
					console.log(Products[i]);
					console.log(productss[i].product.price);
					if(Products[i].price!=productss[i].product.price){
						alert(i+":"+"price has changed to"+" $"+Products[i].price+".00");
						products[i].product.price=Products[i].price;	
					}
					if(Products[i].quantity<oldCart[i]){
						alert("Sorry there: we only have "+Products[i].quantity+" "+i);
						cart[i]=Products[i].quantity;
					}
					}
				}

				/* computes the new total amount in the cart*/
				ifSuccess(Products);
				total=0;
				for(var i in oldCart){
					if(i!="total"){
						total+=products[i].product.price*cart[i];
						console.log("fasfsafsafasfsafsafsafdsafdsgdsgdsafdsafdsafsdafdsafsafsafdsfsafdsf");
						console.log(products[i].product.price);
					}
				}
//				configTable();
				showModal();
				alert("The total amount due is "+"$"+total+".00");
			
				var order = JSON.parse('{"cart": ' + JSON.stringify(cart) + ', "total": ' + total +"}");
				var xhr = new XMLHttpRequest();
				// xhr.onload = function(){
				// 	if (xhr.status === 200){
				// 		alert(xhr.statusText);
				// 	}
				// }
				xhr.open("POST", "http://localhost:8080/checkpoint");
				xhr.send(JSON.stringify(order));
			}
		} else {
			console.log("Received error code. Status " + productListXhr.status + ". Trying new AJAX call");
			//productListXhr.send();
			ajaxCheckout(url,oldCart,productss);
		}
	};

	productListXhr.ontimeout = function() {
		console.log("Request timeout occurred. Trying new AJAX call.");
		ajaxCheckout(url,oldCart,productss);
		//productListXhr.send();
	};

	productListXhr.onerror = function() {
		console.log("Error occurred on request: " + productListXhr.status + " Trying new AJAX call.");
		//productListXhr.send();
		ajaxCheckout(URL,oldCart,productss);
	};

	productListXhr.send();
};


function showCart(){
	console.log("showCart clicked");
	showModal();
}
function showModal(){
	configModal();
	var modal = document.getElementById('myModal');
	modal.style.display = "block";
}

function configModal(){
	console.log("aaa");
	// Get the modal
	var modal = document.getElementById('myModal');

	// Get the button that opens the modal
	var btn = document.getElementById("showCart");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];
	var parent = document.getElementsByClassName("modal-content");

	parent[0].removeChild(parent[0].lastChild);
	var myTable = document.createElement("table");
	myTable.innerHTML="<tr><td>Product Name"+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"
	+"</td><td>Quantity"+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"
	+"</td><td>Price"+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+"</td></tr>";
	
	parent[0].appendChild(myTable);
	for(var j in cart){
		if(j!="total"){
			console.log(j);
			console.log(products[j]+"youyouyouyouyouyou");
			//console.log(products[j].product['price']);
			console.log(products[j]);
			var a = document.createElement("tr"); 
			var buttonp= '<button onclick=\'addToCart("'+ j +'")\'>+</button>';
			var buttonm= '<button onclick=\'removeFromCart("'+ j +'")\'>-</button>';
			a.innerHTML="<td>"+j+"</td><td>"+cart[j]+"</td><td>"+(products[j].product['price']*cart[j])+"</td>"+"<td>"+buttonp+"</td>"+"<td>"+buttonm+"</td>";
			myTable.appendChild(a);
			//console.log(a);
		}
	}
	var showTotal = document.createElement("tr");
	showTotal.innerHTML="<td>Total</td>"+"<td></td><td>"+total+"</td>";
	myTable.appendChild(showTotal);

// When the user clicks on <span> (x), close the modal

	var buttonCheck = document.createElement("button");
	buttonCheck.innerHTML="CHECKOUT";
	buttonCheck.id="checkOutt";
	//buttonCheck.onclick = 'checkOut';
	console.log(buttonCheck.id);
	myTable.appendChild(buttonCheck);
	

	span.onclick = function() {
    modal.style.display = "none";
}
	buttonCheck.onclick = function() {
	console.log("checkOut called")
	var checked = document.getElementById("checkOutt");
	console.log(checked);
	oldCart = cart;
	console.log(oldCart);
	if (checked){
	ajaxCheckout(URL,oldCart,products);
	alert("we'll update the availability and price for you");
	}
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
window.addEventListener("keydown",function(e){
	console.log(e.keyCode);
	if(e.keyCode==27){
		var modal = document.getElementById('myModal');
	 	modal.style.display = "none";}
},false);	
}

function startTimer(){
	inactiveTime = 0;
	timeoutElement.innerHTML = "The current time is " + inactiveTime + '!'; 
	var timer = setInterval( function(){
	if (inactiveTime < 299){
		inactiveTime++;	
		timeoutElement.innerHTML = "The current time is " + inactiveTime + '!'; 
	}else{
		alert("Hey there! Are you still planning to buy something?");		
		clearInterval(timer);
		startTimer()
	}}, 1000);
}

function addToCart(whichProduct) {
	var inCart = false; 
	inactiveTime = 0
	timeoutElement.innerHTML = "The current time is " + inactiveTime + '!';

    console.log(products[whichProduct]);
    console.log(products[whichProduct].quantity);
    if(products[whichProduct].quantity == 0){
		document.getElementById(whichProduct).getElementsByClassName('addButton')[0].style.display = "none";
		alert("This item is not in stock you cannot add it to your cart");
	}

    if(products[whichProduct].quantity > 0){
		for(var i in cart){
			if(i == whichProduct ){
					cart[i]++;
					inCart = true;		
			}
		}	
		if(!inCart){
			document.getElementById(whichProduct).getElementsByClassName('removeButton')[0].style.display = "inline"
			cart[whichProduct] = 1; 
		}		
		
		console.log(products[whichProduct].product);
		console.log("sssssssssssssssssssssssssssssssssssssssssss");
		console.log(products[whichProduct].product['price']);
		products[whichProduct].quantity--;
		total += products[whichProduct].product.computeNetPrice(1);

		showCartELe.innerHTML = "Cart ($" + total + ")"; 
		console.log(products[whichProduct].product.computeNetPrice(1));
		configModal();
	}



}

function removeFromCart(whichProduct) {
	var inCart = false;
	inactiveTime = 0
	timeoutElement.innerHTML = "The current time is " + inactiveTime + '!';	
	console.log(products[whichProduct].quantity);

	for(var i in cart){
		if(whichProduct == i){
			if(cart[i] == 1){
				delete cart[i];
				document.getElementById(whichProduct).getElementsByClassName('removeButton')[0].style.display = "none";				
			}				
			else{
				cart[i]--; 				
			}
			total = total-products[whichProduct].product['price']; 
			inCart = true;
			products[whichProduct].quantity++;
			showCartELe.innerHTML = "Cart ($" + total + ")"; 

		}
	}	
	if(!inCart){
		alert("Quantity = 0 Unable To Remove!")

	}	

	if(products[whichProduct].quantity > 0){
		document.getElementById(whichProduct).getElementsByClassName('addButton')[0].style.display = "inline";
	}
	configModal();
}



window.onload = function () {
	timeoutElement = document.getElementById("timeout");
	showCartELe = document.getElementById("showCart");
    startTimer();
    ajaxGet(URL,ifSuccess,ifError);

};