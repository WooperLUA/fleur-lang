import {
    type ArrayValue,
    type BooleanValue,
    type NativeFunctionValue,
    type NumberValue,
    type RangeValue,
    type RuntimeValue,
    RuntimeValueType,
    type StringValue,
    type StructValue,
} from "@types";
import {check_arg_type, check_args_length, check_mutability, is_equal, throw_exception,} from "@utils";

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
            "from",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "Array::from");
                          check_arg_type(args[0]!, [RuntimeValueType.Range, RuntimeValueType.Array], "Array::from");

                          let elements: RuntimeValue[] = [];
                          const arg = args[0]!;

                          switch (arg.type)
                          {
                              case RuntimeValueType.Range:
                              {
                                  const range = arg as RangeValue;
                                  if (range.start.type !== RuntimeValueType.Number || range.end.type !== RuntimeValueType.Number)
                                  {
                                      throw_exception({type: "Runtime", message: "Range bounds must be numbers."});
                                  }
                                  const start = (range.start as NumberValue).value;
                                  const end = (range.end as NumberValue).value;
                                  const step = start <= end ? 1 : -1;

                                  for (let i = start; step > 0 ? i <= end : i >= end; i += step)
                                  {
                                      elements.push({type: RuntimeValueType.Number, value: i});
                                  }
                                  break
                              }
                              case RuntimeValueType.Array:
                              {
                                  const arr = arg as ArrayValue;
                                  elements = Array.from(arr.elements);
                              }
                          }

                          return {
                              type:     RuntimeValueType.Array,
                              elements: elements,
                          } as ArrayValue;
                      }
            }
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
                               check_mutability(args[0]!, "<array>::add");

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
                               check_mutability(args[0]!, "<array>::remove");

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
                               check_mutability(args[0]!, "<array>::clear");

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
                               check_mutability(args[0]!, "<array>::pop");

                               const arr = args[0] as ArrayValue;
                               const val = arr.elements.pop();

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
                               check_args_length(args, 2, "<array>::index");
                               check_arg_type(args[0]!, RuntimeValueType.Array, "<array>::index");

                               const arr = args[0] as ArrayValue;
                               const target = args[1]!;

                               const foundIndex = arr.elements.findIndex((el) => is_equal(el, target));

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
                               check_args_length(args, 1, "<array>::first");
                               check_arg_type(args[0]!, RuntimeValueType.Array, "<array>::first");

                               const arr = args[0] as ArrayValue;
                               const val = arr.elements[0];

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
                               check_args_length(args, 1, "<array>::last");
                               check_arg_type(args[0]!, RuntimeValueType.Array, "<array>::last");

                               const arr = args[0] as ArrayValue;
                               const val = arr.elements[arr.elements.length - 1];

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
                               check_mutability(args[0]!, "<array>::insert");

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
                               check_mutability(args[0]!, "<array>::set");

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
        [
            "slice",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<array>::slice");
                               check_arg_type(args[0]!, RuntimeValueType.Array, "<array>::slice");
                               check_arg_type(args[1]!, RuntimeValueType.Range, "<array>::slice");

                               const arr = args[0] as ArrayValue;
                               const range = args[1] as RangeValue;

                               const startVal = (range.start as NumberValue).value;
                               const endVal = (range.end as NumberValue).value;

                               const len = arr.elements.length;

                               let start = startVal < 0 ? len + startVal : startVal;
                               let end = endVal < 0 ? len + endVal : endVal;

                               const elements: RuntimeValue[] = [];
                               const step = start <= end ? 1 : -1;

                               for (let i = start; step > 0 ? i <= end : i >= end; i += step)
                               {
                                   if (i >= 0 && i < len)
                                   {
                                       elements.push(arr.elements[i]!);
                                   }
                               }

                               return {
                                   type:     RuntimeValueType.Array,
                                   elements: elements,
                               } as ArrayValue;
                           },
            } as NativeFunctionValue,
        ],
    ]),
};