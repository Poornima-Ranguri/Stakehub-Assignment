
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js';

// Database setup
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./stakehubs.db');

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS PendingOrderTable (
      id INTEGER PRIMARY KEY,
      buyer_qty INTEGER,
      buyer_price REAL,
      seller_price REAL,
      seller_qty INTEGER
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS CompletedOrderTable (
      id INTEGER PRIMARY KEY,
      price REAL,
      qty INTEGER
    );
  `);
});

// API development
const express = require('express');
const app = express();
app.use(express.json());

// Create Order API
app.post('/orders', (req, res) => {
  const { buyer_qty, buyer_price, seller_price, seller_qty } = req.body;
  db.run(`
    INSERT INTO PendingOrderTable (buyer_qty, buyer_price, seller_price, seller_qty)
    VALUES (?, ?, ?, ?);
  `, [buyer_qty, buyer_price, seller_price, seller_qty], (err) => {
    if (err) {
      res.status(500).send({ message: 'Error creating order' });
    } else {
      res.send({ message: 'Order created successfully' });
    }
  });
});

// Match Orders API
app.get('/match-orders', (req, res) => {
  db.all(`
    SELECT * FROM PendingOrderTable
    WHERE buyer_price >= seller_price;
  `, (err, rows) => {
    if (err) {
      res.status(500).send({ message: 'Error matching orders' });
    } else {
      rows.forEach((row) => {
        const { id, buyer_qty, buyer_price, seller_price, seller_qty } = row;
        const matchedQty = Math.min(buyer_qty, seller_qty);
        db.run(`
          INSERT INTO CompletedOrderTable (price, qty)
          VALUES (?, ?);
        `, [buyer_price, matchedQty], (err) => {
          if (err) {
            res.status(500).send({ message: 'Error completing order' });
          } else {
            db.run(`
              UPDATE PendingOrderTable
              SET buyer_qty = buyer_qty - ?, seller_qty = seller_qty - ?
              WHERE id = ?;
            `, [matchedQty, matchedQty, id], (err) => {
              if (err) {
                res.status(500).send({ message: 'Error updating pending order' });
              }
            });
          }
        });
      });
      res.send({ message: 'Orders matched successfully' });
    }
  });
});

// Get Orders API
app.get('/orders', (req, res) => {
  db.all(`
    SELECT * FROM PendingOrderTable
    UNION ALL
    SELECT * FROM CompletedOrderTable;
  `, (err, rows) => {
    if (err) {
      res.status(500).send({ message: 'Error fetching orders' });
    } else {
      res.send(rows);
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});




function Home() {
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [priceChart, setPriceChart] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/orders')
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3000/match-orders')
      .then((response) => {
        setCompletedOrders(response.data);
        const priceData = completedOrders.map((order) => order.price);
        const qtyData = completedOrders.map((order) => order.qty);
        const ctx = document.getElementById('price-chart').getContext('2d');
        setPriceChart(new Chart(ctx, {
          type: 'line',
          data: {
            labels: priceData,
            datasets: [{
              label: 'Price',
              data: qtyData,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [


export default Home