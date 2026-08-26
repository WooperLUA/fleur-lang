type ExceptionType = "InvalidArgument"
    | "MissingArgument"
    | "OutOfBounds"
    | "Lexer"
    | "Parser"
    | "Semantics"
    | "Runtime"
    | "SyntaxError"
    | "Generic"

export type Exception<T> = {
    type: ExceptionType,
    message: string,
    metadata?: string,
    line?: number,
    column?: number
}