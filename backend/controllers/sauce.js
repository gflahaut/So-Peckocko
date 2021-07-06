const fs = require("fs");
const saucesSchema = require("../models/sauces");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete req.body._id;
  const sauce = new saucesSchema({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
  });
  sauce.save();
  saucesSchema.find()
  .then((sauces)=>{
  	for (let i = 0 ; i < sauces.length ; i++){
  		saucesSchema.updateOne(
        { _id: sauces[i].id },
        {
        ...sauces[i],
  			likes: 0,
    		dislikes: 0,
    		usersLiked: [],
    		usersdisLiked: [],
      }
    	);
  	}
    res.status(201).json({ message: " Nouvelle sauce crée !"});
  })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

exports.getOneSauce = (req, res, next) => {
  saucesSchema
    .findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

exports.getAllSauce = (req, res, next) => {
  saucesSchema
    .find()
    .then((sauces) => {
      res.status(200).json([ ...sauces ]);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  saucesSchema
    .findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/img/")[1];
      fs.unlink("img/" + filename, () => {
        saucesSchema
          .deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => {
            console.log(error);
            res.status(400).json({ error });
          });
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

exports.modifySauce = (req, res, next) => {
  saucesSchema.findOne({ _id: req.params.id })
    .then(firstSauce => {
      const firstImage = firstSauce.imageUrl.split("/img/")[1];
      const sauceObject = req.file ? 
        { ...JSON.parse(req.body.sauce), 
          imageUrl: `${req.protocol}://${req.get("host")}/img/${req.file.filename}` 
        } : { 
          ...req.body 
        };
      if (req.file) {
        fs.unlink("img/" + firstImage, () => {
          saucesSchema.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce modifiée! " }))
            .catch(error => res.status(400).json({ error }));
        });
      } else {
        saucesSchema.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
          .catch(error => res.status(400).json({ error }));
      }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  saucesSchema.findOne({ _id: req.params.id})
   .then(sauce => {
      switch ( req.body.like ) {
        case 1:
          if (!sauce.userLiked.includes(req.body.userId)) {
            saucesSchema.updateOne({ _id: req.params.id }, 
              {$push: {userLiked: req.body.userId}, $inc: {likes: 1}}
            )
              .then( () => res.status(200).json({ message: "Preferences added" }))
              .catch(error => res.status(400).json({ error }));
          } 
          break;

        case 0:
          if (sauce.userLiked.includes(req.body.userId)) {
            saucesSchema.updateOne({ _id: req.params.id }, 
              {$pull: {userLiked: req.body.userId}, $inc: {likes: -1}}
            )
              .then( () => res.status(200).json({ message: "No preference" }))
              .catch(error => res.status(400).json({ error }));
          } else {
            sauce.updateOne({ _id: req.params.id }, 
              {$pull: {usersDisliked: req.body.userId}, $inc: {dislikes: -1}}
            )
              .then( () => res.status(200).json({ message: "No preference" }))
              .catch(error => res.status(400).json({ error }));
          }
          break;
        
          case -1:
          if (!sauce.userDisliked.includes(req.body.userId)) {
            saucesSchema.updateOne({ _id: req.params.id }, 
              {$push: {userDisliked: req.body.userId}, $inc: {dislikes: 1}}
            )
              .then( () => res.status(200).json({ message: "Disliked sauce" }))
              .catch(error => res.status(400).json({ error }));
          } 
          break;
      }
    })
   .catch(error => {
     console.log(error);
     res.status(500).json({ error });
   });
};