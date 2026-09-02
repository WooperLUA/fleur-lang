import type {NativeFunctionValue, NullValue, RuntimeValue, StructValue,} from "@types";
import {type BooleanValue, RuntimeValueType, type StringValue,} from "@types";
import {check_arg_type, check_args_length, check_mutability,} from "@utils";

export const reflect: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "Struct",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "has",
            {
                type:      RuntimeValueType.NativeFunction,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<reflect>::has");
                               check_arg_type(args[0]!, RuntimeValueType.Struct, "<reflect>::has");
                               check_arg_type(args[1]!, RuntimeValueType.String, "<reflect>::has");

                               const instance = args[0] as StructValue;
                               const key = (args[1] as StringValue).value;

                               return {
                                   type:  RuntimeValueType.Boolean,
                                   value: instance.properties.has(key) || instance.methods.has(key),
                               } as BooleanValue;
                           },
            } as NativeFunctionValue,
        ],
        [
            "get",
            {
                type:      RuntimeValueType.NativeFunction,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<reflect>::get");
                               check_arg_type(args[0]!, RuntimeValueType.Struct, "<reflect>::get");
                               check_arg_type(args[1]!, RuntimeValueType.String, "<reflect>::get");

                               const instance = args[0] as StructValue;
                               const key = (args[1] as StringValue).value;

                               return instance.properties.get(key) ?? {type : RuntimeValueType.Null, value : null} as NullValue;
                           },
            } as NativeFunctionValue,
        ],
        [
            "add",
            {
                type:      RuntimeValueType.NativeFunction,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 3, "<reflect>::add");
                               check_arg_type(args[0]!, RuntimeValueType.Struct, "<reflect>::add");
                               check_arg_type(args[1]!, RuntimeValueType.String, "<reflect>::add");
                               check_mutability(args[0]!, "<reflect>::add");

                               const instance = args[0] as StructValue;
                               const key = (args[1] as StringValue).value;
                               const value = args[2]!;

                               instance.properties.set(key, value);
                           },
            } as NativeFunctionValue,
        ],
        [
            "remove",
            {
                type:      RuntimeValueType.NativeFunction,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<reflect>::remove");
                               check_arg_type(args[0]!, RuntimeValueType.Struct, "<reflect>::remove");
                               check_arg_type(args[1]!, RuntimeValueType.String, "<reflect>::remove");
                               check_mutability(args[0]!, "<reflect>::remove");

                               const instance = args[0] as StructValue;
                               const key = (args[1] as StringValue).value;

                               return {
                                   type:  RuntimeValueType.Boolean,
                                   value: instance.properties.delete(key),
                               } as BooleanValue;
                           },
            } as NativeFunctionValue,
        ],
        [
            "identifier",
            {
                type:      RuntimeValueType.NativeFunction,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<reflect>::identifier");
                               check_arg_type(args[0]!, RuntimeValueType.Struct, "<reflect>::identifier");

                               const instance = args[0] as StructValue;

                               return {
                                   type:  RuntimeValueType.String,
                                   value: instance.identifier,
                               } as StringValue;
                           },
            } as NativeFunctionValue,
        ],
    ]),
};