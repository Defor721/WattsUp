// TODO: 디비 관련 코드 분리 고민중

// import { Db, Collection } from "mongodb";

// import clientPromise from "@/lib/mongodb";

// export async function getDatabase(dbName: string): Promise<Db> {
//   const client = await clientPromise;
//   return client.db(dbName);
// }

// export async function getCollection<T extends Document>(
//   dbName: string,
//   collectionName: string,
// ): Promise<Collection<T>> {
//   const db = await getDatabase(dbName);
//   return db.collection<T>(collectionName);
// }
