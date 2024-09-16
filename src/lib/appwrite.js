import { Client, Databases, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66e7408b000869012839"); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
