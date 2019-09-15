var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'newroot',
    database: 'bamazon'
})

connection.connect();
actionRequired()
function actionRequired(){
inquirer
    .prompt([
      {
        type: 'rawlist',
        name: 'action',
        message: 'Please enter the products ID for your purchase.',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit']
      },
     
    ])
    .then(answers => {
        var choice = answers.action
        console.log(choice)
        switch(choice) {
            case "View Products for Sale" :
            connection.query('Select * from bamazon.products', function(err,res){
                if(err) throw err;
                for(var i = 0; i< res.length; i++){
                    console.log(res[i].item_id + " | " + res[i].product_name + " - " + "$"+res[i].price + ' | qty ' + res[i].stock_quantity);
                    
                }
               setTimeout(actionRequired, 2000)
                
            })
            
            break;

            case "View Low Inventory" :
            connection.query('select item_id, product_name, stock_quantity from products where stock_quantity  between 0 and 5', function(err, res){
                if(err) throw err;
                
                for(var i = 0; i< res.length; i++){
                    console.log('ID- ' + res[i].item_id + " | " + res[i].product_name +  ' | qty ' + res[i].stock_quantity);

                }
                setTimeout(actionRequired, 2000)
            })
            break;
            
            case 'Add to Inventory' :
            inquirer
            .prompt ([
                {
                    type: 'input',
                    name: "addInventory",
                    message: "Choose Item_ID, to add more to its inventory stock"
                }
            ])
            .then(answers=> {
                var changeID = parseFloat(answers.addInventory)
                connection.query('select * from products where item_id = ?',[changeID], function(err,res){
                    if(err) {
                        console.log(err)
                    } else {
                        availStock = res[0].stock_quantity;
                        for(var i = 0; i< res.length; i++){
                        console.log('ID- ' + res[i].item_id + " | " + res[i].product_name +  ' | qty ' + res[i].stock_quantity);
                        }
                      inquirer
                      .prompt ([
                          {
                              type: 'input',
                              name: 'addNumber',
                              message: 'Add number of units to add to existing inventory',
                          }
                      ])
                      .then(answers=>{
                
                          var additional = parseFloat(answers.addNumber);
                         connection.query('update products  set stock_quantity = ? where item_id = ?', [(availStock + additional), changeID],function(err, res){
                             if (err) throw err;
                             //console.log(res)
                            //  console.log("The stock inventory of " + res[0].product_name + " has been added " + additional + " units and it will have " + res[0].stock_quantity + " units available in 3 days")
                         } )
                         console.log("The stock inventory of " + res[0].product_name + " has been added " + additional + " units and it will have " + (res[0].stock_quantity +additional) + " units available in 3 days")
                      })
                    }
                })
                setTimeout(actionRequired, 2000)
            })
            break;

            case 'Add New Product' :
                inquirer
                .prompt ([
                    {
                        type:'input',
                        name: 'newItem',
                        message: 'Create new Item with (product_name, department_name, price, stock_quantity) list them separeted by coma.'
                    }
                ])
                .then(answers =>{
                    var createItem =(answers.newItem).split(",")
             connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) values ?',[[createItem]], function(err,res){
                 if(err) throw err;
                 setTimeout(actionRequired, 2000)
             })
        })
            break;
        default :
            connection.end()
        break;
        }
        
       
    });
}

