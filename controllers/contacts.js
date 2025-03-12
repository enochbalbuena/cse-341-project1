const mongodb = require("../data/database");
const { ObjectId } = require("mongodb");

const getAll = async (req, res) => {
  //#swagger.tags=['Contacts']
  try {
    console.log("📡 Fetching all contacts...");
    const db = mongodb.getDatabase();

    if (!db) {
      console.error("❌ Database connection is undefined!");
      return res.status(500).json({ error: "Database not connected" });
    }

    const contacts = await db.collection("contacts").find().toArray();
    console.log(`✅ Retrieved ${contacts.length} contacts.`);
    
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(contacts);
  } catch (error) {
    console.error("❌ Error retrieving contacts:", error);
    res.status(500).json({ error: "Error retrieving contacts" });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags=['Contacts']
  try {
    const contactId = req.params.id;
    console.log(`📡 Fetching contact with ID: ${contactId}`);
    
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({ error: "Invalid contact ID" });
    }

    const db = mongodb.getDatabase();
    const contact = await db.collection("contacts").findOne({ _id: new ObjectId(contactId) });

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(contact);
  } catch (error) {
    console.error("❌ Error retrieving contact:", error);
    res.status(500).json({ error: "Error retrieving contact" });
  }
};

const createContact = async (req, res) => {
  //#swagger.tags=['Contacts']
  try {
    const db = mongodb.getDatabase();
    const newContact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    const result = await db.collection("contacts").insertOne(newContact);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error creating contact" });
  }
};

const updateContact = async (req, res) => {
  //#swagger.tags=['Contacts']
  try {
    const contactId = req.params.id;
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({ error: "Invalid contact ID" });
    }

    const db = mongodb.getDatabase();
    const updatedContact = {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
      }
    };

    const result = await db.collection("contacts").updateOne({ _id: new ObjectId(contactId) }, updatedContact);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json({ message: "Contact updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating contact" });
  }
};

const deleteContact = async (req, res) => {
  //#swagger.tags=['Contacts']
  try {
    const contactId = req.params.id;
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({ error: "Invalid contact ID" });
    }

    const db = mongodb.getDatabase();
    const result = await db.collection("contacts").deleteOne({ _id: new ObjectId(contactId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting contact" });
  }
};

module.exports = { getAll, getSingle, createContact, updateContact, deleteContact };
