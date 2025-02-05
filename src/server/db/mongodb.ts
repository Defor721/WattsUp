import clientPromise from "@/lib/mongodb";

/** MongoDB에서 특정 컬렉션을 가져오기 */
export async function getCollection(collectionName: string) {
  const client = await clientPromise;
  const db = client.db("wattsup");

  return db.collection(collectionName);
}

/** MongoDB의 특정 컬렉션에 데이터를 insert */
export async function insertDataToDB(collection: any, data: any) {
  const timestamp = new Date();
  await collection.insertOne({
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}
