import {
    type Token,
    TokenKind,
    NodeType,
    type Program,
    type Statement,
    type Expression,
    type VariableDeclaration,
    type FunctionDeclaration,
    type ProcedureDeclaration,
    type StructDeclaration,
    type IfStatement,
    type WhenStatement,
    type ForStatement,
    type WhileStatement,
    type ReturnStatement,
    type BlockStatement,
    type ExpressionStatement,
    type BinaryExpression,
    type UnaryExpression,
    type Identifier,
    type NumericLiteral,
    type StringLiteral,
    type BooleanLiteral,
    type ArrayLiteral,
    type StructLiteral,
    type CallExpression,
    type MemberExpression,
    type IndexExpression,
    type AssignmentExpression,
    type RangeExpression,
    type WhenCase,
    type StructProperty,
    type Node, type MethodDeclaration, type StaticMemberExpression, type NullLiteral, type TryStatement,
    type ImportStatement, type TypeAnnotation, type Parameter, type StructField
} from "@types";
import {throw_exception} from "@utils";

export class Parser
{
    private readonly tokens: Token<any>[];
    private pos: number = 0;

    constructor(tokens: Token<any>[])
    {
        this.tokens = tokens;
    }

    private peek(): Token<any>
    {
        return this.tokens[this.pos]!;
    }

    private eat(): Token<any>
    {
        return this.tokens[this.pos++]!;
    }

    private match(kind: TokenKind): boolean
    {
        if (this.peek().kind === kind)
        {
            this.eat();
            return true;
        }
        return false;
    }

    private expect(kind: TokenKind, message: string): Token<any>
    {
        const token = this.peek();
        if (token.kind === kind)
        {
            return this.eat();
        }
        return throw_exception({
            type:    'Parser',
            message: `${message}. Got ${token.kind} at position ${this.pos}.`,
            line:    token.line,
            column:  token.column
        });
    }

    public parse(): Program
    {
        const body: Statement[] = [];
        while (this.peek().kind !== TokenKind.EOF)
        {
            body.push(this.parse_statement());
        }
        return {
            type: NodeType.Program,
            body
        };
    }

    private parse_statement(): Statement
    {
        // pub priority
        if (this.peek().kind === TokenKind.K_PUB)
        {
            const next = this.tokens[this.pos + 1]?.kind;
            if (next === TokenKind.K_VAR || next === TokenKind.K_CONST) return this.parse_variable_declaration();
            if (next === TokenKind.K_FUNC) return this.parse_function_declaration();
            if (next === TokenKind.K_PROC) return this.parse_procedure_declaration();
            if (next === TokenKind.K_STRUCT) return this.parse_struct_declaration();
        }

        switch (this.peek().kind)
        {
            case TokenKind.K_VAR:
            case TokenKind.K_CONST:
                return this.parse_variable_declaration();
            case TokenKind.K_FUNC:
                return this.parse_function_declaration();
            case TokenKind.K_PROC:
                return this.parse_procedure_declaration();
            case TokenKind.K_STRUCT:
                return this.parse_struct_declaration();
            case TokenKind.K_IF:
                return this.parse_if_statement();
            case TokenKind.K_WHEN:
                return this.parse_when_statement();
            case TokenKind.K_FOR:
                return this.parse_for_statement();
            case TokenKind.K_WHILE:
                return this.parse_while_statement();
            case TokenKind.K_RETURN:
                return this.parse_return_statement();
            case TokenKind.K_TRY:
                return this.parse_try_statement();
            case TokenKind.K_IMPORT:
                return this.parse_import_statement();
            case TokenKind.LBRACE:
                return this.parse_block_statement();
            case TokenKind.IDENTIFIER:
                if (this.pos + 1 < this.tokens.length && this.tokens[this.pos + 1]?.kind === TokenKind.DOUBLE_COLON)
                {
                    let offset = 2; // skip IDENTIFIER and ::
                    if (this.tokens[this.pos + offset]?.kind === TokenKind.IDENTIFIER)
                    {
                        offset++; // skip method name
                        if (this.tokens[this.pos + offset]?.kind === TokenKind.LPAREN)
                        {
                            // find matching RPAREN
                            let parenCount = 0;
                            while (this.pos + offset < this.tokens.length)
                            {
                                if (this.tokens[this.pos + offset]?.kind === TokenKind.LPAREN) parenCount++;
                                if (this.tokens[this.pos + offset]?.kind === TokenKind.RPAREN) parenCount--;
                                offset++;
                                if (parenCount === 0) break;
                            }
                            // Skip optional return type annotation: `: TypeName`
                            if (this.tokens[this.pos + offset]?.kind === TokenKind.COLON)
                            {
                                offset++; // skip ':'
                                if (this.tokens[this.pos + offset]?.kind === TokenKind.IDENTIFIER)
                                {
                                    offset++; // skip type name
                                }
                            }
                            if (this.tokens[this.pos + offset]?.kind === TokenKind.LBRACE)
                            {
                                return this.parse_method_declaration();
                            }
                        }
                    }
                }
                return this.parse_expression_statement();
            default:
                return this.parse_expression_statement();
        }
    }

    private parse_variable_declaration(): VariableDeclaration
    {
        const is_pub = this.match(TokenKind.K_PUB);
        const is_const = this.eat().kind === TokenKind.K_CONST;
        const var_or_const = is_const ? 'constant' : 'variable';
        const identifier = this.expect(TokenKind.IDENTIFIER, `Expected identifier after ${var_or_const} keyword`).value;

        let type_annotation: TypeAnnotation | undefined;
        if (this.peek().kind === TokenKind.COLON)
        {
            type_annotation = this.parse_type_annotation();
        }

        this.expect(TokenKind.ASSIGN, `Expected '=' after identifier in ${var_or_const} declaration`);
        const value = this.parse_expression();
        this.expect(TokenKind.SEMICOLON, `Expected ';' after ${var_or_const} declaration`);

        return {
            type: NodeType.VariableDeclaration,
            identifier,
            value,
            is_const,
            is_pub,
            type_annotation
        };
    }

    private has_return_statement(node: Node): boolean
    {
        if (node.type === NodeType.ReturnStatement)
        {
            return true;
        }

        if (node.type === NodeType.BlockStatement)
        {
            return (node as BlockStatement).body.some(stmt => this.has_return_statement(stmt));
        }

        if (node.type === NodeType.IfStatement)
        {
            const ifStmt = node as IfStatement;
            return this.has_return_statement(ifStmt.consequent) || (ifStmt.alternate ? this.has_return_statement(ifStmt.alternate) : false);
        }

        if (node.type === NodeType.WhenStatement)
        {
            return (node as WhenStatement).cases.some(c => this.has_return_statement(c.body));
        }

        if (node.type === NodeType.ForStatement)
        {
            return this.has_return_statement((node as ForStatement).body);
        }

        if (node.type === NodeType.WhileStatement)
        {
            return this.has_return_statement((node as WhileStatement).body);
        }

        return false;
    }

    private parse_function_declaration(): FunctionDeclaration
    {
        const is_pub = this.match(TokenKind.K_PUB);
        this.eat(); // func
        const identifier = this.expect(TokenKind.IDENTIFIER, "Expected function name").value;
        this.expect(TokenKind.LPAREN, "Expected '(' after function name");

        const parameters = this.parse_parameters();
        this.expect(TokenKind.RPAREN, "Expected ')' after parameters");

        let return_type: TypeAnnotation | undefined;
        if (this.peek().kind === TokenKind.COLON)
        {
            return_type = this.parse_type_annotation();
        }

        const body = this.parse_block_statement();

        if (!this.has_return_statement(body))
        {
            throw_exception({
                type:    "SyntaxError",
                message: `Function '${identifier}' must have a return statement.`,
                line:    this.tokens[this.pos - 1]?.line,
                column:  this.tokens[this.pos - 1]?.column
            });
        }

        return {
            type: NodeType.FunctionDeclaration,
            identifier,
            parameters,
            body,
            is_pub,
            return_type
        };
    }

    private parse_procedure_declaration(): ProcedureDeclaration
    {
        const is_pub = this.match(TokenKind.K_PUB);
        this.eat(); // proc
        const identifier = this.expect(TokenKind.IDENTIFIER, "Expected procedure name").value;
        this.expect(TokenKind.LPAREN, "Expected '(' after procedure name");

        const parameters = this.parse_parameters();
        this.expect(TokenKind.RPAREN, "Expected ')' after parameters");

        const body = this.parse_block_statement();

        if (this.has_return_statement(body))
        {
            throw_exception({
                type:    "SyntaxError",
                message: `Procedure '${identifier}' cannot have a return statement.`,
                line:    this.tokens[this.pos - 1]?.line,
                column:  this.tokens[this.pos - 1]?.column
            });
        }

        return {
            type: NodeType.ProcedureDeclaration,
            identifier,
            parameters,
            body,
            is_pub
        };
    }

    private parse_method_declaration(): MethodDeclaration
    {
        const struct_name = this.expect(TokenKind.IDENTIFIER, "Expected struct name").value;
        this.expect(TokenKind.DOUBLE_COLON, "Expected '::' after struct name");
        const identifier = this.expect(TokenKind.IDENTIFIER, "Expected method name").value;
        this.expect(TokenKind.LPAREN, "Expected '(' after method name");

        const parameters = this.parse_parameters();
        this.expect(TokenKind.RPAREN, "Expected ')' after parameters");

        let return_type: TypeAnnotation | undefined;
        if (this.peek().kind === TokenKind.COLON)
        {
            return_type = this.parse_type_annotation();
        }

        const body = this.parse_block_statement();

        return {
            type: NodeType.MethodDeclaration,
            struct_name,
            identifier,
            parameters,
            body,
            return_type
        };
    }

    private parse_struct_declaration(): StructDeclaration
    {
        const is_pub = this.match(TokenKind.K_PUB);
        this.eat(); // struct
        const identifier = this.expect(TokenKind.IDENTIFIER, "Expected struct name").value;
        this.expect(TokenKind.LBRACE, "Expected '{' after struct name");

        const fields: StructField[] = [];
        if (this.peek().kind !== TokenKind.RBRACE)
        {
            do
            {
                const name = this.expect(TokenKind.IDENTIFIER, "Expected field name").value;
                let type_annotation: TypeAnnotation | undefined;
                if (this.peek().kind === TokenKind.COLON)
                {
                    type_annotation = this.parse_type_annotation();
                }
                fields.push({name, type_annotation});
            } while (this.match(TokenKind.COMMA));
        }
        this.expect(TokenKind.RBRACE, "Expected '}' after fields");

        return {
            type: NodeType.StructDeclaration,
            identifier,
            fields,
            is_pub
        };
    }

    private parse_if_statement(): IfStatement
    {
        this.eat(); // if
        const condition = this.parse_expression(false);
        const consequent = this.parse_block_statement();
        let alternate: BlockStatement | IfStatement | undefined;

        if (this.match(TokenKind.K_ELSE))
        {
            if (this.peek().kind === TokenKind.K_IF)
            {
                alternate = this.parse_if_statement();
            }
            else
            {
                alternate = this.parse_block_statement();
            }
        }

        return {
            type: NodeType.IfStatement,
            condition,
            consequent,
            alternate
        };
    }

    private parse_when_statement(): WhenStatement
    {
        this.eat(); // when
        const expression = this.parse_expression(false);
        this.expect(TokenKind.LBRACE, "Expected '{' after when expression");
        const cases: WhenCase[] = [];
        while (this.peek().kind !== TokenKind.RBRACE)
        {
            let value: Expression | "else";
            if (this.match(TokenKind.K_ELSE))
            {
                value = "else";
            }
            else
            {
                value = this.parse_expression();
            }
            this.expect(TokenKind.FAT_ARROW, "Expected '=>' in when case");
            const body = this.parse_block_statement();
            cases.push({value, body});
        }
        this.expect(TokenKind.RBRACE, "Expected '}' after when cases");

        return {
            type: NodeType.WhenStatement,
            expression,
            cases
        };
    }

    private parse_for_statement(): ForStatement
    {
        this.eat(); // for
        const identifier = this.expect(TokenKind.IDENTIFIER, "Expected identifier in for loop").value;
        this.expect(TokenKind.K_IN, "Expected 'in' in for loop");

        // FIX: Pass false to tell the parser "do not look for struct literals here"
        const iterable = this.parse_expression(false);

        const body = this.parse_block_statement();
        return {
            type: NodeType.ForStatement,
            identifier,
            iterable,
            body
        };
    }

    private parse_while_statement(): WhileStatement
    {
        this.eat(); // while
        const condition = this.parse_expression(false);
        const body = this.parse_block_statement();

        return {
            type: NodeType.WhileStatement,
            condition,
            body
        };
    }

    private parse_return_statement(): ReturnStatement
    {
        this.eat(); // return
        const value = this.parse_expression();
        this.expect(TokenKind.SEMICOLON, "Expected ';' after return statement");

        return {
            type: NodeType.ReturnStatement,
            value
        };
    }

    private parse_block_statement(): BlockStatement
    {
        this.expect(TokenKind.LBRACE, "Expected '{' at start of block");
        const body: Statement[] = [];
        while (this.peek().kind !== TokenKind.RBRACE && this.peek().kind !== TokenKind.EOF)
        {
            body.push(this.parse_statement());
        }
        this.expect(TokenKind.RBRACE, "Expected '}' at end of block");

        return {
            type: NodeType.BlockStatement,
            body
        };
    }

    private parse_expression_statement(): ExpressionStatement
    {
        const expression = this.parse_expression();
        this.expect(TokenKind.SEMICOLON, "Expected ';' after expression statement");
        return {
            type: NodeType.ExpressionStatement,
            expression
        };
    }

    private parse_expression(allow_struct: boolean = true): Expression
    {
        return this.parse_assignment(allow_struct);
    }

    private parse_assignment(allow_struct: boolean = true): Expression
    {
        const left = this.parse_or(allow_struct);

        const assignTokens = [
            TokenKind.ASSIGN, TokenKind.PLUS_ASSIGN, TokenKind.MINUS_ASSIGN,
            TokenKind.STAR_ASSIGN, TokenKind.SLASH_ASSIGN, TokenKind.PERCENT_ASSIGN
        ];

        if (assignTokens.includes(this.peek().kind))
        {
            const operator = this.eat().value;
            const right = this.parse_assignment(allow_struct);

            return {
                type: NodeType.AssignmentExpression,
                operator,
                left,
                right,
            } as AssignmentExpression;
        }

        return left;
    }

    private parse_or(allow_struct: boolean = true): Expression
    {
        let left = this.parse_and(allow_struct);
        while (this.match(TokenKind.OR))
        {
            const right = this.parse_and(allow_struct);
            left = {
                type:     NodeType.BinaryExpression,
                left,
                right,
                operator: "or"
            } as BinaryExpression;
        }
        return left;
    }

    private parse_and(allow_struct: boolean = true): Expression
    {
        let left = this.parse_equality(allow_struct);
        while (this.match(TokenKind.AND))
        {
            const right = this.parse_equality(allow_struct);
            left = {
                type:     NodeType.BinaryExpression,
                left,
                right,
                operator: "and"
            } as BinaryExpression;
        }
        return left;
    }

    private parse_equality(allow_struct: boolean = true): Expression
    {
        let left = this.parse_relational(allow_struct);
        while (this.peek().kind === TokenKind.EQUAL || this.peek().kind === TokenKind.NOT_EQUAL)
        {
            const operator = this.eat().value;
            const right = this.parse_relational(allow_struct);
            left = {
                type: NodeType.BinaryExpression,
                left,
                right,
                operator
            } as BinaryExpression;
        }
        return left;
    }

    private parse_relational(allow_struct: boolean = true): Expression
    {
        let left = this.parse_range(allow_struct);
        while ([TokenKind.LESS, TokenKind.GREATER, TokenKind.LESS_EQUAL, TokenKind.GREATER_EQUAL].includes(this.peek().kind))
        {
            const operator = this.eat().value;
            const right = this.parse_range(allow_struct);
            left = {
                type: NodeType.BinaryExpression,
                left,
                right,
                operator
            } as BinaryExpression;
        }
        return left;
    }

    private parse_range(allow_struct: boolean = true): Expression
    {
        let left = this.parse_additive(allow_struct);
        if (this.match(TokenKind.DOT_DOT))
        {
            const end = this.parse_additive(allow_struct);
            return {
                type:  NodeType.RangeExpression,
                start: left,
                end
            } as RangeExpression;
        }
        return left;
    }

    private parse_try_statement(): TryStatement
    {
        this.eat(); // try
        const body = this.parse_block_statement();
        this.expect(TokenKind.K_CATCH, "Expected 'catch' after 'try' block");
        const catch_param = this.expect(TokenKind.IDENTIFIER, "Expected identifier after 'catch'").value;
        const catch_body = this.parse_block_statement();

        return {
            type: NodeType.TryStatement,
            body,
            catch_param,
            catch_body
        };
    }

    private parse_import_statement(): ImportStatement
    {
        this.eat(); // consume 'import'
        this.expect(TokenKind.LBRACKET, "Expected '[' after import");

        const specifiers: string[] = [];
        if (this.peek().kind !== TokenKind.RBRACKET)
        {
            do
            {
                specifiers.push(this.expect(TokenKind.IDENTIFIER, "Expected identifier in import list").value);
            } while (this.match(TokenKind.COMMA));
        }

        this.expect(TokenKind.RBRACKET, "Expected ']' after import list");
        this.expect(TokenKind.K_IN, "Expected 'in' after import list");

        const source_token = this.expect(TokenKind.STRING, "Expected module path string");
        const source = source_token.value.slice(1, -1); // Remove quotes

        this.expect(TokenKind.SEMICOLON, "Expected ';' after import statement");

        return {
            type: NodeType.ImportStatement,
            specifiers,
            source
        };
    }

    private parse_additive(allow_struct: boolean = true): Expression
    {
        let left = this.parse_multiplicative(allow_struct);
        while (this.peek().kind === TokenKind.PLUS || this.peek().kind === TokenKind.MINUS)
        {
            const operator = this.eat().value;
            const right = this.parse_multiplicative(allow_struct);
            left = {
                type: NodeType.BinaryExpression,
                left,
                right,
                operator
            } as BinaryExpression;
        }
        return left;
    }

    private parse_multiplicative(allow_struct: boolean = true): Expression
    {
        let left = this.parse_unary(allow_struct);
        while ([TokenKind.STAR, TokenKind.SLASH, TokenKind.PERCENT].includes(this.peek().kind))
        {
            const operator = this.eat().value;
            const right = this.parse_unary(allow_struct);
            left = {
                type: NodeType.BinaryExpression,
                left,
                right,
                operator
            } as BinaryExpression;
        }
        return left;
    }

    private parse_unary(allow_struct: boolean = true): Expression
    {
        if (this.match(TokenKind.NOT) || this.match(TokenKind.MINUS))
        {
            const operator = this.tokens[this.pos - 1]!.value;
            const argument = this.parse_unary(allow_struct);
            return {
                type: NodeType.UnaryExpression,
                operator,
                argument
            } as UnaryExpression;
        }
        return this.parse_postfix(allow_struct);
    }

    private parse_postfix(allow_struct: boolean = true): Expression
    {
        let left = this.parse_primary(allow_struct);

        while (true)
        {
            if (this.match(TokenKind.LPAREN))
            {
                const args: Expression[] = [];
                if (this.peek().kind !== TokenKind.RPAREN)
                {
                    do
                    {
                        args.push(this.parse_expression(true));
                    } while (this.match(TokenKind.COMMA));
                }
                this.expect(TokenKind.RPAREN, "Expected ')' after arguments");
                left = {
                    type:      NodeType.CallExpression,
                    callee:    left,
                    arguments: args
                } as CallExpression;
            }
            else if (this.match(TokenKind.LBRACKET))
            {
                const index = this.parse_expression(true);
                this.expect(TokenKind.RBRACKET, "Expected ']' after index");
                left = {
                    type:   NodeType.IndexExpression,
                    object: left,
                    index
                } as IndexExpression;
            }
            else if (this.match(TokenKind.DOT))
            {
                const property = this.expect(TokenKind.IDENTIFIER, "Expected identifier after '.'").value;
                left = {
                    type:     NodeType.MemberExpression,
                    object:   left,
                    property: {type: NodeType.Identifier, name: property} as Identifier
                } as MemberExpression;
            }
            else if (this.match(TokenKind.DOUBLE_COLON))
            {
                const property = this.expect(TokenKind.IDENTIFIER, "Expected identifier after '::'").value;
                left = {
                    type:     NodeType.StaticMemberExpression,
                    object:   left,
                    property: {type: NodeType.Identifier, name: property} as Identifier
                } as StaticMemberExpression;
            }
            else
            {
                break;
            }
        }

        return left;
    }

    private parse_primary(allow_struct: boolean = true): Expression
    {
        const token = this.peek();

        switch (token.kind)
        {
            case TokenKind.NUMBER:
                this.eat();
                return {
                    type:  NodeType.NumericLiteral,
                    value: parseFloat(token.value.replace(/_/g, ""))
                } as NumericLiteral;
            case TokenKind.STRING:
                this.eat();

                const rawValue = token.value.slice(1, -1);

                const unescapedValue = rawValue
                    .replace(/\\n/g, '\n')   // Newline
                    .replace(/\\t/g, '\t')   // Tab
                    .replace(/\\r/g, '\r')   // Carriage return
                    .replace(/\\"/g, '"')    // Double quote
                    .replace(/\\\\/g, '\\'); // Backslash

                return {
                    type:  NodeType.StringLiteral,
                    value: unescapedValue
                } as StringLiteral;
            case TokenKind.K_TRUE:
            case TokenKind.K_FALSE:
                this.eat();
                return {type: NodeType.BooleanLiteral, value: token.kind === TokenKind.K_TRUE} as BooleanLiteral;
            case TokenKind.K_NULL:
                this.eat();
                return {type: NodeType.NullLiteral} as NullLiteral;
            case TokenKind.K_STRUCT:
            case TokenKind.IDENTIFIER:
                this.eat();
                // Check for struct literal: Identifier { ... }
                if (allow_struct && this.peek().kind === TokenKind.LBRACE)
                {
                    this.eat(); // {
                    const properties: StructProperty[] = [];
                    if (this.peek().kind !== TokenKind.RBRACE)
                    {
                        do
                        {
                            const name = this.expect(TokenKind.IDENTIFIER, "Expected property name").value;
                            this.expect(TokenKind.COLON, "Expected ':' after property name");
                            const value = this.parse_expression(true);
                            properties.push({name, value});
                        } while (this.match(TokenKind.COMMA));
                    }
                    this.expect(TokenKind.RBRACE, "Expected '}' after struct properties");
                    return {
                        type:       NodeType.StructLiteral,
                        identifier: token.value,
                        properties
                    } as StructLiteral;
                }
                return {type: NodeType.Identifier, name: token.value} as Identifier;
            case TokenKind.LPAREN:
                this.eat();
                const expression = this.parse_expression(true);
                this.expect(TokenKind.RPAREN, "Expected ')' after expression");
                return expression;
            case TokenKind.LBRACKET:
                this.eat();
                const elements: Expression[] = [];
                if (this.peek().kind !== TokenKind.RBRACKET)
                {
                    do
                    {
                        elements.push(this.parse_expression(true));
                    } while (this.match(TokenKind.COMMA));
                }
                this.expect(TokenKind.RBRACKET, "Expected ']' after array elements");
                return {type: NodeType.ArrayLiteral, elements} as ArrayLiteral;
            default:
                return throw_exception({
                    type:    'Parser',
                    message: `Unexpected token ${token.kind} at position ${this.pos}`
                });
        }
    }

    private parse_type_annotation(): TypeAnnotation
    {
        this.expect(TokenKind.COLON, "Expected ':' before type annotation");
        const type_name = this.expect(TokenKind.IDENTIFIER, "Expected type name after ':'").value;
        return {
            type: NodeType.TypeAnnotation,
            name: type_name
        } as TypeAnnotation;
    }

    private parse_parameters(): Parameter[]
    {
        const parameters: Parameter[] = [];
        if (this.peek().kind !== TokenKind.RPAREN)
        {
            do
            {
                const name = this.expect(TokenKind.IDENTIFIER, "Expected parameter name").value;
                let type_annotation: TypeAnnotation | undefined;
                if (this.peek().kind === TokenKind.COLON)
                {
                    type_annotation = this.parse_type_annotation();
                }
                parameters.push({name, type_annotation});
            } while (this.match(TokenKind.COMMA));
        }
        return parameters;
    }

}
