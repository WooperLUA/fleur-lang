import {
    type BooleanValue,
    RuntimeValueType, type SetValue, type StringValue,
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

export const array: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "Array",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "new",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          return {
                              type:     RuntimeValueType.Array,
                              elements: [...args],
                          } as ArrayValue;
                      },
            } as NativeFunctionValue,
        ],
        [
            "add",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "<array>::add");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "<array>::add");

                          const arr = args[0] as ArrayValue;
                          arr.elements.push(args[1]!);

                          return arr;
                      },
            } as NativeFunctionValue,
        ],
        [
            "remove",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "<array>::remove");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "<array>::remove");
                          check_arg_type(args[1]!, RuntimeValueType.Number, "<array>::remove");

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
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "<array>::length");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "<array>::length");

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
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "<array>::clear");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "<array>::clear");

                          const arr = args[0] as ArrayValue;
                          arr.elements.length = 0;

                          return arr;
                      },
            } as NativeFunctionValue,
        ],
        [
            "pop",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "<array>::pop");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "<array>::pop");

                          const arr = args[0] as ArrayValue;
                          const val = arr.elements.pop();

                          return val ?? {type: RuntimeValueType.Null, value: null};
                      },
            } as NativeFunctionValue,
        ],
        [
            "insert",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 3, "<array>::insert");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "<array>::insert");
                          check_arg_type(args[1]!, RuntimeValueType.Number, "<array>::insert");

                          const arr = args[0] as ArrayValue;
                          const index = (args[1] as NumberValue).value;

                          arr.elements.splice(index, 0, args[2]!);
                          return arr;
                      },
            } as NativeFunctionValue,
        ],
        [
            "get",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "<array>::get");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "<array>::get");
                          check_arg_type(args[1]!, RuntimeValueType.Number, "<array>::get");

                          const array = args[0] as ArrayValue;
                          const index = (args[1] as NumberValue).value;
                          const val = array.elements[index];
                          return val ?? {type: RuntimeValueType.Null, value: null};
                      },
            } as NativeFunctionValue,
        ],
        [
            "set",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 3, "<array>::set");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "<array>::set");
                          check_arg_type(args[1]!, RuntimeValueType.Number, "<array>::set");

                          const array = args[0] as ArrayValue;
                          const index = (args[1] as NumberValue).value;
                          array.elements[index] = args[2]!;

                          return array;
                      },
            } as NativeFunctionValue,
        ],
        [
            "contains",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "<array>::contains");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "<array>::contains");

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
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "<array>::concat");
                          check_arg_type(args[0]!, RuntimeValueType.Array, "<array>::concat");
                          check_arg_type(args[1]!, RuntimeValueType.Array, "<array>::concat");

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
