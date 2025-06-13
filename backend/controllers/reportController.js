const Category = require('../models/category');

const Product = require('../models/product');

const fs = require('fs');

const path = require('path');


 

exports.generateStockReport = async (req, res) => {

  try {

    const categories = await Category.find();

    let html = `

      <!DOCTYPE html>

      <html lang="en">

      <head>

        <meta charset="UTF-8">

        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <meta http-equiv="X-UA-Compatible" content="ie=edge">

        <title>Stock Report</title>

        <style>

          body {

            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

            background-color: #f4f7fc;

            color: #333;

            margin: 0;

            padding: 0;

          }

          header {

            background-color: #2c3e50;

            color: white;

            padding: 10px;

            text-align: center;

          }

          main {

            padding: 20px;

          }

          h1 {

            font-size: 2.5rem;

            margin-bottom: 20px;

          }

          h2 {

            font-size: 1.75rem;

            margin-top: 20px;

            border-bottom: 2px solid #3498db;

            padding-bottom: 5px;

          }

          table {

            width: 100%;

            border-collapse: collapse;

            margin-top: 20px;

            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

          }

          th, td {

            padding: 12px;

            text-align: left;

            border: 1px solid #ddd;

          }

          th {

            background-color: #3498db;

            color: white;

            font-weight: bold;

          }

          tr:nth-child(even) {

            background-color: #f9f9f9;

          }

          tr:hover {

            background-color: #ecf0f1;

          }

          .no-products {

            font-size: 1.25rem;

            color: #e74c3c;

            text-align: center;

            margin-top: 20px;

          }

          footer {

            background-color: #2c3e50;

            color: white;

            text-align: center;

            padding: 10px;

            position: relative;

            width: 100%;

            bottom: 0;

          }

          @media (max-width: 768px) {

            table, th, td {

              display: block;

              width: 100%;

            }

            th {

              background-color: transparent;

              position: absolute;

              top: -9999px;

              left: -9999px;

            }

            td {

              border: none;

              position: relative;

              padding-left: 50%;

            }

            td:before {

              content: attr(data-label);

              position: absolute;

              left: 10px;

              font-weight: bold;

            }

          }

        </style>

      </head>

      <body>

        <header>

          <h1>Stock Report</h1>

        </header>

        <main>

    `;


 

    for (const category of categories) {

      html += `<section><h2>Category: ${category.name}</h2>`;

      const products = await Product.find({ category: category.name });


 

      if (!products.length) {

        html += `<p class="no-products">No products in this category.</p>`;

      } else {

        html += `

          <table>

            <caption>Product Stock in ${category.name}</caption>

            <thead>

              <tr>

                <th scope="col">Product</th>

                <th scope="col">Available Stock</th>

                <th scope="col">Maximum Capacity</th>

                 <th scope="col">Space Left</th>

              </tr>

            </thead>

            <tbody>

        `;

        products.forEach(product => {

          html += `

            <tr>

              <td data-label="Product">${product.name}</td>

              <td data-label="Available Stock">${product.quantity}</td>

              <td data-label="Maximum Capacity">200</td>

               <td data-label="Space Left">${200-product.quantity}</td>


 

            </tr>

          `;

        });

        html += `</tbody></table></section>`;

      }

    }


 

    html += `

        </main>

        <footer>

          <p>&copy; 2025 IMS Portal</p>

        </footer>

      </body>

      </html>

    `;


 

    // Ensure reports folder exists

    const reportsDir = path.join(__dirname, '../reports');

    if (!fs.existsSync(reportsDir)) {

      fs.mkdirSync(reportsDir);

    }


 

    const filePath = path.join(reportsDir, 'stock-report.html');

    fs.writeFileSync(filePath, html);


 

    res.download(filePath, 'stock-report.html');

  } catch (error) {

    console.error("Failed to generate report:", error);

    res.status(500).json({ message: "Failed to generate report" });

  }

};





 

exports.getAllReports = (req, res) => {

 const reportsDir = path.join(__dirname, '../reports');


 

 fs.readdir(reportsDir, (err, files) => {

   if (err) {

     console.error('Failed to list reports:', err);

     return res.status(500).json({ message: 'Failed to list reports' });

   }


 

   const reportFiles = files.filter(f => f.endsWith('.html'));

   res.json(reportFiles);

 });

};


 

exports.downloadReport = (req, res) => {

 const filename = req.params.filename;

 const filepath = path.join(__dirname, '../reports', filename);


 

 if (!fs.existsSync(filepath)) {

   return res.status(404).json({ message: 'Report not found' });

 }


 

 res.download(filepath);

};



 

