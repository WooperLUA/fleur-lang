import {
    type BooleanValue,
    RuntimeValueType,
} from "@types";
import {
    check_args_length,
    check_arg_type,
    is_equal,
} from "@utils";
import type {
    RuntimeValue,
    NativeFunctionValue,
    StructValue,
    ArrayValue,
    NumberValue,
} from "@types";

export const set: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "set",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "new",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 0, "set::new");
                          return {
                              type:     RuntimeValueType.Array,
                              elements: [],
                          } as ArrayValue;
                      },
            } as NativeFunctionValue,
        ],
        [
            "add",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "set::add");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "set::add");

                          const arr = args[0] as ArrayValue;
                          const val = args[1]!;

                          const exists = arr.elements.some((el) => is_equal(el, val));
                          if (!exists)
                          {
                              arr.elements.push(val);
                          }

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
                          check_args_length(args, 2, "set::remove");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "set::remove");

                          const arr = args[0] as ArrayValue;
                          const val = args[1]!;

                          const index = arr.elements.findIndex((el) => is_equal(el, val));
                          if (index !== -1)
                          {
                              arr.elements.splice(index, 1);
                          }

                          return arr;
                      },
            } as NativeFunctionValue,
        ],
        [
            "has",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "set::has");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "set::has");

                          const arr = args[0] as ArrayValue;
                          const val = args[1]!;

                          const found = arr.elements.some((el) => is_equal(el, val));
                          return {
                              type:  RuntimeValueType.Boolean,
                              value: found,
                          } as BooleanValue;
                      },
            } as NativeFunctionValue,
        ],
        [
            "length",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "set::length");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "set::length");

                          const arr = args[0] as ArrayValue;
                          return {
                              type:  RuntimeValueType.Number,
                              value: arr.elements.length,
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
                          check_args_length(args, 1, "set::clear");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "set::clear");

                          const arr = args[0] as ArrayValue;
                          arr.elements.length = 0;

                          return arr;
                      },
            } as NativeFunctionValue,
        ],
    ]),
};
