'use strict';

const {DataTypes, Model} = require('sequelize');

class Comment extends Model {}

const define = (sequelize) => Comment.init({
  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Comment',
  tableName: 'Comments'
});

module.exports = define;
