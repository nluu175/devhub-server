import { GraphQLError } from "graphql";
import { User } from "../../models/User";
import { userQueries } from "../../resolvers/users/queries";

jest.mock("../../models/User");
jest.mock("../../config/logger");

describe("User Queries", () => {
  const mockUsers = [
    {
      id: "1",
      username: "testuser1",
      email: "test1@example.com",
      bio: "Test bio 1",
    },
    {
      id: "2",
      username: "testuser2",
      email: "test2@example.com",
      bio: "Test bio 2",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("users query", () => {
    it("should throw error if not authenticated", async () => {
      const context = { isAuthenticated: false };

      await expect(userQueries.users(null, {}, context)).rejects.toThrow(
        "Not authenticated"
      );
    });

    it("should return all users when authenticated", async () => {
      // Mock the User.find() method
      (User.find as jest.Mock).mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockUsers),
      }));

      const context = { isAuthenticated: true };

      const result = await userQueries.users(null, {}, context);
      expect(result).toEqual(mockUsers);
    });

    it("should handle database errors", async () => {
      (User.find as jest.Mock).mockImplementation(() => ({
        exec: jest.fn().mockRejectedValue(new Error("Database error")),
      }));

      const context = { isAuthenticated: true };

      await expect(userQueries.users(null, {}, context)).rejects.toThrow(
        new GraphQLError("Failed to fetch users")
      );
    });
  });

  describe("user query", () => {
    it("should throw error if not authenticated", async () => {
      const context = { isAuthenticated: false };

      await expect(
        userQueries.user(null, { id: "1" }, context)
      ).rejects.toThrow("Not authenticated");
    });

    it("should return user by id when authenticated", async () => {
      const mockUser = mockUsers[0];
      (User.findById as jest.Mock).mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockUser),
      }));

      const context = { isAuthenticated: true };

      const result = await userQueries.user(null, { id: "1" }, context);
      expect(result).toEqual(mockUser);
    });

    it("should throw not found error for non-existent user", async () => {
      (User.findById as jest.Mock).mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      const context = { isAuthenticated: true };

      await expect(
        userQueries.user(null, { id: "999" }, context)
      ).rejects.toThrow(new GraphQLError("User not found"));
    });

    it("should handle database errors", async () => {
      (User.findById as jest.Mock).mockImplementation(() => ({
        exec: jest.fn().mockRejectedValue(new Error("Database error")),
      }));

      const context = { isAuthenticated: true };

      await expect(
        userQueries.user(null, { id: "1" }, context)
      ).rejects.toThrow(new GraphQLError("Failed to fetch user"));
    });
  });
});
