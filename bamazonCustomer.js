var mysql = require('mysql');
var inquirer = require('inquirer')
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3307,
  
    // Your username
    user: "root",
  
    // Your password
    password: "newroot",
    database: "bamazon"
  });
 
  connection.connect();
  displayStock()
  function displayStock(){
  connection.query('SELECT * FROM bamazon.products', function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " - " + "$"+res[i].price);
               
      }
      console.log("-----------------------------------");
      console.log(res.length)
      askQ(res.length)
      
    });
  }
    
    
    
    
function askQ(lon){
    inquirer
    .prompt([
      {
        name: 'item_id',
        message: 'Please enter the products ID for your purchase.',
        
      },
      {
        name: 'quantity',
        message: 'How many items of that item would you like to buy?',
        
      },
    ])
    .then(answers => {
        var orderedId = answers.item_id;
        var orderedQuantity = answers.quantity;
        if ( orderedId >lon  || orderedId <= 0) {
          console.log('Please choose from our current stock inventory!')
          buyAgain()
        } else {
          availability(orderedId, orderedQuantity)
        }
       
    });
    
}

function availability(orderedId, orderedQuantity){
  connection.query('select * from bamazon.products where item_id = ?', [orderedId], function(err,res){
      if (err) {
          console.log(err)
      } else {

      availStock = (res[0].stock_quantity);
      
      productPrice = res[0].price;
      newStock = parseFloat(availStock - orderedQuantity);
      
      var totalPrice = (productPrice * orderedQuantity)
      if (newStock < 0 || availStock == 0){
        console.log(res)
        console.log("------------")
          console.log("I'm sorry. We are not able to proceed an order for that many items")
          console.log("------------")
          buyAgain()
      } else {
        console.log("------------")
        console.log(`That's great! Proccessing order for ${orderedQuantity} item(s) of item_id: ${orderedId}`);
        console.log("------------")
        console.log(`Your total order cost would be: $${totalPrice}`);
        console.log("------------")
        console.log("You order has been placed! Thank you for your business!")
        console.log("------------")
        console.log(`We have ${newStock} units left of ${res[0].product_name}`)
        
        connection.query('update products set stock_quantity ='+newStock+' where item_id='+orderedId, function(err, res){
            if (err) throw err;
            
            buyAgain()
        })
        
      }
      
      }
       
  })
  
}
   
function buyAgain(){
  inquirer.
  prompt([
{
    message: "Would you like to buy something else today?",
    type: "confirm",
    name: "buyAgain"
    }
  ])
  .then(answers => {
      if(answers.buyAgain) 
   {
     displayStock()
   } else {
    console.log("Thank you for your business. Have a great day!")
    connection.end();
    }
    
  })
  
}
