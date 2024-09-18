import { Client, Account, Databases } from "appwrite";

// Initialize the AppWrite client
export const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your AppWrite endpoint
    .setProject('66eaae17000915bf59a5'); // Your project ID

// Initialize Account and Databases
export const account = new Account(client);
export const databases = new Databases(client);

export { ID } from 'appwrite';
