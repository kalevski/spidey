import Model, { STRING } from 'sequelize';

export default {
    data: {
        type: STRING,
        allowNull: true
    },
    
    url: {
        type: STRING,
        allowNull: false
    },
    
    html: {
        type: STRING,
        allowNull: false
    },
    
    hash: {
        type: STRING,
        allowNull: false,
        unique: true
    }
};
