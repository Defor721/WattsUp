// TODO: 디비 관련 코드 분리 고민중

// import { Collection, ObjectId } from "mongodb";

// import { getCollection } from "./database";

// export interface User extends Document {
//   _id?: ObjectId;
//   email: string;
//   password: string;
//   name: string;
//   signupType: string;
//   provider?: string;
//   companyName: string;
//   corporateNumber?: string;
//   businessNumber: string;
// }

// const collection = await getCollection<User>("wattsup", "userdata");

// export async function insertUser(userData: User) {
//   return collection.insertOne(userData);
// }

// export async function findUserByEmail(collection: Collection, email: string) {
//   return await collection.findOne({ email });
// }

// export async function findUserByBusinessNumber(
//   collection: Collection,
//   businessNumber: string,
// ) {
//   try {
//     return await collection.findOne({ businessNumber });
//   } catch (error) {
//     console.error("Find User By Business Number Error:", error);
//     throw new Error("데이터 조회 오류");
//   }
// }
