import {
    type Program,
    type Statement,
    type Expression,
    NodeType,
    RuntimeValueType,
    type RuntimeValue,
    type ArrayValue,
    type StructValue,
    type FunctionValue,
    type ProcedureValue,
    type ReturnValue,
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
    type MethodDeclaration,
    type StaticMemberExpression,
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
    type AssignmentExpression, type NumberValue,
    type StringValue,
    type BooleanValue,
    type NativeFunctionValue, type RangeExpression, type SetValue,
} from "@types";
import {throw_exception, stringify_value, is_equal} from "@utils";
import {setup_stdlib} from "./stdlib";
import {setup_data_structures} from "./data-structures";

export class Environment
{
    private readonly parent?: Environment;
    private variables: Record<string, RuntimeValue>;
    private constants: Set<string>;
    private methods: Map<string, Map<string, FunctionValue>>;

    constructor(parent?: Environment)
    {
        this.parent = parent;
        // Weird quirk, but I use this instead of {} because then it would have a
        // prototype with methods, but we only want a Map like record
        this.variables = Object.create(null);
        this.constants = new Set();
        this.methods = new Map();
    }

    public register_method(struct_name: string, method_name: string, value: FunctionValue)
    {
        if (!this.methods.has(struct_name))
        {
            this.methods.set(struct_name, new Map());
        }
        this.methods.get(struct_name)!.set(method_name, value);
    }

    public get_methods(struct_name: string): Map<string, FunctionValue>
    {
        const all_methods = new Map<string, FunctionValue>();

        // Collect methods from parents first (less specific)
        if (this.parent)
        {
            const parent_methods = this.parent.get_methods(struct_name);
            parent_methods.forEach((v, k) => all_methods.set(k, v));
        }

        // Then add/overwrite with own methods (more specific)
        if (this.methods.has(struct_name))
        {
            this.methods.get(struct_name)!.forEach((v, k) => all_methods.set(k, v));
        }

        return all_methods;
    }

    public declare(name: string, value: RuntimeValue, is_const: boolean): RuntimeValue
    {
        if (name in this.variables)
        {
            throw_exception({type: "Runtime", message: `Variable '${name}' is already declared.`});
        }
        this.variables[name] = value;
        if (is_const) this.constants.add(name);
        return value;
    }

    public assign(name: string, value: RuntimeValue): RuntimeValue
    {
        const env = this.resolve(name);
        if (env.constants.has(name)) throw_exception({
            type:    "Runtime",
            message: `Cannot assign to constant '${name}'.`
        });
        env.variables[name] = value;
        return value;
    }

    public lookup(name: string): RuntimeValue
    {
        const env = this.resolve(name);
        return env.variables[name]!;
    }

    public assign_or_declare(name: string, value: RuntimeValue): RuntimeValue
    {
        this.variables[name] = value;
        return value;
    }

    private resolve(name: string): Environment
    {
        if (name in this.variables) return this;
        if (this.parent) return this.parent.resolve(name);
        throw_exception({type: "Runtime", message: `Variable '${name}' is not defined.`});
        return this;
    }
}

export const interpret = (ast: Program, env: Environment) =>
{
    // We define structs, funcs and procedures first
    for (const stmt of ast.body)
    {
        if (stmt.type === NodeType.StructDeclaration)
        {
            execute(stmt, env);
        }
    }

    for (const stmt of ast.body)
    {
        if (stmt.type === NodeType.FunctionDeclaration ||
            stmt.type === NodeType.ProcedureDeclaration ||
            stmt.type === NodeType.MethodDeclaration)
        {
            execute(stmt, env);
        }
    }

    let last_result: RuntimeValue = {type: RuntimeValueType.Null, value: null};
    for (const stmt of ast.body)
    {
        if (stmt.type !== NodeType.StructDeclaration &&
            stmt.type !== NodeType.FunctionDeclaration &&
            stmt.type !== NodeType.ProcedureDeclaration &&
            stmt.type !== NodeType.MethodDeclaration)
        {
            last_result = execute(stmt, env);
        }
    }
    return last_result;
};

const execute = (stmt: Statement, env: Environment): RuntimeValue =>
{
    switch (stmt.type)
    {
        case NodeType.VariableDeclaration:
            return execute_variable_declaration(stmt as VariableDeclaration, env);
        case NodeType.FunctionDeclaration:
            return execute_function_declaration(stmt as FunctionDeclaration, env);
        case NodeType.ProcedureDeclaration:
            return execute_procedure_declaration(stmt as ProcedureDeclaration, env);
        case NodeType.MethodDeclaration:
            return execute_method_declaration(stmt as MethodDeclaration, env);
        case NodeType.StructDeclaration:
            return execute_struct_declaration(stmt as StructDeclaration, env);
        case NodeType.IfStatement:
            return execute_if_statement(stmt as IfStatement, env);
        case NodeType.WhenStatement:
            return execute_when_statement(stmt as WhenStatement, env);
        case NodeType.ForStatement:
            return execute_for_statement(stmt as ForStatement, env);
        case NodeType.WhileStatement:
            return execute_while_statement(stmt as WhileStatement, env);
        case NodeType.ReturnStatement:
            return {
                type:  RuntimeValueType.Return,
                value: evaluate((stmt as ReturnStatement).value, env)
            } as ReturnValue;
        case NodeType.BlockStatement:
            return execute_block_statement(stmt as BlockStatement, new Environment(env));
        case NodeType.ExpressionStatement:
            return evaluate((stmt as ExpressionStatement).expression, env);
        default:
            throw_exception({
                type:    "Runtime",
                message: `Unknown statement type: ${(stmt as any).type}`
            });
            return {type: RuntimeValueType.Null, value: null};
    }
};

const execute_block_statement = (block: BlockStatement, env: Environment): RuntimeValue =>
{
    let last_result: RuntimeValue = {type: RuntimeValueType.Null, value: null};
    for (const stmt of block.body)
    {
        const result = execute(stmt, env);
        if (result.type === RuntimeValueType.Return)
        {
            return result;
        }
        last_result = result;
    }
    return last_result;
};

const is_truthy = (val: RuntimeValue): boolean =>
{
    if (val.type === RuntimeValueType.Boolean) return (val as BooleanValue).value;
    if (val.type === RuntimeValueType.Null) return false;
    if (val.type === RuntimeValueType.Number) return (val as NumberValue).value !== 0;
    return true;
};

const execute_variable_declaration = (stmt: VariableDeclaration, env: Environment): RuntimeValue =>
{
    const value = evaluate(stmt.value, env);
    if (stmt.is_const)
    {
        if (value.type === RuntimeValueType.Array ||
            value.type === RuntimeValueType.Set ||
            value.type === RuntimeValueType.Struct)
        {
            (value as any).is_immutable = true;
        }
    }
    return env.declare(stmt.identifier, value, stmt.is_const);
};

const execute_function_declaration = (stmt: FunctionDeclaration, env: Environment): RuntimeValue =>
{
    const func: FunctionValue = {
        type:       RuntimeValueType.Function,
        identifier: stmt.identifier,
        parameters: stmt.parameters,
        body:       stmt.body,
        env
    };
    return env.declare(stmt.identifier, func, true);
};

const execute_procedure_declaration = (stmt: ProcedureDeclaration, env: Environment): RuntimeValue =>
{
    const proc: ProcedureValue = {
        type:       RuntimeValueType.Procedure,
        identifier: stmt.identifier,
        parameters: stmt.parameters,
        body:       stmt.body,
        env
    };
    return env.declare(stmt.identifier, proc, true);
};

const execute_method_declaration = (stmt: MethodDeclaration, env: Environment): RuntimeValue =>
{
    const method: FunctionValue = {
        type:       RuntimeValueType.Function,
        identifier: stmt.identifier,
        parameters: stmt.parameters,
        body:       stmt.body,
        env,
        is_method:  true
    };

    env.register_method(stmt.struct_name, stmt.identifier, method);
    return {type: RuntimeValueType.Null, value: null};
};

const structs = new Map<string, string[]>();
const execute_struct_declaration = (stmt: StructDeclaration, env: Environment): RuntimeValue =>
{
    structs.set(stmt.identifier, stmt.fields);

    const struct_val: StructValue = {
        type:       RuntimeValueType.Struct,
        identifier: stmt.identifier,
        properties: new Map<string, RuntimeValue>(),
        get methods()
        {
            return env.get_methods(stmt.identifier);
        },
        is_declaration: true
    };

    env.declare(stmt.identifier, struct_val, true);

    return {type: RuntimeValueType.Null, value: null};
};

const execute_if_statement = (stmt: IfStatement, env: Environment): RuntimeValue =>
{
    const condition = evaluate(stmt.condition, env);
    if (is_truthy(condition))
    {
        return execute(stmt.consequent, env);
    }
    else if (stmt.alternate)
    {
        return execute(stmt.alternate, env);
    }

    return {type: RuntimeValueType.Null, value: null};
};

const execute_when_statement = (stmt: WhenStatement, env: Environment): RuntimeValue =>
{
    const val = evaluate(stmt.expression, env);

    for (const case_ of stmt.cases)
    {
        if (case_.value === "else")
        {
            return execute(case_.body, env);
        }

        const case_val = evaluate(case_.value, env);
        if (is_equal(val, case_val))
        {
            return execute(case_.body, env);
        }
    }

    return {type: RuntimeValueType.Null, value: null};
};

const execute_for_statement = (stmt: ForStatement, env: Environment): RuntimeValue =>
{
    let last_result: RuntimeValue = {type: RuntimeValueType.Null, value: null};
    const loop_env = new Environment(env);

    // Ranges
    if (stmt.iterable.type === NodeType.RangeExpression)
    {
        const rangeExpr = stmt.iterable as RangeExpression;
        const start_val = evaluate(rangeExpr.start, env);
        const end_val = evaluate(rangeExpr.end, env);

        if (start_val.type !== RuntimeValueType.Number || end_val.type !== RuntimeValueType.Number)
        {
            throw_exception({type: "Runtime", message: "For loop range bounds must be numbers."});
        }

        const start = (start_val as NumberValue).value;
        const end = (end_val as NumberValue).value;
        const step = start <= end ? 1 : -1;

        for (let i = start; step > 0 ? i <= end : i >= end; i += step)
        {
            loop_env.assign_or_declare(stmt.identifier, {type: RuntimeValueType.Number, value: i});
            const result = execute(stmt.body, loop_env);
            if (result.type === RuntimeValueType.Return) return result;
            last_result = result;
        }
    }
    else
    {
        // Data structures
        const iterable = evaluate(stmt.iterable, env);

        if (iterable.type === RuntimeValueType.Array)
        {
            const elements = (iterable as ArrayValue).elements;
            for (const el of elements)
            {
                loop_env.assign_or_declare(stmt.identifier, el);
                const result = execute(stmt.body, loop_env);
                if (result.type === RuntimeValueType.Return) return result;
                last_result = result;
            }
        }
        else if (iterable.type === RuntimeValueType.Set)
        {
            const elements = (iterable as SetValue).elements;
            for (const el of elements)
            {
                loop_env.assign_or_declare(stmt.identifier, el);
                const result = execute(stmt.body, loop_env);
                if (result.type === RuntimeValueType.Return) return result;
                last_result = result;
            }
        }
        else if (iterable.type === RuntimeValueType.Struct)
        {
            const struct = iterable as StructValue;
            // yields an array of [key, value]
            for (const [key, value] of struct.properties.entries())
            {
                const pair: ArrayValue = {
                    type:     RuntimeValueType.Array,
                    elements: [
                        {type: RuntimeValueType.String, value: key},
                        value
                    ]
                };
                loop_env.assign_or_declare(stmt.identifier, pair);
                const result = execute(stmt.body, loop_env);
                if (result.type === RuntimeValueType.Return) return result;
                last_result = result;
            }
        }
        else
        {
            throw_exception({
                type:    "Runtime",
                message: `Cannot iterate over type '${iterable.type}'. Expected Array, Set, Struct, or Range.`
            });
        }
    }

    return last_result;
};

export const create_global_env = (args: string[] = []): Environment =>
{
    const env = new Environment();
    setup_stdlib(env, args);
    setup_data_structures(env, args);
    return env;
};

const execute_while_statement = (stmt: WhileStatement, env: Environment): RuntimeValue =>
{
    let last_result: RuntimeValue = {type: RuntimeValueType.Null, value: null};
    while (true)
    {
        const condition = evaluate(stmt.condition, env);
        if (!is_truthy(condition)) break;

        const result = execute(stmt.body, env);
        if (result.type === RuntimeValueType.Return) return result;
        last_result = result;
    }
    return last_result;
};

const evaluate = (expr: Expression, env: Environment): RuntimeValue =>
{
    switch (expr.type)
    {
        case NodeType.NumericLiteral:
            return {type: RuntimeValueType.Number, value: (expr as NumericLiteral).value};
        case NodeType.StringLiteral:
            return {type: RuntimeValueType.String, value: (expr as StringLiteral).value};
        case NodeType.BooleanLiteral:
            return {type: RuntimeValueType.Boolean, value: (expr as BooleanLiteral).value};
        case NodeType.NullLiteral:
            return {type: RuntimeValueType.Null, value: null};
        case NodeType.Identifier:
            return env.lookup((expr as Identifier).name);
        case NodeType.BinaryExpression:
            return evaluate_binary_expression(expr as BinaryExpression, env);
        case NodeType.UnaryExpression:
            return evaluate_unary_expression(expr as UnaryExpression, env);
        case NodeType.ArrayLiteral:
            return {
                type:     RuntimeValueType.Array,
                elements: (expr as ArrayLiteral).elements.map(e => evaluate(e, env))
            };
        case NodeType.StructLiteral:
            return evaluate_struct_literal(expr as StructLiteral, env);
        case NodeType.CallExpression:
            return evaluate_call_expression(expr as CallExpression, env);
        case NodeType.MemberExpression:
            return evaluate_member_expression(expr as MemberExpression, env);
        case NodeType.StaticMemberExpression:
            return evaluate_static_member_expression(expr as StaticMemberExpression, env);
        case NodeType.IndexExpression:
            return evaluate_index_expression(expr as IndexExpression, env);
        case NodeType.AssignmentExpression:
            return evaluate_assignment_expression(expr as AssignmentExpression, env);
        default:
            throw_exception({
                type:    "Runtime",
                message: `Unknown expression type: ${expr.type}`
            });
            return {type: RuntimeValueType.Null, value: null};
    }
};

const evaluate_binary_expression = (expr: BinaryExpression, env: Environment): RuntimeValue =>
{
    const left = evaluate(expr.left, env);
    const right = evaluate(expr.right, env);

    if (left.type === RuntimeValueType.String && expr.operator === "+")
    {
        return {
            type:  RuntimeValueType.String,
            value: (left as StringValue).value + stringify_value(right)
        } as StringValue;
    }

    switch (expr.operator)
    {
        case "+":
            if (left.type === RuntimeValueType.Number && right.type === RuntimeValueType.Number)
            {
                return {
                    type:  RuntimeValueType.Number,
                    value: (left as NumberValue).value + (right as NumberValue).value
                };
            }
            throw_exception({
                type:    "Runtime",
                message: `Operator '+' cannot be applied to types ${left.type} and ${right.type}.`
            });
            return {type: RuntimeValueType.Null, value: null};
        case "-":
            if (left.type === RuntimeValueType.Number && right.type === RuntimeValueType.Number)
            {
                return {
                    type:  RuntimeValueType.Number,
                    value: (left as NumberValue).value - (right as NumberValue).value
                };
            }
            throw_exception({
                type:    "Runtime",
                message: `Operator '-' cannot be applied to types ${left.type} and ${right.type}.`
            });
            return {type: RuntimeValueType.Null, value: null};
        case "*":
            return {type: RuntimeValueType.Number, value: (left as NumberValue).value * (right as NumberValue).value};
        case "/":
            return {type: RuntimeValueType.Number, value: (left as NumberValue).value / (right as NumberValue).value};
        case "%":
            return {type: RuntimeValueType.Number, value: (left as NumberValue).value % (right as NumberValue).value};
        case "==":
            return {type: RuntimeValueType.Boolean, value: is_equal(left, right)};
        case "!=":
            return {type: RuntimeValueType.Boolean, value: !is_equal(left, right)};
        case "<":
            return {type: RuntimeValueType.Boolean, value: (left as NumberValue).value < (right as NumberValue).value};
        case "<=":
            return {type: RuntimeValueType.Boolean, value: (left as NumberValue).value <= (right as NumberValue).value};
        case ">":
            return {type: RuntimeValueType.Boolean, value: (left as NumberValue).value > (right as NumberValue).value};
        case ">=":
            return {type: RuntimeValueType.Boolean, value: (left as NumberValue).value >= (right as NumberValue).value};
        case "and":
            return {type: RuntimeValueType.Boolean, value: is_truthy(left) && is_truthy(right)};
        case "or":
            return {type: RuntimeValueType.Boolean, value: is_truthy(left) || is_truthy(right)};
        default:
            throw_exception({
                type:    "Runtime",
                message: `Unknown operator: ${expr.operator}`
            });
            return {type: RuntimeValueType.Null, value: null};
    }
};

const evaluate_unary_expression = (expr: UnaryExpression, env: Environment): RuntimeValue =>
{
    const arg = evaluate(expr.argument, env);
    switch (expr.operator)
    {
        case "not":
            return {type: RuntimeValueType.Boolean, value: !is_truthy(arg)};
        case "-":
            return {type: RuntimeValueType.Number, value: -(arg as NumberValue).value};
        default:
            throw_exception({
                type:    "Runtime",
                message: `Unknown unary operator: ${expr.operator}`
            });
            return {type: RuntimeValueType.Null, value: null};
    }
};

const evaluate_struct_literal = (expr: StructLiteral, env: Environment): RuntimeValue =>
{
    const fields = structs.get(expr.identifier);
    if (!fields)
    {
        throw_exception({
            type:    "Runtime",
            message: `Struct '${expr.identifier}' is not defined.`
        });
    }

    const properties = new Map<string, RuntimeValue>();
    for (const prop of expr.properties)
    {
        properties.set(prop.name, evaluate(prop.value, env));
    }

    return {
        type:       RuntimeValueType.Struct,
        identifier: expr.identifier,
        properties,
        get methods()
        {
            return env.get_methods(expr.identifier);
        },
        is_declaration: false
    } as StructValue;
};

const evaluate_call_expression = (expr: CallExpression, env: Environment): RuntimeValue =>
{
    let func: RuntimeValue;
    let args: RuntimeValue[];
    let this_val: RuntimeValue | null = null;

    if (expr.callee.type === NodeType.StaticMemberExpression)
    {
        const member = expr.callee as StaticMemberExpression;
        const object = evaluate(member.object, env);

        // Arrays and Sets aren't "structs" but we still want to call methods on them, so I had to make this shit up
        if (object.type === RuntimeValueType.Array || object.type === RuntimeValueType.Set)
        {
            const ns_name = object.type === RuntimeValueType.Array ? "Array" : "Set";
            const ns = env.lookup(ns_name) as StructValue;

            if (ns.methods.has(member.property.name))
            {
                func = ns.methods.get(member.property.name)!;
                this_val = object;
            }
            else
            {
                throw_exception({
                    type:    "Runtime",
                    message: `Method '${member.property.name}' does not exist on ${ns_name}.`
                });
                return {type: RuntimeValueType.Null, value: null};
            }
        }
        else if (object.type === RuntimeValueType.Struct)
        {
            const struct = object as StructValue;
            if (struct.is_declaration)
            {
                if (member.property.name === "new")
                {
                    if (struct.methods.has("new"))
                    {
                        func = struct.methods.get("new")!;
                        this_val = struct;
                    }
                    else
                    {
                        throw_exception({
                            type:    "Runtime",
                            message: `Struct '${struct.identifier}' does not have a '::new' method.`
                        });
                        return {type: RuntimeValueType.Null, value: null};
                    }
                }
                else
                {
                    throw_exception({
                        type:    "Runtime",
                        message: `Method '${member.property.name}' cannot be called on the struct '${struct.identifier}' itself. Only '::new' is allowed as a static method.`
                    });
                    return {type: RuntimeValueType.Null, value: null};
                }
            }
            else
            {
                if (struct.methods.has(member.property.name))
                {
                    func = struct.methods.get(member.property.name)!;
                    this_val = struct;
                }
                else
                {
                    const baseStruct = env.lookup("Struct") as StructValue | undefined;
                    if (baseStruct && baseStruct.methods.has(member.property.name))
                    {
                        func = baseStruct.methods.get(member.property.name)!;
                        this_val = struct;
                    }
                    else
                    {
                        throw_exception({
                            type:    "Runtime",
                            message: `Method '${member.property.name}' does not exist on struct '${struct.identifier}'.`
                        });
                        return {type: RuntimeValueType.Null, value: null};
                    }
                }
            }
        }
        else
        {
            func = evaluate_static_member_expression(member, env);
        }
    }
    else if (expr.callee.type === NodeType.MemberExpression)
    {
        const member = expr.callee as MemberExpression;
        const object = evaluate(member.object, env);
        if (object.type === RuntimeValueType.Struct)
        {
            const struct = object as StructValue;
            if (struct.properties.has(member.property.name))
            {
                func = struct.properties.get(member.property.name)!;
            }
            else
            {
                throw_exception({
                    type:    "Runtime",
                    message: `Property '${member.property.name}' does not exist on struct '${struct.identifier}'. Use '::' for methods.`
                });
                return {type: RuntimeValueType.Null, value: null};
            }
        }
        else
        {
            func = evaluate_member_expression(member, env);
        }
    }
    else
    {
        func = evaluate(expr.callee, env);
    }

    args = expr.arguments.map(a => evaluate(a, env));

    if (func.type === RuntimeValueType.NativeFunction)
    {
        const nativeFunc = func as NativeFunctionValue;
        let finalArgs = args;

        // This automatically passes the (array | set | struct) instance as the first argument to the method
        if (nativeFunc.is_method && this_val)
        {
            finalArgs = [this_val, ...args];
        }

        return nativeFunc.call(finalArgs);
    }

    if (func.type === RuntimeValueType.Function || func.type === RuntimeValueType.Procedure)
    {
        const fn = func as (FunctionValue | ProcedureValue);
        if (args.length !== fn.parameters.length)
        {
            throw_exception({
                type:    "Runtime",
                message: `Function '${fn.identifier}' expected ${fn.parameters.length} arguments, got ${args.length}.`
            });
        }
        const call_env = new Environment(fn.env);
        if (this_val)
        {
            call_env.declare("this", this_val, true);
        }
        for (let i = 0; i < args.length; i++)
        {
            call_env.declare(fn.parameters[i]!, args[i]!, false);
        }

        const result = execute(fn.body, call_env);

        if (result.type === RuntimeValueType.Return)
        {
            return (result as ReturnValue).value;
        }

        if (fn.type === RuntimeValueType.Procedure || (fn as FunctionValue).is_method)
        {
            return {type: RuntimeValueType.Null, value: null};
        }

        // fallback.
        return result;
    }

    throw_exception({
        type:    "Runtime",
        message: "Callee is not a function or procedure."
    });
    return {type: RuntimeValueType.Null, value: null};
};

const evaluate_member_expression = (expr: MemberExpression, env: Environment): RuntimeValue =>
{
    const object = evaluate(expr.object, env);
    if (object.type !== RuntimeValueType.Struct)
    {
        throw_exception({
            type:    "Runtime",
            message: "Member access is only allowed on structs."
        });
    }

    const struct = object as StructValue;
    const property = expr.property.name;

    if (struct.methods.has(property))
    {
        throw_exception({
            type:    "Runtime",
            message: `Property '${property}' is a method on struct '${struct.identifier}'. Use '::' to access it.`
        });
    }

    if (!struct.properties.has(property))
    {
        throw_exception({
            type:    "Runtime",
            message: `Property '${property}' does not exist on struct '${struct.identifier}'.`
        });
    }

    return struct.properties.get(property)!;
};

const evaluate_static_member_expression = (expr: StaticMemberExpression, env: Environment): RuntimeValue =>
{
    const object = evaluate(expr.object, env);
    const property = expr.property.name;

    if (object.type === RuntimeValueType.Array || object.type === RuntimeValueType.Set)
    {
        const ns_name = object.type === RuntimeValueType.Array ? "Array" : "Set";
        const ns = env.lookup(ns_name) as StructValue;

        if (ns.methods.has(property))
        {
            return ns.methods.get(property)!;
        }

        throw_exception({
            type:    "Runtime",
            message: `Method '${property}' does not exist on ${ns_name}.`
        });
    }

    if (object.type !== RuntimeValueType.Struct)
    {
        throw_exception({
            type:    "Runtime",
            message: "Static member access is only allowed on structs, arrays, and sets."
        });
    }

    const struct = object as StructValue;

    if (struct.is_declaration)
    {
        if (property === "new")
        {
            if (struct.methods.has("new"))
            {
                return struct.methods.get("new")!;
            }
            else
            {
                throw_exception({
                    type:    "Runtime",
                    message: `Struct '${struct.identifier}' does not have a '::new' method.`
                });
            }
        }
        else
        {
            throw_exception({
                type:    "Runtime",
                message: `Method '${property}' cannot be called on the struct '${struct.identifier}' itself. Only '::new' is allowed as a static method.`
            });
        }
    }

    if (struct.methods.has(property))
    {
        return struct.methods.get(property)!;
    }

    const baseStruct = env.lookup("Struct") as StructValue | undefined;
    if (baseStruct && baseStruct.methods.has(property))
    {
        return baseStruct.methods.get(property)!;
    }

    if (struct.properties.has(property))
    {
        throw_exception({
            type:    "Runtime",
            message: `Property '${property}' is a field on struct '${struct.identifier}'. Use '.' to access it.`
        });
    }

    throw_exception({
        type:    "Runtime",
        message: `Method '${property}' does not exist on struct '${struct.identifier}'.`
    });
    return {type: RuntimeValueType.Null, value: null};
};

const evaluate_index_expression = (expr: IndexExpression, env: Environment): RuntimeValue =>
{
    const object = evaluate(expr.object, env);
    const index = evaluate(expr.index, env);

    // Indexing for Arrays
    if (object.type === RuntimeValueType.Array)
    {
        if (index.type !== RuntimeValueType.Number)
        {
            throw_exception({
                type:    "Runtime",
                message: "Array index must be a number."
            });
        }

        const array = object as ArrayValue;
        const idx = (index as NumberValue).value;

        if (idx < 0 || idx >= array.elements.length)
        {
            throw_exception({
                type:    "OutOfBounds",
                message: `Array index ${idx} is out of bounds (length ${array.elements.length}).`
            });
        }

        return array.elements[idx]!;
    }
    // Indexing for Structs (map like key access)
    else if (object.type === RuntimeValueType.Struct)
    {
        if (index.type !== RuntimeValueType.String)
        {
            throw_exception({
                type:    "Runtime",
                message: "Struct keys must be strings."
            });
        }
        const struct = object as StructValue;
        const key = (index as StringValue).value;

        if (!struct.properties.has(key))
        {
            throw_exception({
                type:    "Runtime",
                message: `Property '${key}' does not exist on struct '${struct.identifier}'.`
            });
        }
        return struct.properties.get(key)!;
    }
    else
    {
        throw_exception({
            type:    "Runtime",
            message: "Indexing is only allowed on arrays and structs."
        });
    }
    // fallback
    return {type: RuntimeValueType.Null, value: null};
};

const evaluate_assignment_expression = (expr: AssignmentExpression, env: Environment): RuntimeValue =>
{
    const value = evaluate(expr.right, env);

    if (expr.left.type === NodeType.Identifier)
    {
        return env.assign((expr.left as Identifier).name, value);
    }
    else if (expr.left.type === NodeType.MemberExpression)
    {
        const member = expr.left as MemberExpression;
        const object = evaluate(member.object, env);

        if (object.type !== RuntimeValueType.Struct)
        {
            throw_exception({
                type:    "Runtime",
                message: "Member assignment is only allowed on structs."
            });
        }

        if ((object as StructValue).is_immutable)
        {
            throw_exception({
                type:    "Runtime",
                message: `Cannot assign to property of immutable struct '${(object as StructValue).identifier}'.`
            });
        }
        (object as StructValue).properties.set(member.property.name, value);
        return value;
    }
    else if (expr.left.type === NodeType.IndexExpression)
    {
        const index_expr = expr.left as IndexExpression;
        const object = evaluate(index_expr.object, env);
        const index = evaluate(index_expr.index, env);

        if (object.type === RuntimeValueType.Array)
        {
            if ((object as ArrayValue).is_immutable)
            {
                throw_exception({type: "Runtime", message: `Cannot assign to index of immutable array.`});
            }
            if (index.type !== RuntimeValueType.Number)
            {
                throw_exception({type: "Runtime", message: "Array index must be a number."});
            }
            const array = object as ArrayValue;
            const idx = (index as NumberValue).value;
            if (idx < 0 || idx >= array.elements.length)
            {
                throw_exception({type: "OutOfBounds", message: `Array index ${idx} is out of bounds.`});
            }
            array.elements[idx] = value;
            return value;
        }
        else if (object.type === RuntimeValueType.Struct)
        {
            if ((object as StructValue).is_immutable)
            {
                throw_exception({
                    type:    "Runtime",
                    message: `Cannot assign to property of immutable instance of struct '${(object as StructValue).identifier}'.`
                });
            }
            if (index.type !== RuntimeValueType.String)
            {
                throw_exception({type: "Runtime", message: "Struct keys must be strings."});
            }
            const struct = object as StructValue;
            const key = (index as StringValue).value;
            struct.properties.set(key, value);
            return value;
        }
        else
        {
            throw_exception({
                type:    "Runtime",
                message: "Index assignment is only allowed on arrays and structs."
            });
        }
    }

    throw_exception({
        type:    "Runtime",
        message: "Invalid assignment target."
    });
    return {type: RuntimeValueType.Null, value: null};
};
