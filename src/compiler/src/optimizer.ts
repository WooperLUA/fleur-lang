import {
    type BinaryExpression, type BlockStatement,
    type Expression, type ExpressionStatement, type ForStatement, type FunctionDeclaration, type IfStatement,
    type MethodDeclaration,
    NodeType,
    type NumericLiteral, type ProcedureDeclaration, type ReturnStatement, type Statement,
    type StringLiteral, type TryStatement, type VariableDeclaration, type WhenStatement, type WhileStatement
} from "@types";

const NO_OP_STATEMENT: ExpressionStatement = {
    type: NodeType.ExpressionStatement,
    expression: { type: NodeType.NullLiteral } as any
};

const optimize_expression = (expr: Expression): Expression =>
{
    if (expr.type === NodeType.BinaryExpression)
    {
        const bin_expr = expr as BinaryExpression;
        const left = optimize_expression(bin_expr.left);
        const right = optimize_expression(bin_expr.right);

        if (left.type === NodeType.NumericLiteral && right.type === NodeType.NumericLiteral)
        {
            const l_val = (left as NumericLiteral).value;
            const r_val = (right as NumericLiteral).value;

            switch (bin_expr.operator)
            {
                case "*":
                    if (l_val === 0 || r_val === 0)
                    {
                        return {type: NodeType.NumericLiteral, value: 0} as NumericLiteral;
                    }
                    if (l_val === 1) return right;
                    if (r_val === 1) return left;
                    break;
                case "+":
                    if (l_val === 0) return right;
                    if (r_val === 0) return left;
                    break;
            }
        }

        if (bin_expr.operator === "+" && left.type === NodeType.StringLiteral && right.type === NodeType.StringLiteral)
        {
            const combined = (left as StringLiteral).value + (right as StringLiteral).value;
            return {type: NodeType.StringLiteral, value: combined} as StringLiteral;
        }

        return {...bin_expr, left, right} as BinaryExpression;
    }

     return expr;
};

export const optimize_statement = (stmt: Statement): Statement =>
{
    switch (stmt.type)
    {
        case NodeType.BlockStatement:
        {
            const block = stmt as BlockStatement;
            const optimized_body: Statement[] = [];
            let has_returned = false;

            for (const s of block.body)
            {
                if (has_returned)
                {
                    // Skip anything after a return statement
                    continue;
                }
                const optimized = optimize_statement(s);
                optimized_body.push(optimized);

                if (optimized.type === NodeType.ReturnStatement)
                {
                    has_returned = true;
                }
            }

            if (optimized_body.length === 0)
            {
                return NO_OP_STATEMENT;
            }

            return { ...block, body: optimized_body } as BlockStatement;
        }

        case NodeType.VariableDeclaration:
        {
            const var_decl = stmt as VariableDeclaration;
            return {
                ...var_decl,
                value: optimize_expression(var_decl.value)
            } as VariableDeclaration;
        }

        case NodeType.IfStatement:
        {
            const if_stmt = stmt as IfStatement;
            const optimized_condition = optimize_expression(if_stmt.condition);

            // If the condition is a hardcoded boolean, resolve it at compile-time
            if (optimized_condition.type === NodeType.BooleanLiteral)
            {
                const val = (optimized_condition as any).value;
                if (val)
                {
                    return optimize_statement(if_stmt.consequent);
                }
                else if (if_stmt.alternate)
                {
                    return optimize_statement(if_stmt.alternate);
                }
                else
                {
                    // if(false) with no else -> completely erased
                    return NO_OP_STATEMENT
                }
            }

            return {
                ...if_stmt,
                condition: optimized_condition,
                consequent: optimize_statement(if_stmt.consequent) as BlockStatement,
                alternate: if_stmt.alternate ? optimize_statement(if_stmt.alternate) as any : undefined
            } as IfStatement;
        }

        case NodeType.WhileStatement:
        {
            const while_stmt = stmt as WhileStatement;
            const optimized_condition = optimize_expression(while_stmt.condition);

            // while(false) is dead code, erase it entirely
            if (optimized_condition.type === NodeType.BooleanLiteral && !(optimized_condition as any).value)
            {
                return NO_OP_STATEMENT;
            }

            return {
                ...while_stmt,
                condition: optimized_condition,
                body: optimize_statement(while_stmt.body) as BlockStatement
            } as WhileStatement;
        }

        case NodeType.WhenStatement:
        {
            const when_stmt = stmt as WhenStatement;
            return {
                ...when_stmt,
                expression: optimize_expression(when_stmt.expression),
                cases: when_stmt.cases.map(c => ({
                    value: c.value === "else" ? "else" : optimize_expression(c.value),
                    body: optimize_statement(c.body) as BlockStatement
                }))
            } as WhenStatement;
        }

        case NodeType.ForStatement:
        {
            const for_stmt = stmt as ForStatement;
            return {
                ...for_stmt,
                iterable: optimize_expression(for_stmt.iterable),
                body: optimize_statement(for_stmt.body) as BlockStatement
            } as ForStatement;
        }

        case NodeType.ReturnStatement:
        {
            const ret_stmt = stmt as ReturnStatement;
            return {
                ...ret_stmt,
                value: optimize_expression(ret_stmt.value)
            } as ReturnStatement;
        }

        case NodeType.ExpressionStatement:
        {
            const expr_stmt = stmt as ExpressionStatement;
            return {
                ...expr_stmt,
                expression: optimize_expression(expr_stmt.expression)
            } as ExpressionStatement;
        }

        case NodeType.TryStatement:
        {
            const try_stmt = stmt as TryStatement;
            return {
                ...try_stmt,
                body: optimize_statement(try_stmt.body) as BlockStatement,
                catch_body: optimize_statement(try_stmt.catch_body) as BlockStatement
            } as TryStatement;
        }

        case NodeType.FunctionDeclaration:
        {
            const func_decl = stmt as FunctionDeclaration;
            return { ...func_decl, body: optimize_statement(func_decl.body) as BlockStatement } as FunctionDeclaration;
        }

        case NodeType.ProcedureDeclaration:
        {
            const proc_decl = stmt as ProcedureDeclaration;
            return { ...proc_decl, body: optimize_statement(proc_decl.body) as BlockStatement } as ProcedureDeclaration;
        }

        case NodeType.MethodDeclaration:
        {
            const meth_decl = stmt as MethodDeclaration;
            return { ...meth_decl, body: optimize_statement(meth_decl.body) as BlockStatement } as MethodDeclaration;
        }

        default:
            return stmt;
    }
};