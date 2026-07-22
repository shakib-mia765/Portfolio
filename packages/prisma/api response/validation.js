import { ZodError } from "zod";


const VALIDATION_STATUS = {
  FAILED: "validation_failed",
};


const formatValidationErrors = (
  errors = [],
) =>
  errors.map((error) => ({
    field: error.path.join("."),
    message: error.message,
  }));


export const isValidationError = (
  error,
) =>
  error instanceof ZodError;



export const createValidationError = (
  error,
) => {

  if (!isValidationError(error)) {
    return {
      status: VALIDATION_STATUS.FAILED,
      message: "Validation failed",
      errors: [],
    };
  }


  return {
    status: VALIDATION_STATUS.FAILED,
    message: "Validation failed",
    errors: formatValidationErrors(
      error.errors,
    ),
  };
};



export const validateSchema = (
  schema,
  payload,
) => {

  const result =
    schema.safeParse(payload);


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
  };
};



export const assertValid = (
  schema,
  payload,
) => {

  return schema.parse(
    payload,
  );

};


export default {
  isValidationError,
  createValidationError,
  validateSchema,
  assertValid,
};
