const RESPONSE_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
};

const createResponse = ({
  status,
  message,
  data = null,
  meta = null,
  errors = null,
}) => ({
  status,
  message,
  data,
  meta,
  errors,
  timestamp: new Date().toISOString(),
});
export const apiSuccess = ({
  message = "Request completed successfully",
  data = null,
  meta = null,
}) =>
  createResponse({
    status: RESPONSE_STATUS.SUCCESS,
    message,
    data,
    meta,
  });
export const apiError = ({
  message = "Something went wrong",
  errors = null,
  data = null,
  meta = null,
}) =>
  createResponse({
    status: RESPONSE_STATUS.ERROR,
    message,
    data,
    meta,    errors,
  });
export const paginatedResponse = ({
  data = [],
  page = 1,
  limit = 10,
  total = 0,
}) =>
  apiSuccess({
    data,
    meta: {
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
export const validationError = (errors = []) =>
  apiError({
    message: "Validation failed",
    errors,
  });
export const notFoundError = (resource = "Resource") =>
  apiError({
    message: `${resource} not found`,
  });
export const unauthorizedError = () =>
  apiError({
    message: "Unauthorized access",
  });
export const forbiddenError = () =>
  apiError({
    message: "Forbidden action",
  });

export default {
  apiSuccess,
  apiError,
  paginatedResponse,
  validationError,
  notFoundError,
  unauthorizedError,
  forbiddenError,
};
