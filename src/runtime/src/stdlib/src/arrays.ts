import {
    type BooleanValue,
    RuntimeValueType, type StringValue,
} from "@types";
import {
    check_args_length,
    check_arg_type,
    is_equal,
    stringify_value,
} from "@utils";
import type {
    RuntimeValue,
    NativeFunctionValue,
    StructValue,
    ArrayValue,
    NumberValue,
} from "@types";

export const arrays: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "arrays",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "add",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "arrays::add");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "arrays::add");

                          const arr = args[0] as ArrayValue;
                          arr.elements.push(args[1]!);

                          return arr;
                      },
            } as NativeFunctionValue,
        ],
        [
            "remove",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "arrays::remove");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "arrays::remove");
                          check_arg_type(args[1]!, RuntimeValueType.Number, "arrays::remove");

                          const arr = args[0] as ArrayValue;
                          const index = (args[1] as NumberValue).value;

                          if (index >= 0 && index < arr.elements.length)
                          {
                              arr.elements.splice(index, 1);
                          }

                          return arr;
                      },
            } as NativeFunctionValue,
        ],
        [
            "length",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "arrays::length");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "arrays::length");

                          const arr = args[0] as ArrayValue;
                          return {
                              type:  RuntimeValueType.Number,
                              value: arr.elements.length
                          } as NumberValue;
                      },
            } as NativeFunctionValue,
        ],
        [
            "clear",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "arrays::clear");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "arrays::clear");

                          const arr = args[0] as ArrayValue;
                          arr.elements.length = 0;

                          return arr;
                      },
            } as NativeFunctionValue,
        ],
        [
            "pop",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "arrays::pop");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "arrays::pop");

                          const arr = args[0] as ArrayValue;
                          const val = arr.elements.pop();

                          return val ?? {type: RuntimeValueType.Null, value: null};
                      },
            } as NativeFunctionValue,
        ],
        [
            "insert",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 3, "arrays::insert");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "arrays::insert");
                          check_arg_type(args[1]!, RuntimeValueType.Number, "arrays::insert");

                          const arr = args[0] as ArrayValue;
                          const index = (args[1] as NumberValue).value;

                          arr.elements.splice(index, 0, args[2]!);
                          return arr;
                      },
            } as NativeFunctionValue,
        ],
        [
            "contains",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "arrays::contains");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "arrays::contains");

                          const arr = args[0] as ArrayValue;
                          const target = args[1]!;

                          const found = arr.elements.some((el) => is_equal(el, target));
                          return {
                              type:  RuntimeValueType.Boolean,
                              value: found,
                          } as BooleanValue;
                      },
            } as NativeFunctionValue,
        ],
        [
            "concat",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "arrays::concat");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "arrays::concat");
                          check_arg_type(args[1]!, RuntimeValueType.Array, "arrays::concat");

                          const arr1 = args[0] as ArrayValue;
                          const arr2 = args[1] as ArrayValue;

                          return {
                              type:     RuntimeValueType.Array,
                              elements: [...arr1.elements, ...arr2.elements],
                          } as ArrayValue;
                      },
            } as NativeFunctionValue,
        ],
    ]),
};
