import {
    type ArrayValue,
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
    SetValue,
    NumberValue,
} from "@types";

export const sets: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "sets",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "new",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          const set : any[] = []

                          for (const arg of args)
                          {
                              const exists = set.some((el) => is_equal(el, arg));
                              if (!exists)
                              {
                                  set.push(arg);
                              }
                          }
                          return {
                              type:     RuntimeValueType.Set,
                              elements: set,
                          } as SetValue;
                      },
            } as NativeFunctionValue,
        ],
        [
            "add",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "sets::add");
                          check_arg_type(args[0]!, RuntimeValueType.Set, "sets::add");
                          const s = args[0] as SetValue;
                          const val = args[1]!;
                          const exists = s.elements.some((el) => is_equal(el, val));
                          if (!exists)
                          {
                              s.elements.push(val);
                          }
                          return s;
                      },
            } as NativeFunctionValue,
        ],
        [
            "remove",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "sets::remove");
                          check_arg_type(args[0]!, RuntimeValueType.Set, "sets::remove");
                          const s = args[0] as SetValue;
                          const val = args[1]!;
                          const index = s.elements.findIndex((el) => is_equal(el, val));
                          if (index !== -1)
                          {
                              s.elements.splice(index, 1);
                          }
                          return s;
                      },
            } as NativeFunctionValue,
        ],
        [
            "contains",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "sets::contains");
                          check_arg_type(args[0]!, RuntimeValueType.Set, "sets::contains");
                          const s = args[0] as SetValue;
                          const val = args[1]!;
                          const found = s.elements.some((el) => is_equal(el, val));
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
                          check_args_length(args, 1, "sets::length");
                          check_arg_type(args[0]!, RuntimeValueType.Set, "sets::length");
                          const s = args[0] as SetValue;
                          return {
                              type:  RuntimeValueType.Number,
                              value: s.elements.length,
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
                          check_args_length(args, 1, "sets::clear");
                          check_arg_type(args[0]!, RuntimeValueType.Set, "sets::clear");
                          const s = args[0] as SetValue;
                          s.elements.length = 0;
                          return s;
                      },
            } as NativeFunctionValue,
        ],
        [
            "pop",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "sets::pop");
                          check_arg_type(args[0]!, RuntimeValueType.Set, "sets::pop");

                          const arr = args[0] as SetValue;
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
                          check_args_length(args, 3, "sets::insert");
                          check_arg_type(args[0]!, RuntimeValueType.Set, "sets::insert");
                          check_arg_type(args[1]!, RuntimeValueType.Number, "sets::insert");

                          const set = args[0] as SetValue;
                          const index = (args[1] as NumberValue).value;
                          const val = args[2]!;

                          const exists = set.elements.some((el) => is_equal(el, val));
                          if (!exists)
                          {
                              set.elements.splice(index, 0, args[2]!);
                          }

                          return set;
                      },
            } as NativeFunctionValue,
        ],
        [
            "concat",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "sets::concat");
                          check_arg_type(args[0]!, RuntimeValueType.Set, "sets::concat");
                          check_arg_type(args[1]!, RuntimeValueType.Set, "sets::concat");

                          const arr1 = args[0] as SetValue;
                          const arr2 = args[1] as SetValue;

                          return {
                              type:     RuntimeValueType.Set,
                              elements: [...arr1.elements, ...arr2.elements],
                          } as SetValue;
                      },
            } as NativeFunctionValue,
        ],
    ]),
};