import * as admin from "firebase-admin";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
// Import the specific function from the package
import { algoliasearch } from "algoliasearch";
import * as functions from "firebase-functions";
admin.initializeApp();

// Initialize the client using the function call (v5 style)
const client = algoliasearch("UUU2L6S742", "2bb2eacd6d70865905fe596fb5051b85");

// Note: In v5, you don't use .initIndex(). 
// You simply perform operations via the client or use specific methods.
// For standard indexing, it's often easiest to just use the client directly:

export const syncContactToAlgolia = onDocumentWritten(
  "contacts/{contactId}",
  async (event) => {
    const contactId = event.params.contactId;

    if (!event.data?.after) {
      // Delete record
      await client.deleteObject({
        indexName: "contacts",
        objectID: contactId,
      });
      return;
    }

    const data = event.data.after.data();

    // Save/Update record
    await client.saveObject({
      indexName: "contacts",
      body: {
        objectID: contactId,
        ...data,
      },
    });
  }
);




export const helloWorld = functions.https.onCall(() => {
  console.log("Hello world");
  return {message: "Hello from Firebase!"};
});
