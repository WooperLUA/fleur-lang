import type {BlockStatement, Parameter, TypeAnnotation} from "./ast";

export enum RuntimeValueType
{
    Number = "Number",
    String = "String",
    Boolean = "Boolean",
    Array = "Array",
    Set = "Set",
    Map = "Map",
    Struct = "Struct",
    Function = "Function",
    Procedure = "Procedure",
    Null = "Null",
    Return = "Return",
    NativeFunction = "NativeFunction",
    Range = "Range",
    Error = "Error",
}

export type RuntimeValue =
    | NumberValue
    | StringValue
    | BooleanValue
    | ArrayValue
    | SetValue
    | MapValue
    | StructValue
    | FunctionValue
    | ProcedureValue
    | NullValue
    | ReturnValue
    | NativeFunctionValue
    | RangeValue
    | ErrorValue;

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
    is_immutable?: boolean;
};

export type SetValue = {
    type: RuntimeValueType.Set;
    elements: RuntimeValue[];
    is_immutable?: boolean;
};

export type MapValue = {
    type: RuntimeValueType.Map;
    elements: { key: RuntimeValue; value: RuntimeValue }[];
    is_immutable?: boolean;
};

export type StructValue = {
    type: RuntimeValueType.Struct;
    identifier: string;
    properties: Map<string, RuntimeValue>;
    methods: Map<string, FunctionValue>;
    is_declaration?: boolean;
    is_immutable?: boolean;
};

export type FunctionValue = {
    type: RuntimeValueType.Function;
    identifier: string;
    parameters: Parameter[];
    body: BlockStatement;
    env: any; // Environment (circular dependency if typed here)
    is_method?: boolean;
    return_type?: TypeAnnotation;
};

export type ProcedureValue = {
    type: RuntimeValueType.Procedure;
    identifier: string;
    parameters: Parameter[];
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
    is_method?: boolean;
};

export type RangeValue = {
    type: RuntimeValueType.Range;
    start: RuntimeValue;
    end: RuntimeValue;
};

export type ErrorValue = {
    type: RuntimeValueType.Error;
    message: string;
};