const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const userSchema = require("../models/users");
const mask = require ("./mask");

// Inscription d'un utilisateur
exports.signup = (req, res, next) => {
  // hashage du mot de passe avec 10 itérations
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Après obtention du hash
      // Formatage des données de l'utilisateur
      const user = new userSchema({
        userId: req.body._id,
        email: mask.maskEmail(req.body.email),
        password: hash,
      });
      // Tentative d'enregistrement en base de l'utilisateur
      user.save()
        .then(() => res.status(201).json({ message: "Utilisateur Crée !" }))
        .catch((error) => {
          console.log(error);
          res.status(400).json({ error });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

// Connexion d'un utilisateur
exports.login = (req, res, next) => {
  // Recherche de l'utilisateur en base en utilisant l'email qu'il a renseigné
  userSchema
    .findOne({ email: mask.maskEmail(req.body.email)})
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      // Déchiffrement du mot de passe et vérification
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            message: "Authentification réussie, Bienvenue !",
            token: jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
              expiresIn: "2h",
            }),
          });
        })
        .catch((error) => { // Echec du déchiffrement
          console.log(error);
          res.status(500).json({ error });
        });
    })
    .catch((error) => { // Echec de la recherche de l'utilisateur
      console.log(error);
      res.status(500).json({ error });
    });
};
