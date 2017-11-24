
var appHost = 'https://cpen400a-bookstore.herokuapp.com/';
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var products = {
  'KeyboardCombo' : {
	name: 'KeyboardCombo',
    price : getRandomInt(25,35),
    quantity : getRandomInt(0,10),
    imageUrl: appHost+'images/KeyboardCombo.png'
  },
  'Mice' : {
	name: 'Mice',
    price : getRandomInt(5,7),
    quantity : getRandomInt(0,10),
    imageUrl: appHost+'images/Mice.png'
  },
  'PC1' : {
	name: 'PC1',
    price : getRandomInt(300,350),
    quantity : getRandomInt(0,10),
    imageUrl: appHost+'images/PC1.png'
  },
  'PC2' : {
	name: 'PC2',
    price : getRandomInt(350,400),
    quantity : getRandomInt(0,10),
    imageUrl: appHost+'images/PC2.png'
  },
  'PC3' : {
	name: 'PC3',
    price : getRandomInt(330,380),
    quantity : getRandomInt(0,10),
    imageUrl: appHost+'images/PC3.png'
  },
  'Tent' : {
	name: 'Tent',
    price : getRandomInt(30,40),
    quantity : getRandomInt(0,10),
    imageUrl: appHost+'images/Tent.png'
  },
  'Box1' : {
	name: 'Box1',
    price : getRandomInt(5,7),
    quantity : getRandomInt(0,10),
    imageUrl: appHost+'images/Box1.png'
  },
  'Box2' : {
	name: 'Box2',
    price : getRandomInt(5,7),
    quantity : getRandomInt(0,10),
    imageUrl: appHost+'images/Box2.png'
  },
  'Clothes1' : {
	name: 'Clothes1',
    price : getRandomInt(20,30),
    quantity : getRandomInt(0,10),
    imageUrl: appHost+'images/Clothes1.png'
  },
  'Clothes2' : {
	name: 'Clothes2',
    price : getRandomInt(20,30),
    quantity : getRandomInt(0,10),
    imageUrl: appHost+'images/Clothes2.png'
  },
  'Jeans' : {
	name: 'Jeans',
    price : getRandomInt(30,40),
    quantity : getRandomInt(0,10),
    imageUrl: appHost+'images/Jeans.png'
  },
  'Keyboard' : {
	name: 'Keyboard',
    price : getRandomInt(15,25),
    quantity : getRandomInt(0,10),
    imageUrl: appHost+'images/Keyboard.png'
  }
};

//db.products.insert(products);	

db.products.insert(products['Keyboard']);
db.products.insert(products['Jeans']);
db.products.insert(products['Clothes2']);
db.products.insert(products['Clothes1']);
db.products.insert(products['Box2']);
db.products.insert(products['Box1']);
db.products.insert(products['Tent']);
db.products.insert(products['PC3']);
db.products.insert(products['PC2']);
db.products.insert(products['PC1']);
db.products.insert(products['Mice']);
db.products.insert(products['KeyboardCombo']);
db.orders.insert({
  cart : "BOX2",
  total : 117
});
db.users.insert({
	token : "Xoe2inasd"
});