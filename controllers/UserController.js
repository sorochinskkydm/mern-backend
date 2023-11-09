import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import UserModel from '../models/UserModel.js';
export const registerController = async (request, response) => {
  try {
    //Проверка правильности ввода данных
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json(errors.array());
    }

    //Хэширование пароля
    const password = request.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //Создание отдельного пользователя в коллекции
    const userDocument = new UserModel({
      email: request.body.email,
      fullname: request.body.fullname,
      pictureUrl: request.body.picture,
      passwordHash: hash,
    });
    //Сохранение документа
    const user = await userDocument.save();
    //Создание токена, в котором зашифрован id пользователя
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'someDifficultKey',
      {
        expiresIn: '30d',
      },
    );

    //
    const { passwordHash, ...userData } = user._doc;
    //Ответ сервера в случае успеха
    response.json({
      message: 'successfully registered',
      ...userData,
      token,
    });
  } catch (error) {
    response.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

export const authController = async (request, response) => {
  try {
    //Выборка пользователя по email
    const user = await UserModel.findOne({ email: request.body.email });
    if (!user) {
      return response.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    //Сравнение пароля пользователя и хэшированного пароля
    const isValidPassword = await bcrypt.compare(request.body.password, user._doc.passwordHash);
    if (!isValidPassword) {
      return response.status(404).json({
        message: 'Неверный логин или пароль',
      });
    }

    //Создание нового токена при авторизации
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'someDifficultKey',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;
    response.json({
      message: 'success authorize',
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getMeController = async (request, response) => {
  try {
    //Выборка пользователя по id из БД
    const user = await UserModel.findById(request.userId);
    //Если пользователь не найден
    if (!user) {
      return response.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    //Если найден, возвращает данные из документа о пользователе
    const { passwordHash, ...userData } = user._doc;
    response.json({
      message: 'success',
      ...userData,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'something went wrong, try again later',
    });
  }
};
