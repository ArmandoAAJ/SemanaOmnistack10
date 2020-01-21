const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index(request, response) {

    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    try {
      const respostaApi = await axios.get(`https://api.github.com/users/${github_username}`);

      const { name = login, avatar_url, id, bio } = respostaApi.data;

      let devExist = await Dev.findOne({
        id
      })

      if (devExist) {
        return response.status(400).json('Usuário já cadastrado');
      }

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }

      const dev = await Dev.create({
        id,
        github_username,
        bio,
        name,
        avatar_url,
        techs: techsArray,
        location
      })

      return response.json(dev);

    } catch (error) {
      return response.json('Usuario não encontrado, verifique seu user name');
    }
  },
};