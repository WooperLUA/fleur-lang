import {TokenKind} from "@types";

const TOKEN_LEXEMES: Partial<Record<TokenKind, string>> = {
    [TokenKind.K_VAR]:      "var",
    [TokenKind.K_CONST]:    "const",
    [TokenKind.K_IF]:       "if",
    [TokenKind.K_ELSE]:     "else",
    [TokenKind.K_WHEN]:     "when",
    [TokenKind.K_FOR]:      "for",
    [TokenKind.K_WHILE]:    "while",
    [TokenKind.K_FUNC]:     "func",
    [TokenKind.K_PROC]:     "proc",
    [TokenKind.K_STRUCT]:   "struct",
    [TokenKind.K_RETURN]:   "return",
    [TokenKind.K_TRUE]:     "true",
    [TokenKind.K_FALSE]:    "false",
    [TokenKind.K_NULL]:     "null",
    [TokenKind.K_IN]:       "in",
    [TokenKind.K_TRY]:      "try",
    [TokenKind.K_CATCH]:    "catch",
    [TokenKind.K_IMPORT]:   "import",
    [TokenKind.K_PUB]:      "pub",
    [TokenKind.K_BREAK]:    "break",
    [TokenKind.K_CONTINUE]: "continue",

    [TokenKind.AND]:  "and",
    [TokenKind.OR]:   "or",
    [TokenKind.XOR]:  "xor",
    [TokenKind.BAND]: "band",
    [TokenKind.BOR]:  "bor",
    [TokenKind.BXOR]: "bxor",
    [TokenKind.BSHL]: "bshl",
    [TokenKind.BSHR]: "bshr",
    [TokenKind.NOT]:  "not",

    [TokenKind.EQUAL]:             "==",
    [TokenKind.NOT_EQUAL]:         "!=",
    [TokenKind.FAT_ARROW]:         "=>",
    [TokenKind.LESS_EQUAL]:        "<=",
    [TokenKind.GREATER_EQUAL]:     ">=",
    [TokenKind.DOT_DOT]:           "..",
    [TokenKind.DOUBLE_COLON]:      "::",

    [TokenKind.PLUS_ASSIGN]:    "+=",
    [TokenKind.MINUS_ASSIGN]:   "-=",
    [TokenKind.STAR_ASSIGN]:    "*=",
    [TokenKind.SLASH_ASSIGN]:   "/=",
    [TokenKind.PERCENT_ASSIGN]: "%=",
    [TokenKind.CARET_ASSIGN]:   "^=",
    [TokenKind.QUESTION_QUESTION_ASSIGN]: "??=",

    [TokenKind.QUESTION_QUESTION]:        "??",
    [TokenKind.ASSIGN]:   "=",
    [TokenKind.LESS]:     "<",
    [TokenKind.GREATER]:  ">",
    [TokenKind.PLUS]:     "+",
    [TokenKind.MINUS]:    "-",
    [TokenKind.STAR]:     "*",
    [TokenKind.SLASH]:    "/",
    [TokenKind.PERCENT]:  "%",
    [TokenKind.DOT]:      ".",
    [TokenKind.CARET]:    "^",
    [TokenKind.QUESTION]: "?",

    [TokenKind.LBRACE]:   "{",
    [TokenKind.RBRACE]:   "}",
    [TokenKind.LBRACKET]: "[",
    [TokenKind.RBRACKET]: "]",
    [TokenKind.LPAREN]:   "(",
    [TokenKind.RPAREN]:   ")",

    [TokenKind.SEMICOLON]: ";",
    [TokenKind.COMMA]:     ",",
    [TokenKind.COLON]:     ":"
};

const SUGGESTABLE_TOKENS: string[] = [...new Set(
    Object.values(TOKEN_LEXEMES).filter((value): value is string => typeof value === "string")
)];

export const token_lexeme = (kind: TokenKind): string | undefined => TOKEN_LEXEMES[kind];

const levenshtein = (a: string, b: string): number =>
{
    if (a === b) return 0;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    let previous = Array.from({length: b.length + 1}, (_, index) => index);
    let current = new Array<number>(b.length + 1);

    for (let i = 1; i <= a.length; i++)
    {
        current[0] = i;

        for (let j = 1; j <= b.length; j++)
        {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            current[j] = Math.min(
                previous[j]! + 1,
                current[j - 1]! + 1,
                previous[j - 1]! + cost
            );
        }

        [previous, current] = [current, previous];
    }

    return previous[b.length]!;
};

export const is_similar_token = (left: unknown, right: unknown): boolean =>
{
    if (typeof left !== "string" || typeof right !== "string") return false;

    const a = left.trim().toLowerCase();
    const b = right.trim().toLowerCase();

    if (a.length === 0 || b.length === 0 || a === b) return false;

    if (Math.min(a.length, b.length) === 1)
    {
        // A lone number/letter should not be matched against punctuation just because
        // they are one edit apart (e.g. `1` vs `;`).
        const single = a.length === 1 ? a : b;
        const other = a.length === 1 ? b : a;
        const word_character = /^[a-z0-9_]$/i;

        if (word_character.test(single) !== word_character.test(other[0]!))
        {
            return false;
        }

        return levenshtein(a, b) <= 1;
    }

    return levenshtein(a, b) <= 2;
};

export const suggest_tokens = (value: unknown, limit: number = 3): string[] =>
{
    if (typeof value !== "string") return [];

    const needle = value.trim().toLowerCase();
    if (needle.length === 0) return [];

    const single_character = needle.length === 1;
    const max_distance = needle.length <= 3 ? 1 : 2;
    const matches: Array<{ token: string; distance: number }> = [];

    for (const token of SUGGESTABLE_TOKENS)
    {
        if (token === needle) continue;

        if (single_character)
        {
            if (token.length > 1 && token.startsWith(needle))
            {
                matches.push({token, distance: token.length - 1});
            }
            continue;
        }

        const distance = levenshtein(needle, token);
        if (distance <= max_distance)
        {
            matches.push({token, distance});
        }
    }

    matches.sort((a, b) =>
        a.distance - b.distance ||
        a.token.length - b.token.length ||
        a.token.localeCompare(b.token)
    );

    return matches.slice(0, limit).map(match => match.token);
};

export const format_token_suggestions = (value: unknown, limit: number = 3): string =>
{
    const suggestions = suggest_tokens(value, limit);
    if (suggestions.length === 0) return "";

    const formatted = suggestions.map(token => `'${token}'`);

    if (formatted.length === 1)
    {
        return ` Did you mean ${formatted[0]}?`;
    }

    return ` Did you mean one of ${formatted.join(", ")}?`;
};
