import { ZodError } from "zod";

const formatErrRes = (error: string, zodError?: ZodError) => {
    const validationErrors = zodError?.errors?.map(e => ({
        path: e.path.join("."),
        message: e.message
    }));

    return {
        error,
        details: validationErrors
    }
}

export default formatErrRes;