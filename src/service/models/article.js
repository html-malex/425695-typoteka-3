'use strict';

const {DataTypes, Model} = require('sequelize');

class Article extends Model {}

const define = (sequelize) => Article.init({
  announce: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  picture: DataTypes.STRING,
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullText: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Article',
  tableName: 'Articles'
});

module.exports = define;
