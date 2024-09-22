import { Client, Account, Databases, ID } from "appwrite";

const appwriteApi = process.env.REACT_APP_APPWRITE_END_POINT;
const projectId = process.env.REACT_APP_PROJECT_ID;

export const client = new Client()
    .setEndpoint(appwriteApi)
    .setProject(projectId);

// Initialize Account and Databases
export const account = new Account(client);
export const databases = new Databases(client);
export { ID };
