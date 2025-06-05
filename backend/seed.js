const mongoose = require('mongoose');
require('dotenv').config();

// Load Models
const User = require('./models/user');
const Category = require('./models/category');
const Product = require('./models/product');
const Outlet = require('./models/outlet');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
 .then(async () => {
   console.log('MongoDB connected. Seeding data...');

   // Clear collections
   await User.deleteMany({});
   await Category.deleteMany({});
   await Product.deleteMany({});
   await Outlet.deleteMany({});

   // Insert Users (plain text passwords)
   const users = await User.insertMany([
     {
       _id: new mongoose.Types.ObjectId("6650d6f31f9a0c1a1a000001"),
       username: "John_Wick",
       email: "john@ims.com",
       password: "Admin@123", // Plain text
       role: "admin",
       isActive: true,
       createdAt: new Date("2025-05-01T08:00:00Z"),
       img:  'assets/adminlogin.png'  
     },
     {
       _id: new mongoose.Types.ObjectId("6650d6f31f9a0c1a1a000002"),
       username: "Emma_Watson",
       email: "emma@ims.com",
       password: "Manager@123", // Plain text
       role: "manager",
       isActive: true,
       createdAt: new Date("2025-05-01T08:15:00Z"),
       img: 'assets/managerlogin.png'  
     },
     {
       _id: new mongoose.Types.ObjectId("6650d6f31f9a0c1a1a000003"),
       username: "Henry_Cavill",
       email: "henry@ims.com",
       password: "Staff@123", // Plain text
       role: "staff",
       isActive: true,
       createdAt: new Date("2025-05-04T08:30:00Z"),
       img: 'assets/stafflogin.png'  
     }
   ]);

    const outlets = await Outlet.insertMany([
    {
      _id: new mongoose.Types.ObjectId("6650d7b51f9a0c1a1a000100"),
      name: "Outlet A",
      location: "Downtown",
      createdAt: new Date("2025-05-02T11:00:00Z")
    },
    {
      _id: new mongoose.Types.ObjectId("6650d7b51f9a0c1a1a000101"),
      name: "Outlet B",
      location: "Uptown",
      createdAt: new Date("2025-05-02T11:05:00Z")
    },
    {
      _id: new mongoose.Types.ObjectId("6650d7b51f9a0c1a1a000102"),
      name: "Outlet C",
      location: "Suburb",
      createdAt: new Date("2025-05-02T11:10:00Z")
    }
  ]);

   // Insert Categories
   await Category.insertMany([
     { _id: new mongoose.Types.ObjectId("6650d7a51f9a0c1a1a000010"), name: "Electronics", createdAt: new Date("2025-05-02T10:00:00Z"), image : 'assets/electronics.png'  },
     { _id: new mongoose.Types.ObjectId("6650d7a51f9a0c1a1a000011"), name: "Stationery", createdAt: new Date("2025-05-02T10:01:00Z"), image:'assets/stationary.png'},
     { _id: new mongoose.Types.ObjectId("6650d7a51f9a0c1a1a000012"), name: "Furniture", createdAt: new Date("2025-05-02T10:02:00Z"), image: 'assets/furniture.png' }
   ]);

   // Insert Products
   await Product.insertMany([
     {
       _id: new mongoose.Types.ObjectId("6650d7f41f9a0c1a1a000020"),
       name: "Wireless Mouse",
       category: "Electronics",
       quantity: 120,
       threshold: 10,
       createdBy: users[1]._id, // manager
       isActive: true,
       createdAt: new Date("2025-05-03T09:00:00Z"),
       stocks: [
        { outlet: outlets[0]._id, quantity: 50 },
        { outlet: outlets[1]._id, quantity: 40 },
        { outlet: outlets[2]._id, quantity: 30 }
      ]
     },
     {
       _id: new mongoose.Types.ObjectId("6650d7f41f9a0c1a1a000021"),
       name: "USB Keyboard",
       category: "Electronics",
       quantity: 80,
       threshold: 10,
       createdBy: users[1]._id,
       isActive: true,
       createdAt: new Date("2025-05-03T09:05:00Z"),
       stocks: [
        { outlet: outlets[0]._id, quantity: 35 },
        { outlet: outlets[1]._id, quantity: 25 },
        { outlet: outlets[2]._id, quantity: 20 }
      ]
     },
     {
       _id: new mongoose.Types.ObjectId("6650d7f41f9a0c1a1a000022"),
       name: "Notebook A5",
       category: "Stationery",
       quantity: 200,
       threshold: 30,
       createdBy: users[1]._id,
       isActive: true,
       createdAt: new Date("2025-05-03T09:10:00Z"),
       stocks: [
        { outlet: outlets[0]._id, quantity: 120 },
        { outlet: outlets[1]._id, quantity: 150 },
        { outlet: outlets[2]._id, quantity: 130 }
      ]
     },
     {
       _id: new mongoose.Types.ObjectId("6650d7f41f9a0c1a1a000023"),
       name: "Office Chair",
       category: "Furniture",
       quantity: 40,
       threshold: 5,
       createdBy: users[1]._id,
       isActive: true,
       createdAt: new Date("2025-05-03T09:15:00Z"),
       stocks: [
        { outlet: outlets[0]._id, quantity: 20 },
        { outlet: outlets[1]._id, quantity: 15 },
        { outlet: outlets[2]._id, quantity: 10 }
      ]
     }
   ]);

   console.log('✅ Seeding completed.');
   process.exit();
 })
 .catch(err => {
   console.error('❌ Error:', err);
   process.exit(1);
 });


