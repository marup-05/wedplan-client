
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { MongoClient, ObjectId } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string);
const db = client.db("wedPlan");
const users = db.collection("user");

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "customer",
        input: true,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: user.role === "vendor" ? "vendor" : "customer",
            },
          };
        },
      },
    },

    session: {
      create: {
        before: async (session) => {
          const user = await users.findOne({
            _id: new ObjectId(session.userId),
          });

          if (user?.isBlocked === true) {
            throw new APIError("FORBIDDEN", {
              message: "Your account has been blocked by the admin.",
            });
          }

          return { data: session };
        },
      },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
