var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Paokpaok12',
	database: 'Bamazon'
});

connection.connect(function(err) {
    if (err) throw err;
});
var query = connection.query('SELECT * FROM products',function(err, res){
	for (var i = 0; i < res.length; i++) {
		console.log('Product ID: ' + res[i].id + ' | Product Name: ' + res[i].ProductName + ' | Price: ' +  res[i].Price)
		console.log('');
	};
	selectItem();

	function selectItem() {
		console.log('');
		inquirer.prompt({
			name: 'item',
			type: 'input',
			message: 'Please enter the ID of the item you would like to purchase.'
		}).then(function (answer) {
			if (!parseInt(answer.item) || parseInt(answer.item) > res.length || parseInt(answer.item) < 0) {
				console.log('Invalid ID number.');
				return selectItem();
			};
			var idNumber = parseInt(answer.item) - 1;
			console.log('')
			inquirer.prompt({
				name: 'quantity',
				type: 'input',
				message: 'You have selected ' + res[idNumber].ProductName + '. Please enter a quantity. If you would like to cancel your order and start again please enter 0.'
			}).then(function(answer2){
				console.log('');
				var quantity = parseInt(answer2.quantity);
				var inStock = parseInt(res[idNumber].StockQuantity);
				if (answer2.quantity == 0) {
					console.log('The item was removed from your cart');
					return selectItem();
				};

				if (quantity > inStock) {
					console.log('Insufficient quantity! Please try again');
					return selectItem();
				};
				var total = parseFloat(res[idNumber].Price) * quantity;
				console.log(res[idNumber].ProductName + ' | Price: $' +  res[idNumber].Price + ' | Quantity: ' + quantity + ' | Total: $' + total);
				connection.query('UPDATE products SET StockQuantity=' + (inStock - quantity) + ' WHERE ?', {id: answer.item}, function(err, res){
					console.log('Your order has been successfully submitted');
				});
			});
		});
	};
});
