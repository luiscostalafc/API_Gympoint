import Sequelize, { Model } from 'sequelize';

class Enrollment extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    // more than one realtionship the use of 'as'
    // for relationship nickname is imperative
    // being a nickname any name is acceptable
    this.belongsTo(models.Students, {
      foreignKey: 'students_id',
      as: 'students',
    });

    this.belongsTo(models.Plans, { foreignKey: 'plans_id', as: 'plans' });
  }
}

export default Enrollment;
