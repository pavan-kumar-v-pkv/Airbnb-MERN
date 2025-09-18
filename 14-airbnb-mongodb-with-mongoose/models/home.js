const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

// _id is automatically created by MongoDB
const homeSchema = new mongoose.Schema({
  houseName: {type: String, required: true},
  price: {type: Number, required: true},
  location: {type: String, required: true},
  rating: {type: Number, required: true},
  photo: {type: String},
  description: {type: String}
})

// homeSchema.pre('findOneAndDelete', async function(next) {
//   const home = this.getQuery()._id;
//   await Favourite.deleteMany({ houseId: home });
//   next();
// })

module.exports = mongoose.model('Home', homeSchema);
/*
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photo = photoUrl;
    this.description = description;
    this._id = _id;
    save()
    findById(homeId)
    deleteById(homeId)
}
*/
