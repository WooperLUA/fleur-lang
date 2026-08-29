import type {ArrayValue, NativeFunctionValue, NumberValue, RuntimeValue, SetValue, StructValue,} from "@types";
import {type BooleanValue, RuntimeValueType,} from "@types";
import {check_arg_type, check_args_length, check_mutability, is_equal,} from "@utils";

export const set: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "Set",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "new",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          const set: any[] = []

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
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<set>::add");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::add");
                               check_mutability(args[0]!, "<set>::add");

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
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<set>::remove");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::remove");
                               check_mutability(args[0]!, "<set>::remove");

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
            "get",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<set>::get");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::get");
                               check_arg_type(args[1]!, RuntimeValueType.Number, "<set>::get");

                               const set = args[0] as SetValue;
                               const index = (args[1] as NumberValue).value;
                               const val = set.elements[index];
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
                               check_args_length(args, 3, "<set>::set");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::set");
                               check_arg_type(args[1]!, RuntimeValueType.Number, "<set>::set");
                               check_mutability(args[0]!, "<set>::set");

                               const set = args[0] as SetValue;
                               const index = (args[1] as NumberValue).value;
                               set.elements[index] = args[2]!;

                               return set;
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
                               check_args_length(args, 2, "<set>::contains");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::contains");
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
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<set>::length");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::length");
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
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<set>::clear");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::clear");
                               check_mutability(args[0]!, "<set>::clear");

                               const s = args[0] as SetValue;
                               s.elements.length = 0;
                               return s;
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
                               check_args_length(args, 1, "<set>::pop");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::pop");
                               check_mutability(args[0]!, "<set>::pop");

                               const set = args[0] as SetValue;
                               const val = set.elements.pop();

                               return val ?? {type: RuntimeValueType.Null, value: null};
                           },
            } as NativeFunctionValue,
        ],
        [
            "index",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<set>::index");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::index");

                               const set = args[0] as SetValue;
                               const target = args[1]!;

                               const foundIndex = set.elements.findIndex((el) => is_equal(el, target));

                               if (foundIndex !== -1)
                               {
                                   return {
                                       type:  RuntimeValueType.Number,
                                       value: foundIndex
                                   } as NumberValue;
                               }

                               return {type: RuntimeValueType.Null, value: null};
                           },
            } as NativeFunctionValue,
        ],
        [
            "first",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<set>::first");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::first");

                               const set = args[0] as SetValue;
                               const val = set.elements[0];

                               return val ?? {type: RuntimeValueType.Null, value: null};
                           },
            } as NativeFunctionValue,
        ],
        [
            "last",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<set>::last");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::last");

                               const set = args[0] as SetValue;
                               const val = set.elements[set.elements.length - 1];

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
                               check_args_length(args, 3, "<set>::insert");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::insert");
                               check_arg_type(args[1]!, RuntimeValueType.Number, "<set>::insert");
                               check_mutability(args[0]!, "<set>::insert");

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
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<set>::concat");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::concat");
                               check_arg_type(args[1]!, RuntimeValueType.Set, "<set>::concat");

                               const arr1 = args[0] as SetValue;
                               const arr2 = args[1] as SetValue;

                               const combined = [...arr1.elements, ...arr2.elements];
                               const unique = combined.filter((el, i, self) =>
                                   self.findIndex((e) => is_equal(e, el)) === i
                               );
                               return {type: RuntimeValueType.Set, elements: unique} as SetValue;
                           },
            } as NativeFunctionValue,
        ],
    ]),
};