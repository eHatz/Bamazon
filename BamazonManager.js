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

inquirer.prompt({
	name: 'options',
	type: 'list',
	message: 'Please select an option from below.',
	choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
}).then(function(res){
	var choice = res.options;
	switch(choice) {
		case 'View Products for Sale':
			var query = connection.query('SELECT * FROM products',function(err, res){
				parseTable(res);
			});
		break;

		case 'View Low Inventory':
			var query = connection.query('SELECT * FROM products WHERE StockQuantity <5',function(err, res){
				parseTable(res);
			});
		break;

		case 'Add to Inventory':
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
						message: 'Please enter the ID of the item whose quantity you would like to change.'
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
							message: 'You have selected ' + res[idNumber].ProductName + '. Please enter the new quantity.'
						}).then(function(answer2){
							console.log('');
							var quantity = parseInt(answer2.quantity);
							if (!parseInt(answer2.quantity) || quantity < 0) {
								console.log('Invalid Quantity.');
								return selectItem();
							};
							console.log('Product ID: ' + res[idNumber].id + ' | Product Name: ' + res[idNumber].ProductName + ' | Price: ' +  res[idNumber].Price + ' | Quantity: ' + quantity);
							connection.query('UPDATE products SET StockQuantity=' + quantity + ' WHERE ?', {id: answer.item}, function(err, res){
								console.log('The quantity has been changed');
							});
						});
					});
				};
			});

		break;

		case 'Add New Product':
			inquirer.prompt([
			{
				name: 'item',
				type: 'input',
				message: 'Enter product name.'
			},
			{
				name: 'dept',
				type: 'input',
				message: 'Enter department item belongs in.'
			},
			{
				name: 'price',
				type: 'input',
				message: 'Enter price of item.'
			},
			{
				name: 'quantity',
				type: 'input',
				message: 'Enter the quantity'
			}
			]).then(function (answer) {
				var query = connection.query('INSERT INTO products SET ?', {
					ProductName: answer.item,
					DepartmentName: answer.dept,
					Price: parseFloat(answer.price),
					StockQuantity: parseInt(answer.quantity)
				},function(err, res){
					if (err) {
						throw err;
					};
					console.log('Your entry has been added!');
					console.log('Product Name: ' + answer.item + ' | Department: ' + answer.dept + ' | Price: ' +  answer.price + ' | Quantity: ' + answer.quantity);

				});

			});
			
		break;
	};
});

function parseTable (res) {
	for (var i = 0; i < res.length; i++) {
		console.log('');
		console.log('Product ID: ' + res[i].id + ' | Product Name: ' + res[i].ProductName + ' | Price: ' +  res[i].Price + ' | Quantity: ' + res[i].StockQuantity);
		console.log('');
	};
};


