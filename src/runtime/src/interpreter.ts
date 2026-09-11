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
    type NativeFunctionValue, type RangeExpression, type SetValue, type RangeValue, type TryStatement, type MapValue,
    type ImportStatement, type StructField,
} from "@types";
import {throw_exception, stringify_value, is_equal, FleurError, deep_copy} from "@utils";
import {setup_stdlib} from "./stdlib";
import {setup_data_structures} from "./data-structures";
import {setup_other_structs} from "./others";
import * as node_fs from "node:fs";
import * as node_path from "node:path";
import {Parser, tokenize} from "@compiler";
import {validate_runtime_type} from "./type-checker.ts";

export class Environment
{
    private readonly parent?: Environment;
    private readonly variables: Record<string, RuntimeValue>;
    private constants: Set<string>;
    private methods: Map<string, Map<string, FunctionValue>>;

    public readonly base_dir: string;

    constructor(parent?: Environment, base_dir?: string)
    {
        this.parent = parent;
        // Weird quirk, but I use this instead of {} because then it would have a
        // prototype with methods, but we only want a Map like record
        this.variables = Object.create(null);
        this.constants = new Set();
        this.methods = new Map();
        this.base_dir = base_dir ?? parent?.base_dir ?? process.cwd();
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
        case NodeType.TryStatement:
            return execute_try_statement(stmt as TryStatement, env);
        case NodeType.ImportStatement:
            return execute_import_statement(stmt as ImportStatement, env);
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

const set_immutable_recursive = (val: RuntimeValue): void =>
{
    if (!val) return;
    (val as any).is_immutable = true;
    switch (val.type)
    {
        case RuntimeValueType.Array:
        case RuntimeValueType.Set:
            for (const el of (val as any).elements)
            {
                set_immutable_recursive(el);
            }
            break;
        case RuntimeValueType.Map:
            for (const el of (val as any).elements)
            {
                set_immutable_recursive(el.key);
                set_immutable_recursive(el.value);
            }
            break;
        case RuntimeValueType.Struct:
            for (const [, v] of (val as any).properties)
            {
                set_immutable_recursive(v);
            }
            break;
    }
};

const execute_variable_declaration = (stmt: VariableDeclaration, env: Environment): RuntimeValue =>
{
    const value = evaluate(stmt.value, env);

    if (stmt.type_annotation)
    {
        validate_runtime_type(value, stmt.type_annotation.name, `variable '${stmt.identifier}'`);
    }

    if (stmt.is_const)
    {
        set_immutable_recursive(value);
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

const structs = new Map<string, StructField[]>();
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
    const iterable = evaluate(stmt.iterable, env);

    if (iterable.type === RuntimeValueType.Range)
    {
        const range = iterable as RangeValue;
        if (range.start.type !== RuntimeValueType.Number || range.end.type !== RuntimeValueType.Number)
        {
            throw_exception({type: "Runtime", message: "Range bounds must be numbers."});
        }
        const start = (range.start as NumberValue).value;
        const end = (range.end as NumberValue).value;
        const step = start <= end ? 1 : -1;

        for (let i = start; step > 0 ? i <= end : i >= end; i += step)
        {
            loop_env.assign_or_declare(stmt.identifier, {type: RuntimeValueType.Number, value: i});
            const result = execute(stmt.body, loop_env);
            if (result.type === RuntimeValueType.Return) return result;
            last_result = result;
        }
    }
    else if (iterable.type === RuntimeValueType.Array)
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

    return last_result;
}

const execute_try_statement = (stmt: TryStatement, env: Environment): RuntimeValue =>
{
    try
    {
        return execute(stmt.body, env);
    }
    catch (e)
    {
        if (e instanceof FleurError)
        {
            const catch_env = new Environment(env);
            catch_env.declare(stmt.catch_param, e.value, false);
            return execute(stmt.catch_body, catch_env);
        }
        throw e;
    }
};

const moduleCache = new Map<string, Record<string, RuntimeValue>>();

const execute_import_statement = (stmt: ImportStatement, env: Environment): RuntimeValue =>
{
    const target_path = node_path.resolve(env.base_dir, stmt.source);
    const target_dir = node_path.dirname(target_path);

    if (moduleCache.has(target_path))
    {
        const cached_exports = moduleCache.get(target_path)!;
        bind_exports(cached_exports, stmt.specifiers, env, stmt.source);
        return {type: RuntimeValueType.Null, value: null};
    }

    moduleCache.set(target_path, {});

    if (!node_fs.existsSync(target_path))
    {
        throw_exception({type: "Runtime", message: `Module not found: ${stmt.source} (Looked in ${env.base_dir})`});
    }

    const code = node_fs.readFileSync(target_path, "utf-8");
    const tokens = tokenize(code);
    const ast = new Parser(tokens).parse();

    const module_env = new Environment(env, target_dir);

    interpret(ast, module_env);

    const exports: Record<string, RuntimeValue> = {};
    for (const s of ast.body)
    {
        if ((s as any).is_pub && 'identifier' in s)
        {
            const name = (s as any).identifier;
            exports[name] = module_env.lookup(name);
        }
    }

    moduleCache.set(target_path, exports);
    bind_exports(exports, stmt.specifiers, env, stmt.source);

    return {type: RuntimeValueType.Null, value: null};
};

const bind_exports = (exports: Record<string, RuntimeValue>, specifiers: string[], env: Environment, source: string) =>
{
    for (const name of specifiers)
    {
        if (!(name in exports))
        {
            throw_exception({type: "Runtime", message: `Module '${source}' does not export '${name}'.`});
        }
        env.declare(name, exports[name]!, true);
    }
};

export const create_global_env = (args: string[] = [], base_dir: string = process.cwd()): Environment =>
{
    const env = new Environment(undefined, base_dir);
    setup_stdlib(env, args);
    setup_data_structures(env, args);
    setup_other_structs(env, args);
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
        case NodeType.RangeExpression:
            return {
                type:  RuntimeValueType.Range,
                start: evaluate((expr as RangeExpression).start, env),
                end:   evaluate((expr as RangeExpression).end, env)
            } as RangeValue;
        default:
            throw_exception({
                type:    "Runtime",
                message: `Unknown expression type: ${(expr as any).type}`
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
        {
            const left_val = (left as NumberValue).value
            const right_val = (right as NumberValue).value
            if (right_val === 0) return throw_exception({
                type:    "Runtime",
                message: "Impossible to divide by 0"
            })
            return {type: RuntimeValueType.Number, value: left_val / right_val};
        }
        case "%":
        {
            const left_val = (left as NumberValue).value
            const right_val = (right as NumberValue).value
            if (right_val === 0) return throw_exception({
                type:    "Runtime",
                message: "Impossible to % by 0"
            })
            return {type: RuntimeValueType.Number, value: left_val % right_val};
        }
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
    const expected_fields = structs.get(expr.identifier);
    if (!expected_fields)
    {
        throw_exception({
            type:    "Runtime",
            message: `Struct '${expr.identifier}' is not defined.`
        });
    }

    const provided_fields = new Set(expr.properties.map(p => p.name));
    const missing_fields: string[] = [];

    for (const field of expected_fields!)
    {
        if (!provided_fields.has(field.name))
        {
            missing_fields.push(field.name);
        }
    }

    if (missing_fields.length > 0)
    {
        return throw_exception({
            type:    "Runtime",
            message: `Missing required ${missing_fields.length > 1 ? 'properties' : 'property'} '${missing_fields.join(', ')}' when instantiating struct '${expr.identifier}'.`
        });
    }

    const properties = new Map<string, RuntimeValue>();
    for (const prop of expr.properties)
    {
        const evaluated_val = evaluate(prop.value, env);

        const field_def = expected_fields!.find(f => f.name === prop.name);
        if (field_def?.type_annotation)
        {
            validate_runtime_type(evaluated_val, field_def.type_annotation.name, `struct '${expr.identifier}' property '${prop.name}'`);
        }

        properties.set(prop.name, evaluated_val);
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

        const valid_members = [RuntimeValueType.Array, RuntimeValueType.Set, RuntimeValueType.Error, RuntimeValueType.Range, RuntimeValueType.Map];

        if (valid_members.includes(object.type))
        {
            const ns_name = object.type.toString();
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
            const param = fn.parameters[i]!;

            if (param.type_annotation)
            {
                validate_runtime_type(args[i]!, param.type_annotation.name, `argument '${param.name}'`);
            }

            call_env.declare(param.name, args[i]!, false);
        }
        const result = execute(fn.body, call_env);

        if (result.type === RuntimeValueType.Return)
        {
            const return_val = (result as ReturnValue).value;

            if (fn.type === RuntimeValueType.Function && (fn as any).return_type)
            {
                validate_runtime_type(return_val, (fn as any).return_type.name, `return value of '${fn.identifier}'`);
            }

            return return_val;
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

    const valid_members = [RuntimeValueType.Array, RuntimeValueType.Set, RuntimeValueType.Error, RuntimeValueType.Range, RuntimeValueType.Map];

    if (valid_members.includes(object.type))
    {
        const ns_name = object.type.toString();
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
        const length = array.elements.length
        if (idx < -length || idx >= length)
        {
            throw_exception({
                type:    "OutOfBounds",
                message: `Array index ${idx} is out of bounds (length ${array.elements.length}).`
            });
        }

        return array.elements.at(idx) ?? {type: RuntimeValueType.Null, value: null};
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
    // Actual maps
    else if (object.type === RuntimeValueType.Map)
    {
        const m = object as MapValue;
        const key = index;
        const idx = m.elements.findIndex(el => is_equal(el.key, key));

        if (idx !== -1) return m.elements[idx]!.value;
        return {type: RuntimeValueType.Null, value: null};
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
    const right = evaluate(expr.right, env);
    const operator = expr.operator || "=";

    const compute_new_value = (current: RuntimeValue): RuntimeValue =>
    {
        if (operator === "=") return right;

        if (operator === "+=" && current.type === RuntimeValueType.String)
        {
            return {
                type:  RuntimeValueType.String,
                value: (current as StringValue).value + stringify_value(right)
            } as StringValue;
        }

        if (current.type === RuntimeValueType.Number && right.type === RuntimeValueType.Number)
        {
            const l = (current as NumberValue).value;
            const r = (right as NumberValue).value;
            let result = 0;

            switch (operator)
            {
                case "+=":
                    result = l + r;
                    break;
                case "-=":
                    result = l - r;
                    break;
                case "*=":
                    result = l * r;
                    break;
                case "/=":
                    result = l / r;
                    break;
                case "%=":
                    result = l % r;
                    break;
            }

            return {type: RuntimeValueType.Number, value: result};
        }

        throw_exception({
            type:    "Runtime",
            message: `Operator '${operator}' cannot be applied to types ${current.type} and ${right.type}.`
        });
        return {type: RuntimeValueType.Null, value: null};
    };

    // Variable Assignment
    if (expr.left.type === NodeType.Identifier)
    {
        const name = (expr.left as Identifier).name;
        if (operator === "=")
        {
            return env.assign(name, right);
        }
        const current = env.lookup(name);
        return env.assign(name, compute_new_value(current));
    }

    // Struct Property Assignment
    else if (expr.left.type === NodeType.MemberExpression)
    {
        const member = expr.left as MemberExpression;
        const object = evaluate(member.object, env);
        if (object.type !== RuntimeValueType.Struct)
        {
            throw_exception({type: "Runtime", message: "Member assignment is only allowed on structs."});
        }

        const struct = object as StructValue;
        if (struct.is_immutable)
        {
            throw_exception({type: "Runtime", message: `Cannot assign to property of immutable struct.`});
        }

        if (operator === "=")
        {
            struct.properties.set(member.property.name, right);
            return right;
        }

        const current = struct.properties.get(member.property.name)!;
        const newVal = compute_new_value(current);
        struct.properties.set(member.property.name, newVal);
        return newVal;
    }

    // Index Assignment
    else if (expr.left.type === NodeType.IndexExpression)
    {
        const index_expr = expr.left as IndexExpression;
        const object = evaluate(index_expr.object, env);
        const index = evaluate(index_expr.index, env);

        if (object.type === RuntimeValueType.Array)
        {
            const array = object as ArrayValue;
            if (array.is_immutable) throw_exception({
                type:    "Runtime",
                message: `Cannot assign to index of immutable array.`
            });
            if (index.type !== RuntimeValueType.Number) throw_exception({
                type:    "Runtime",
                message: "Array index must be a number."
            });

            const idx = (index as NumberValue).value;
            if (idx < 0 || idx >= array.elements.length) throw_exception({
                type:    "OutOfBounds",
                message: `Array index ${idx} is out of bounds.`
            });

            if (operator === "=")
            {
                array.elements[idx] = right;
                return right;
            }

            const current = array.elements[idx]!;
            const newVal = compute_new_value(current);
            array.elements[idx] = newVal;
            return newVal;
        }

        else if (object.type === RuntimeValueType.Map)
        {
            const m = object as MapValue;
            if (m.is_immutable) throw_exception({
                type:    "Runtime",
                message: `Cannot assign to key of immutable map.`
            });

            const key = deep_copy(index);
            const idx = m.elements.findIndex(el => is_equal(el.key, key));

            if (idx !== -1)
            {
                m.elements[idx]!.value = right;
            }
            else
            {
                m.elements.push({key, value: right});
            }
            return right;
        }

        else if (object.type === RuntimeValueType.Struct)
        {
            const struct = object as StructValue;
            if (struct.is_immutable) throw_exception({
                type:    "Runtime",
                message: `Cannot assign to property of immutable struct.`
            });
            if (index.type !== RuntimeValueType.String) throw_exception({
                type:    "Runtime",
                message: "Struct keys must be strings."
            });

            const key = (index as StringValue).value;

            if (operator === "=")
            {
                struct.properties.set(key, right);
                return right;
            }

            const current = struct.properties.get(key)!;
            const newVal = compute_new_value(current);
            struct.properties.set(key, newVal);
            return newVal;
        }
        else
        {
            throw_exception({type: "Runtime", message: "Index assignment is only allowed on arrays and structs."});
        }
    }

    throw_exception({type: "Runtime", message: "Invalid assignment target."});
    return {type: RuntimeValueType.Null, value: null};
};
