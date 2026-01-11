import expressAsyncHandler from "express-async-handler";
import { type NextFunction, type Request, type Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

export const catchFileUploadError = expressAsyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("🔥 Upload profile validation errors:", errors.array());
      throw createHttpError(400, {
        message: "Validation error!",
        data: {
          errors: errors.array(),
        },
      });
    }

    next();
  }
);
