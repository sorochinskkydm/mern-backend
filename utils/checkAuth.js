import jwt from 'jsonwebtoken';

export default (request, response, next) => {
  //Получение токена из authorization
  const token = (request.headers.authorization || '').replace(/Bearer\s?/, '');
  if (token) {
    try {
      //Расшифровка токена
      const decodedToken = jwt.verify(token, 'someDifficultKey');
      //Добавление в request
      request.userId = decodedToken._id;
      next();
    } catch (error) {
      return response.status(403).json({
        message: 'Ошибка токена',
      });
    }
  } else {
    return response.status(403).json({
      message: 'Нет доступа к маршруту',
    });
  }
};
