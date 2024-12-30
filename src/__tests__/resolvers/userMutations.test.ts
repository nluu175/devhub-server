import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";
import { userMutations } from "../../resolvers/users/mutations.js";

jest.mock("../../models/User");
jest.mock("jsonwebtoken");
jest.mock("../../config/logger");

describe("User Mutations", () => {
  const mockUser = {
    _id: "123",
    username: "testuser",
    email: "test@example.com",
    comparePassword: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addUser", () => {
    const input = {
      username: "newuser",
      email: "new@example.com",
      password: "password123",
    };

    it("throws error if not authenticated", async () => {
      await expect(
        userMutations.addUser(undefined, { input }, { isAuthenticated: false })
      ).rejects.toThrow("Not authenticated");
    });

    it("creates user when authenticated", async () => {
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await userMutations.addUser(
        undefined,
        { input },
        { isAuthenticated: true }
      );

      expect(User.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockUser);
    });

    it("handles creation errors", async () => {
      (User.create as jest.Mock).mockRejectedValue(new Error("DB Error"));

      await expect(
        userMutations.addUser(undefined, { input }, { isAuthenticated: true })
      ).rejects.toThrow("Failed to create user");
    });
  });

  describe("login", () => {
    const loginInput = {
      email: "test@example.com",
      password: "password123",
    };

    it("returns token and user on successful login", async () => {
      (User.findOne as jest.Mock).mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockUser),
      }));
      mockUser.comparePassword.mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token123");

      const result = await userMutations.login(undefined, {
        input: loginInput,
      });

      expect(result).toEqual({
        token: "token123",
        user: mockUser,
      });
    });

    it("throws error for invalid email", async () => {
      (User.findOne as jest.Mock).mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      await expect(
        userMutations.login(undefined, { input: loginInput })
      ).rejects.toThrow(new GraphQLError("Invalid email or password"));
    });

    it("throws error for invalid password", async () => {
      (User.findOne as jest.Mock).mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockUser),
      }));
      mockUser.comparePassword.mockResolvedValue(false);

      await expect(
        userMutations.login(undefined, { input: loginInput })
      ).rejects.toThrow(new GraphQLError("Invalid email or password"));
    });

    it("handles password comparison errors", async () => {
      (User.findOne as jest.Mock).mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockUser),
      }));
      mockUser.comparePassword.mockRejectedValue(new Error("Comparison error"));

      await expect(
        userMutations.login(undefined, { input: loginInput })
      ).rejects.toThrow();
    });
  });
});
