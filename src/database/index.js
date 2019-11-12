import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import Students from '../app/models/Students';
import Plans from '../app/models/Plans';
import Enrollment from '../app/models/Enrollment';
import HelpOrder from '../app/models/HelpOrder';

import databaseConfig from '../config/database';

const models = [Students, User, Enrollment, Plans, HelpOrder];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gympoint',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
