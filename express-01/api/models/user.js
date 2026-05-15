import argon2 from "argon2";

const getUserModel = (sequelize, { DataTypes }) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Data de expiração do refresh token (para validação sem JWT)
    refreshTokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Message, { onDelete: "CASCADE" });
  };

  // Hash da senha antes de criar
  User.beforeCreate(async (user) => {
    user.password = await argon2.hash(user.password);
  });

  // Valida a senha informada contra o hash armazenado
  User.prototype.validatePassword = async function (password) {
    return await argon2.verify(this.password, password);
  };

  // Busca por username ou email
  User.findByLogin = async (login) => {
    let user = await User.findOne({ where: { username: login } });

    if (!user) {
      user = await User.findOne({ where: { email: login } });
    }

    return user;
  };

  return User;
};

export default getUserModel;