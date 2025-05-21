require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch(err => console.error('MongoDB bağlantı hatası:', err));

// Todo şeması ve modeli
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  done: { type: Boolean, default: false }
});
const Todo = mongoose.model('Todo', todoSchema);

// CRUD endpoint’leri
app.post('/todos', async (req, res) => {
  const newTodo = await Todo.create({ task: req.body.task });
  res.json(newTodo);
});

app.get('/todos', async (req, res) => {
  const list = await Todo.find();
  res.json(list);
});

app.put('/todos/:id', async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(
    req.params.id,
    { task: req.body.task, done: req.body.done },
    { new: true }
  );
  res.json(updated);
});

app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Sunucuyu başlat
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Backend ${port} portunda çalışıyor`));

