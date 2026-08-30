import {type Token, TokenKind} from "@types";
import {throw_exception} from "@utils";

type Tokens = Array<Token<unknown>>;

export const lexing_rules: Record<TokenKind, RegExp> = {
    // Single-line comments (Must precede '/' operator rule to avoid misidentifying as division)
    [TokenKind.LINE_COMMENT]: /^\/\/[^\n]*/,

    // Language Keywords
    [TokenKind.K_VAR]:    /^var\b/,
    [TokenKind.K_CONST]:  /^const\b/,
    [TokenKind.K_IF]:     /^if\b/,
    [TokenKind.K_ELSE]:   /^else\b/,
    [TokenKind.K_WHEN]:   /^when\b/,
    [TokenKind.K_FOR]:    /^for\b/,
    [TokenKind.K_WHILE]:  /^while\b/,
    [TokenKind.K_FUNC]:   /^func\b/,
    [TokenKind.K_PROC]:   /^proc\b/,
    [TokenKind.K_STRUCT]: /^struct\b/,
    [TokenKind.K_RETURN]: /^return\b/,
    [TokenKind.K_TRUE]:   /^true\b/,
    [TokenKind.K_FALSE]:  /^false\b/,
    [TokenKind.K_NULL]:   /^null\b/,
    [TokenKind.K_IN]: /^in\b/,

    // Logical Operators
    [TokenKind.AND]: /^and\b/,
    [TokenKind.OR]:  /^or\b/,
    [TokenKind.NOT]: /^not\b/,

    // Identifiers and Literals
    [TokenKind.IDENTIFIER]: /^[a-zA-Z_][a-zA-Z0-9_]*/,
    [TokenKind.NUMBER]:     /^\d+(\.\d+)?/,
    [TokenKind.STRING]:     /^"([^"\\]|\\.)*"/,

    // Multi-character Operators & Symbols
    [TokenKind.EQUAL]:         /^==/,
    [TokenKind.NOT_EQUAL]:     /^!=/,
    [TokenKind.FAT_ARROW]:     /^=>/,
    [TokenKind.LESS_EQUAL]:    /^<=/,
    [TokenKind.GREATER_EQUAL]: /^>=/,
    [TokenKind.DOT_DOT]:       /^\.\./,
    [TokenKind.DOUBLE_COLON]:  /^::/,

    [TokenKind.PLUS_ASSIGN]: /^\+=/,
    [TokenKind.MINUS_ASSIGN]: /^-=/,
    [TokenKind.STAR_ASSIGN]: /^\*=/,
    [TokenKind.SLASH_ASSIGN]: /^\/=/,
    [TokenKind.PERCENT_ASSIGN]: /^%=/,

    // Single-character Operators
    [TokenKind.ASSIGN]:  /^=/,
    [TokenKind.LESS]:    /^</,
    [TokenKind.GREATER]: /^>/,
    [TokenKind.PLUS]:    /^\+/,
    [TokenKind.MINUS]:   /^-/,
    [TokenKind.STAR]:    /^\*/,
    [TokenKind.SLASH]:   /^\//,
    [TokenKind.PERCENT]: /^%/,
    [TokenKind.DOT]:     /^\./,

    // Delimiters, Groupings, and Punctuation
    [TokenKind.LBRACE]:   /^\{/,
    [TokenKind.RBRACE]:   /^}/,
    [TokenKind.LBRACKET]: /^\[/,
    [TokenKind.RBRACKET]: /^]/,
    [TokenKind.LPAREN]:   /^\(/,
    [TokenKind.RPAREN]:   /^\)/,

    [TokenKind.SEMICOLON]: /^;/,
    [TokenKind.COMMA]:     /^,/,
    [TokenKind.COLON]:     /^:/,

    // Control and Error Handlers
    [TokenKind.EOF]:     /^$/,
    [TokenKind.ILLEGAL]: /^./
};

export const tokenize = (source: string): Tokens =>
{
    const tokens: Tokens = [];
    let cursor = 0;
    let line = 1;
    let column = 1;

    while (cursor < source.length)
    {
        // ! means we are sure it's never undefined in the current context.
        const curr_char = source[cursor]!;

        if (/\s/.test(curr_char))
        {
            if (curr_char === '\n')
            {
                line++;
                column = 1;
            }
            else
            {
                column++;
            }
            cursor++;
            continue;
        }

        const substring = source.slice(cursor);

        let matched = false;
        for (const [kind, regex] of Object.entries(lexing_rules))
        {
            const match = regex.exec(substring);

            if (match)
            {
                const token_kind = kind as TokenKind;
                const value = match[0];

                if (token_kind === TokenKind.LINE_COMMENT)
                {
                    cursor += value.length;
                    column += value.length;
                    matched = true;
                    break;
                }

                if (token_kind === TokenKind.ILLEGAL)
                {
                    return throw_exception({
                        type:    'Lexer',
                        message: `Unexpected token '${value}' at line ${line}, column ${column} (position ${cursor})`
                    });
                }

                tokens.push({
                    kind: token_kind, 
                    value,
                    line,
                    column,
                    offset: cursor
                });
                
                cursor += value.length;
                column += value.length;
                matched = true;
                break;
            }
        }

        if (!matched)
        {
            // This should not happen because of ILLEGAL rule, but for safety:
            return throw_exception({
                type: 'Lexer',
                message: `Failed to match any token at line ${line}, column ${column} (position ${cursor})`
            });
        }
    }

    tokens.push({
        kind: TokenKind.EOF, 
        value: "",
        line,
        column,
        offset: cursor
    });
    return tokens;
};