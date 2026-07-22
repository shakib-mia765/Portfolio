import { ZodError } from "zod";


const VALIDATION_STATUS = Object.freeze({
  FAILED: "validation_failed",
});


const formatValidationErrors = (errors = []) =>
  errors.map(({ path, message }) => ({
    field: path.join("."),
    message,
  }));


export const isValidationError = (error) =>
  error instanceof ZodError ||
  error?.name === "ZodError";


export const createValidationError = (error) => {

  const errors = isValidationError(error)
    ? formatValidationErrors(
        error.issues ?? error.errors,
      )
    : [];


  return {
    status: VALIDATION_STATUS.FAILED,
    message: "Validation failed",
    data: null,
    meta: null,
    errors,
    timestamp: new Date().toISOString(),
  };
};


export const validateSchema = (
  schema,
  payload,
) => {

  const result = schema.safeParse(payload);


  if (!result.success) {

    return {
      success: false,
      error: createValidationError(
        result.error,
      ),
    };

  }


  return {
    success: true,
    data: result.data,
    error: null,
  };
};


export const validateOrThrow = (
  schema,
  payload,
) =>
  schema.parse(payload);



export default {
  isValidationError,
  createValidationError,
  validateSchema,
  validateOrThrow,
};
