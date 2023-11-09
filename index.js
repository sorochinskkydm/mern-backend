import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { registerValidator, loginValidator, createValidator } from './validations/validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

//Создает express приложение
const app = express();
const PORT = 4445;
//Подключение к БД MongoDB
mongoose
  .connect(
    'mongodb+srv://sorochinskkydm:wwwwww@cluster0.xvskprv.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB OK'))
  .catch(() => console.log("DB is'nt OK"));

//Позволяет приложению читать JSON
app.use(express.json());
//Позволяет получать статичные файлы
app.use('/uploads', express.static('uploads'));
//Отключает политику CORS
app.use(cors());

//Позволяет работать с изображениями из request
const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, 'uploads');
  },
  filename: (request, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

//Auth&Registration routes
app.post('/auth/register', registerValidator, UserController.registerController);
app.post('/auth/login', loginValidator, UserController.authController);
app.get('/auth/me', checkAuth, UserController.getMeController);

//CRUD routes
app.get('/posts', PostController.getAllController);
app.get('/posts/:id', PostController.getOneController);
app.get('/tags', PostController.getLastTags);
app.post('/posts', checkAuth, createValidator, PostController.createPostController);
app.delete('/posts/:id', checkAuth, createValidator, PostController.removePostController);
app.patch('/posts/:id', checkAuth, createValidator, PostController.updatePostController);

//Multer route
app.post('/upload', checkAuth, upload.single('image'), (request, response) => {
  response.json({
    url: `/uploads/${request.file.originalname}`,
  });
});

//Запуск веб-сервера
app.listen(PORT, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log(`Server OK`);
});
