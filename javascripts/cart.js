var cart = [];

cart.total = 0; 

var verbose = true;

var inactiveTime = 0;

var isShowingCart = false;

var oldCart = [];

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
		var productPrice = product[i].getElementsByClassName("price");
		productPrice[0].innerHTML = "$"+productss[productName].price+".00";
		var productImg = product[i].getElementsByClassName("productPic");
		productImg[0].src=productss[productName].imageUrl;

	}

};
/*errorCallback for ajaxGet, using recursive method to ensure the page is successfully loaded*/
var ifError=function(error){
	console.log(error);
	var totalError = 0;
        if (totalError < 10)
             ajaxGet("https://cpen400a-bookstore.herokuapp.com/products",ifSuccess,ifError);
        else
            alert('Unknown Error');
}

 function ajaxGet(url, successCallback,errorCallback){
	var productListXhr = new XMLHttpRequest();
	productListXhr.open("GET", "https://cpen400a-bookstore.herokuapp.com/products");
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
			ajaxGet("https://cpen400a-bookstore.herokuapp.com/products",ifSuccess,ifError);
		}
	};

	productListXhr.ontimeout = function() {
		console.log("Request timeout occurred. Trying new AJAX call.");
		ifError(timeout);
		//productListXhr.send();
	};

	productListXhr.onerror = function() {
		console.log("Error occurred on request: " + productListXhr.status + " Trying new AJAX call.");
		//productListXhr.send();
		ifError(onerror);
	};

	productListXhr.send();
};

/*confirm price and quantity during checkout, by updating the information from server*/
function checkOut(){
	var checked = document.getElementById("checkOut");
	console.log(checked);
	oldCart = cart;
	console.log(oldCart);
	if (checked){
	ajaxCheckout("https://cpen400a-bookstore.herokuapp.com/products",oldCart,products);
	alert("we'll update the availability and price for you");
	}
}
 function ajaxCheckout(url,oldCart,productss){
	var productListXhr = new XMLHttpRequest();
	productListXhr.open("GET", "https://cpen400a-bookstore.herokuapp.com/products");
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
				cart.total=0;
				for(var i in oldCart){
					if(i!="total"){
						cart.total+=products[i].product.price*cart[i];
					}
				}
				configTable();
				alert("The total amount due is "+"$"+cart.total+".00");
			
			}
		} else {
			console.log("Received error code. Status " + productListXhr.status + ". Trying new AJAX call");
			//productListXhr.send();
			ajaxCheckout("https://cpen400a-bookstore.herokuapp.com/products",oldCart,productss);
		}
	};

	productListXhr.ontimeout = function() {
		console.log("Request timeout occurred. Trying new AJAX call.");
		ajaxCheckout("https://cpen400a-bookstore.herokuapp.com/products",oldCart,productss);
		//productListXhr.send();
	};

	productListXhr.onerror = function() {
		console.log("Error occurred on request: " + productListXhr.status + " Trying new AJAX call.");
		//productListXhr.send();
		ajaxCheckout("https://cpen400a-bookstore.herokuapp.com/products",oldCart,productss);
	};

	productListXhr.send();
};

//update the cart table
function configTable(){

	var table = document.getElementById("cartItems");

	table.innerHTML = "";

	for(var j in cart){
		if (j != "total"){
			var row = table.insertRow(0);
	    	var cell1 = row.insertCell(0);
	    	var cell2 = row.insertCell(1);
	    	var cell3 = row.insertCell(2);
	    	var cell4 = row.insertCell(3);
	    	var cell5 = row.insertCell(4);
	    	cell1.innerHTML = j;
	    	cell2.innerHTML = cart[j];
	    	price = parseInt(products[j].product['price'])
	    	quantity = parseInt(cart[j])
	    	cell3.innerHTML = (price*quantity).toString()
	    	cell4.innerHTML = '<button onclick=\'addToCart("'+ j +'")\'>+</button>'
	    	cell5.innerHTML = '<button onclick=\'removeFromCart("'+ j +'")\'>-</button>'
    	}else{
    		var row = table.insertRow(0);
	    	var cell1 = row.insertCell(0);
	    	var cell2 = row.insertCell(1);
	    	var cell3 = row.insertCell(2);
	    	cell1.innerHTML = "<strong>Total</strong>";
	    	cell3.innerHTML = cart[j];
    	}
	}


	var row = table.insertRow(0);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	cell1.innerHTML = "<strong>Product Name</strong>"
	cell2.innerHTML = "<strong>Quantity</strong>"
	cell3.innerHTML = "<strong>Total</strong>"
}
function startTimer(){
	inactiveTime = 0;
	timeoutElement.innerHTML = "The current timeout value is " + inactiveTime + '!'; 
	var timer = setInterval( function(){
	if (inactiveTime < 299){
		inactiveTime++;	
		timeoutElement.innerHTML = "The current timeout value is " + inactiveTime + '!'; 
		console.log(inactiveTime)
	}else{
		if(verbose){
			alert("Hey there! Are you still planning to buy something?");
		}		
		clearInterval(timer);
		startTimer()
	}}, 1000);
}

function addToCart(productName) {
	inactiveTime = 0
	timeoutElement.innerHTML = "The current timeout value is " + inactiveTime + '!';
	console.log("Adding To Cart")
    var found = false; 
    console.log(products[productName]);
    console.log(products[productName].quantity);

    if(products[productName].quantity > 0){
		for(var i in cart){
			if(i == productName ){
					cart[i]++;
					found = true;		
					break;
			}
		}	
		if(!found){
			document.getElementById(productName).getElementsByClassName('removeButton')[0].style.display = "inline"
			cart[productName] = 1; 
		}		
		products[productName].quantity--;
		console.log(products[productName].product);
		console.log(products[productName].product['price']);
	
		cart.total += products[productName].product.computeNetPrice(1);

		cartElement.innerHTML = "Cart ($" + cart.total + ")"; 
		console.log(products[productName].product.computeNetPrice(1));
	}

	if(products[productName].quantity == 0){
		document.getElementById(productName).getElementsByClassName('addButton')[0].style.display = "none";
		alert("This item is not in stock you cannot add it to your cart");
		//removeFromCart(productName);
	}
	if(verbose){
		console.log("The Cart Now Contains:")
		for(var j in cart)
		{			
			console.log("ProductName:" + j + " Quantity" + cart[j]);
		}
	}
	configTable();
}

function removeFromCart(productName) {
	inactiveTime = 0
	timeoutElement.innerHTML = "The current timeout value is " + inactiveTime + '!';	
	var found = false;
	console.log(products[productName].quantity);

	for(var i in cart){
		if(productName == i){
			if(cart[i] == 1){
				delete cart[i];
				document.getElementById(productName).getElementsByClassName('removeButton')[0].style.display = "none";				
			}				
			else{
				cart[i]--; 				
			}
			found = true;
			cart.total -= products[productName].product['price']; 
			cartElement.innerHTML = "Cart ($" + cart.total + ")"; 
			products[productName].quantity++;
		}
	}	
	if(!found){
		alert("This Item Is Not In Your Cart!");
	}	
	if(verbose){
		console.log("The Cart Now Contains:")
		for(var j in cart)
		{
			console.log("ProductName:" + j + " Quantity" + cart[j]);
		}
	} 
	configTable();
		if(products[productName].quantity > 0){
		document.getElementById(productName).getElementsByClassName('addButton')[0].style.display = "inline";
	}
}


var showItem = function () {
    var counter = 0;

    return function(){
    	var message="";
    	for(;counter<Object.keys(cart).length;counter++){
    		message+=Object.keys(cart)[counter] + " Quantity :" + cart[Object.keys(cart)[counter]];
    		message+="\n";
    	}
    	alert(message);
    	if(counter >= Object.keys(cart).length){
    		isShowingCart = false;
    		counter = 0;
    		alert("Hey there! Are you still planning to buy something?");
    	}
    }
}();

function showCart(){

	inactiveTime = 0
	toggleOverlay();	
}
function toggleOverlay(){
	overlay.style.opacity = .8;
	if(overlay.style.display == "block"){
		overlay.style.display = "none";
		overlayContent.style.display = "none";
	} else {
		overlay.style.display = "block";
		overlayContent.style.display = "block";
	}
	
	configTable();
}

window.onload = function () {
	timeoutElement = document.getElementById("timeout");
	cartElement = document.getElementById("showCart");
	overlay = document.getElementById('overlay');
	overlayContent = document.getElementById('overlayContent');
	overlayProducts = document.getElementById('overlayProducts');
    startTimer();
    ajaxGet("https://cpen400a-bookstore.herokuapp.com/products",ifSuccess,ifError);
};