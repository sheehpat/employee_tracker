const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Config/connection');

class Department extends Model {}

Department.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(30),
  },
},
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'department'
  }
);

class Role extends Model {}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          }, 
        title: {
            type: DataTypes.STRING(30),
        },
        salary: {
            type: DataTypes.DECIMAL
        },
        department_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'department',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'role'
      },
);

class Employee extends Model {}

Employee.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
        first_name: {
            type: DataTypes.STRING(30),
        },
        last_name: {
            type: DataTypes.STRING(30),
        },
        role_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'role',
                key: 'id',
            },
        },
        manager_id: {
            type: DataTypes.INTEGER,
        }
    }
)

module.exports = { Department, Role, Employee };