const mongodb = require("../data/database");
const { ObjectId } = require("mongodb");

const getAll = async (req, res) => {
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

module.exports = { getAll, getSingle };
