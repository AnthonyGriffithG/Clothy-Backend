const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

app.use(cors());
app.use(express.json());

//ROUTES//

// CREATE AN ITEM

app.post('/items', async (req, res) => {
  try {
    const { name, description, price, img_url } = req.body;
    const newItem = await pool.query(
      'INSERT INTO items (name, description, price, img_url) VALUES($1, $2, $3, $4) RETURNING *',
      [name, description, price, img_url]
    );

    res.json(newItem.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

//GET ALL ITEMS

app.get('/items', async (_, res) => {
  try {
    const allItems = await pool.query('SELECT * FROM items');
    res.json(allItems.rows);
  } catch (error) {
    console.log(error.message);
  }
});

//GET AN ITEM

app.get('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    res.json(item.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

//EDIT AN ITEM

app.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, img_url, available = true } = req.body;

    const updateItem = await pool.query(
      'UPDATE items SET name = $1, description = $2, price= $3, img_url = $4, available = $5 WHERE id = $6 RETURNING *',
      [name, description, price, img_url, available, id]
    );
    res.json(updateItem.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

//DELETE AN ITEM

app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteItem = await pool.query('DELETE FROM items WHERE id = $1', [
      id,
    ]);
    res.json(deleteItem.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(5000, () => {
  console.log('server has started on port 5000');
});
