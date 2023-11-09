import mongoose, { Mongoose } from 'mongoose';
import PostModel from '../models/PostModel.js';
import { response } from 'express';

export const getLastTags = async (request, response) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const lastTags = posts
      .map((item) => item.tags)
      .flat()
      .slice(0, 5);
    response.json(lastTags);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};

export const createPostController = async (request, response) => {
  try {
    const doc = new PostModel({
      title: request.body.title,
      text: request.body.text,
      tags: request.body.tags,
      imageUrl: request.body.imageUrl,
      user: request.userId,
    });

    const post = await doc.save();
    response.json(post);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const getAllController = async (request, response) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    response.status(200).json(posts);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getOneController = async (request, response) => {
  try {
    const postId = request.params.id;
    const onePost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { new: true },
    )
      .populate('user')
      .exec();
    if (!onePost) {
      return response.status(404).json({
        message: 'Не удалось найти статью',
      });
    }
    response.json(onePost);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось получить статью',
    });
  }
};

export const removePostController = async (request, response) => {
  try {
    const postId = request.params.id;
    const removedPost = await PostModel.findOneAndDelete({ _id: postId });
    if (!removedPost) {
      return response.status(404).json({
        message: 'Не удалось найти статью, вероятно ее уже не существует',
      });
    }
    response.json({
      message: 'deleted successfully',
      removedPost: removedPost._id,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось удалить статью',
    });
  }
};

export const updatePostController = async (request, response) => {
  try {
    const postId = request.params.id;
    const updatedPost = PostModel.findOneAndUpdate(
      { _id: postId },
      {
        title: request.body.title,
        text: request.body.text,
        tags: request.body.tags,
        imageUrl: request.body.imageUrl,
      },
      {
        new: true,
      },
    )
      .populate('user')
      .exec();

    if (!updatedPost) {
      return response.status(404).json({
        message: 'Не удалось найти статью',
      });
    }
    response.json({
      message: 'successfully updated',
      updatedPost: updatedPost._id,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось изменить статью',
    });
  }
};
