import { Suggestion } from '../models/suggestModel.js';

class SuggestionController {
  async getSuggest(req, res) {
    try {
      const suggestions = await Suggestion.find();
      if (!suggestions.length) {
        res.status(404).json({ message: `Ready for your new requests` });
      } else {
        res.header('Content-Range', `items 0-${suggestions.length - 1}/${suggestions.length}`);
        res.status(201).json(suggestions);
      }
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async postSuggest(req, res) {
    try {
      const suggestion = await Suggestion.create(req.body);
      res.status(201).json(suggestion);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async deleteSuggest(req, res) {
    try {
      const { id } = req.query;
      const deleteSuggest = await Suggestion.findByIdAndDelete(id);
      if (!deleteSuggest)
        return res.status(404).json({ message: `Сannot find any suggestion with ID ${id}` });
      return res.status(200).json(`The suggestion with ID ${id} has been deleted`);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }
}

export default new SuggestionController();
