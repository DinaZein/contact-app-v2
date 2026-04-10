import * as admin from "firebase-admin";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { onCall, onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { algoliasearch } from "algoliasearch";

// Importations spécifiques pour éviter l'erreur "not callable"
import express = require("express");
import cors = require("cors");

// Initialisation de Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Initialisation d'Algolia (v5)
const client = algoliasearch("UUU2L6S742", "2bb2eacd6d70865905fe596fb5051b85");

// ==========================================
// 1. REST API avec Express (Routes CRUD)
// ==========================================
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// GET all contacts
app.get("/contacts", async (req, res) => {
  const snapshot = await db.collection("contacts").get();
  const contacts = snapshot.docs.map(doc => {
    const data = doc.data();
    return { 
      id: doc.id,       // On force l'ajout de l'ID ici
      objectID: doc.id, // On l'ajoute aussi ici par sécurité pour Algolia
      ...data 
    };
  });
  res.status(200).send(contacts);
});

// GET contact by ID
app.get("/contacts/:id", async (req, res) => {
  try {
    const doc = await db.collection("contacts").doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404).send("Contact non trouvé");
      return;
    }
    res.status(200).send({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send(error);
  }
});

// CREATE contact
app.post("/contacts", async (req, res) => {
  try {
    const contact = req.body;
    const ref = await db.collection("contacts").add(contact);
    res.status(201).send({ id: ref.id });
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE contact
// functions/src/index.ts

app.put("/contacts/:id", async (req, res) => {
  try {
    const contactId = req.params.id;
    const newData = req.body;
    
    // On retire l'id des données pour ne pas l'écraser dans le document
    delete newData.id; 
    
    await db.collection("contacts").doc(contactId).update(newData);
    res.status(200).send({ status: "Updated", id: contactId });
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE contact
app.delete("/contacts/:id", async (req, res) => {
  try {
    const contactId = req.params.id;
    await db.collection("contacts").doc(contactId).delete();
    res.status(200).send({ status: "Deleted", id: contactId });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Export de l'API REST
export const api = onRequest(app);

// ==========================================
// 2. CALLABLE FUNCTIONS (v2)
// ==========================================

// Hello World Callable
export const helloWorld = onCall(() => {
  logger.info("Hello world invoqué dans les logs !");
  return { message: "Hello from Firebase!" };
});

// Create Contact Callable
export const createContactCallable = onCall(async (request) => {
  const newContact = request.data;
  try {
    const writeResult = await db.collection("contacts").add(newContact);
    logger.info(`Contact créé via Callable: ${writeResult.id}`);
    return { id: writeResult.id, status: "success" };
  } catch (error) {
    logger.error("Erreur createContactCallable", error);
    throw new Error("Erreur lors de la création du contact");
  }
});

// ==========================================
// 3. FIRESTORE TRIGGER (Sync Algolia)
// ==========================================

export const syncContactToAlgolia = onDocumentWritten(
  "contacts/{contactId}",
  async (event) => {
    const contactId = event.params.contactId;

    // Suppression
    if (!event.data?.after.exists) {
      await client.deleteObject({
        indexName: "contacts",
        objectID: contactId,
      });
      logger.info(`Algolia: Contact supprimé (${contactId})`);
      return;
    }

    // Création ou Mise à jour
    const data = event.data.after.data();
    await client.saveObject({
      indexName: "contacts",
      body: {
        objectID: contactId,
        ...data,
      },
    });
    logger.info(`Algolia: Contact synchronisé (${contactId})`);
  }
);