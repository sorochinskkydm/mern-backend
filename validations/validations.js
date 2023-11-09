import { body } from 'express-validator';

export const loginValidator = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен содержать минимум 5 символов').isLength({ min: 5 }),
];

export const registerValidator = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен содержать минимум 5 символов').isLength({ min: 5 }),
  body('fullname', 'Длина поля должна составлять минимум 2 символа').isLength({ min: 2 }),
  body('picture', 'Неверная ссылка на изображение').optional().isURL(),
];

export const createValidator = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
  body('tags', 'Неверный формат тэгов (укажите массив)').optional().isArray(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];
