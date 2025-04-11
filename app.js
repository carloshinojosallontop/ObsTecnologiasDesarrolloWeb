const express = require('express');
const mongoose = require('mongoose');

// Si MONGO_URL está definida en el entorno, se usará esa, de lo contrario se usará localhost.
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/miBaseDeDatos';

// Conexión a MongoDB usando la base de datos "miBaseDeDatos"
mongoose.connect(mongoUrl)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Definición del esquema y modelo para productos tecnológicos
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },       // SKU
  descripcion: { type: String, required: true },
  stock: { type: Number, required: true },
  precio: { type: Number, required: true }
});

// Aquí especificamos que la colección a utilizar es "Productos"
const Product = mongoose.model('Product', productSchema, 'Productos');

const app = express();
app.use(express.json());

// Ruta GET para obtener todos los productos
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta GET para obtener productos según condiciones en query
// Ejemplo: GET /products/query?id=SKU-000002
app.get('/products/query', async (req, res) => {
  try {
    const queryObj = req.query;
    const products = await Product.find(queryObj);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta PUT para actualizar (o crear) un producto
app.put('/products', async (req, res) => {
  try {
    const { filter, update } = req.body;
    if (!filter || !update) {
      return res.status(400).json({ error: 'Debes enviar "filter" y "update" en el body.' });
    }
    
    const existingProduct = await Product.findOne(filter);
    if (existingProduct) {
      const updatedProduct = await Product.findOneAndUpdate(filter, update, { new: true });
      return res.status(200).json(updatedProduct);
    } else {
      const newProductData = { ...filter, ...update };
      if (!newProductData.id) {
        return res.status(400).json({ error: 'El producto debe tener un campo "id" (SKU).' });
      }
      const newProduct = new Product(newProductData);
      await newProduct.save();
      return res.status(201).json(newProduct);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta DELETE para eliminar producto(s) según condición del query
app.delete('/products', async (req, res) => {
  try {
    const filter = req.query;
    if (Object.keys(filter).length === 0) {
      return res.status(400).json({ error: "Se requiere especificar una condición en el query." });
    }
    const result = await Product.deleteMany(filter);
    if (result.deletedCount === 0) {
      return res.status(204).send();
    } else {
      return res.status(200).json({ deletedCount: result.deletedCount });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inicialización del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
