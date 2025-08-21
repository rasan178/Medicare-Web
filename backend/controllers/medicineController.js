const Medicine = require('../models/Medicine');

exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.addMedicine = async (req, res) => {
  const { name, brand, dosage, price, stock, category, prescriptionRequired, description, image } = req.body;
  try {
    const medicine = new Medicine({ name, brand, dosage, price, stock, category, prescriptionRequired, description, image });
    await medicine.save();
    res.json({ msg: 'Medicine added' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateMedicine = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    await Medicine.findByIdAndUpdate(id, updates);
    res.json({ msg: 'Medicine updated' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteMedicine = async (req, res) => {
  const { id } = req.params;
  try {
    await Medicine.findByIdAndDelete(id);
    res.json({ msg: 'Medicine deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
