import type {BlockStatement} from "./ast";

export enum RuntimeValueType
{
    Number = "Number",
    String = "String",
    Boolean = "Boolean",
    Array = "Array",
    Struct = "Struct",
    Function = "Function",
    Procedure = "Procedure",
    Null = "Null",
    Return = "Return",
    NativeFunction = "NativeFunction"
}

export type RuntimeValue =
    | NumberValue
    | StringValue
    | BooleanValue
    | ArrayValue
    | StructValue
    | FunctionValue
    | ProcedureValue
    | NullValue
    | ReturnValue
    | NativeFunctionValue;

export type NumberValue = {
    type: RuntimeValueType.Number;
    value: number;
};

export type StringValue = {
    type: RuntimeValueType.String;
    value: string;
};

export type BooleanValue = {
    type: RuntimeValueType.Boolean;
    value: boolean;
};

export type ArrayValue = {
    type: RuntimeValueType.Array;
    elements: RuntimeValue[];
};

export type StructValue = {
    type: RuntimeValueType.Struct;
    identifier: string;
    properties: Map<string, RuntimeValue>;
    methods: Map<string, FunctionValue>;
    is_declaration?: boolean;
};

export type FunctionValue = {
    type: RuntimeValueType.Function;
    identifier: string;
    parameters: string[];
    body: BlockStatement;
    env: any; // Environment (circular dependency if typed here)
    is_method?: boolean;
};

export type ProcedureValue = {
    type: RuntimeValueType.Procedure;
    identifier: string;
    parameters: string[];
    body: BlockStatement;
    env: any; // Environment
};

export type NullValue = {
    type: RuntimeValueType.Null;
    value: null;
};

export type ReturnValue = {
    type: RuntimeValueType.Return;
    value: RuntimeValue;
};

export type NativeFunctionValue = {
    type: RuntimeValueType.NativeFunction;
    call: (args: RuntimeValue[]) => RuntimeValue;
};
