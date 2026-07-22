
import prisma from "./client.js";

import {
  apiSuccess,
  apiError,
} from "./response/response.js";

import {
  validatePayload,
} from "./validation/engine.js";

import {
  DOMAINS,
} from "./constants/domains.js";

class UnifiedPersistenceFabric {

  constructor({
    database = prisma,
    validator = validatePayload,
    domains = DOMAINS,
  } = {}) {

    this.database = database;
    this.validator = validator;
    this.domains = domains;

  }


  async execute({
    operation,
    domain = this.domains.PORTFOLIO,
    payload = null,
  }) {

    const start =
      performance.now();


    if (
      typeof operation !== "function"
    ) {
      return apiError({
        message:
          "Invalid persistence operation",
      });
    }

    if (payload) {

      const validation =
        this.validator(
          domain,
          payload,
        );


      if (!validation.valid) {

        return apiError({
          message:
            "Validation failed",

          errors:
            validation.errors,
        });

      }

    }


    try {

      const result =
        await operation(
          this.database,
        );

      return apiSuccess({

        data: result,

        meta: {

          domain,

          executionTime:
            Number(
              (
                performance.now() - start
              ).toFixed(2),
            ),

          timestamp:
            new Date()
              .toISOString(),

        },

      });


    } catch (error) {

      return apiError({

        message:
          "Persistence execution failed",

        errors: {

          code:
            error?.code ??
            "UNKNOWN_DATABASE_ERROR",

          detail:
            error?.message ??
            "Unknown error",

          domain,

        },

      });

    }

  }



  async transaction(
    callback,
    options = {},
  ) {

    try {

      const result =
        await this.database.$transaction(
          callback,
          options,
        );


      return apiSuccess({
        data: result,
      });


    } catch (error) {

      return apiError({

        message:
          "Transaction rollback",

        errors: {

          code:
            error?.code ??
            "TRANSACTION_FAILED",
        },

      });

    }

  }

}


export default UnifiedPersistenceFabric;
