export enum TokenKind {
    K_VAR = "VAR",
    K_CONST = "CONST",
    K_IF = "IF",
    K_ELSE = "ELSE",
    K_WHEN = "WHEN",
    K_FOR = "FOR",
    K_WHILE = "WHILE",
    K_FUNC = "FUNC",
    K_PROC = "PROC",
    K_STRUCT = "STRUCT",
    K_RETURN = "RETURN",
    K_TRUE = "TRUE",
    K_FALSE = "FALSE",
    K_NULL = "NULL",
    K_IN = "IN",
    K_TRY = "TRY",
    K_CATCH = "CATCH",
    K_IMPORT = "IMPORT",
    K_PUB = "PUB",

    AND = "AND",
    OR = "OR",
    NOT = "NOT",

    IDENTIFIER = "IDENTIFIER",
    NUMBER = "NUMBER",
    STRING = "STRING",

    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    FAT_ARROW = "FAT_ARROW",
    LESS_EQUAL = "LESS_EQUAL",
    GREATER_EQUAL = "GREATER_EQUAL",
    DOT_DOT = "DOT_DOT",
    DOUBLE_COLON = "DOUBLE_COLON",

    ASSIGN = "ASSIGN",
    PLUS_ASSIGN = "PLUS_ASSIGN",
    MINUS_ASSIGN = "MINUS_ASSIGN",
    STAR_ASSIGN = "STAR_ASSIGN",
    SLASH_ASSIGN = "SLASH_ASSIGN",
    PERCENT_ASSIGN = "PERCENT_ASSIGN",
    LESS = "LESS",
    GREATER = "GREATER",
    PLUS = "PLUS",
    MINUS = "MINUS",
    STAR = "STAR",
    SLASH = "SLASH",
    PERCENT = "PERCENT",
    DOT = "DOT",
    CARET = "CARET",

    LBRACE = "LBRACE",
    RBRACE = "RBRACE",
    LBRACKET = "LBRACKET",
    RBRACKET = "RBRACKET",
    LPAREN = "LPAREN",
    RPAREN = "RPAREN",

    SEMICOLON = "SEMICOLON",
    COMMA = "COMMA",
    COLON = "COLON",

    LINE_COMMENT = "LINE_COMMENT",
    EOF = "EOF",
    ILLEGAL = "ILLEGAL"
}

export type Token<T> = 
{
    kind : TokenKind,
    value : T,
    line: number,
    column: number,
    offset: number,
}

