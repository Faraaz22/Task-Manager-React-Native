import { RequestHandler } from "express";
import { signupUseCase } from "./usecases/signup.usecase";
import { loginUseCase } from "./usecases/login.usecase";
import { tokenBlacklist } from "../../utils/tokenBlacklist";

export const authController = {
  signup: (async (req, res, next) => {
    try {
      const result = await signupUseCase(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }) as RequestHandler,

  login: (async (req, res, next) => {
    try {
      const result = await loginUseCase(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }) as RequestHandler,

  logout: (async (req, res, next) => {
    try {
      if (req.token && req.tokenExp) {
        tokenBlacklist.revoke(req.token, req.tokenExp);
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }) as RequestHandler,
};
