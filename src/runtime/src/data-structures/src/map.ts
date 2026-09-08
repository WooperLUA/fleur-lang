import type {
    ArrayValue,
    BooleanValue,
    MapValue,
    NativeFunctionValue,
    NumberValue,
    RuntimeValue,
    StructValue
} from "@types";
import {RuntimeValueType} from "@types";
import {check_arg_type, check_args_length, check_mutability, is_equal, throw_exception} from "@utils";
import {type} from "../../stdlib/src/type.ts";

const find_key_index = (elements: { key: RuntimeValue; value: RuntimeValue }[], target: RuntimeValue): number =>
{
    return elements.findIndex(el => is_equal(el.key, target));
};

export const map: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "Map",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "new",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, [0, 1], "Map::new");
                          const elements: { key: RuntimeValue; value: RuntimeValue }[] = [];

                          if (args.length === 1)
                          {
                              check_arg_type(args[0]!, RuntimeValueType.Array, "Map::new");
                              const arr = args[0]! as ArrayValue

                              for (const item of arr.elements)
                              {
                                  if (item.type !== RuntimeValueType.Array)
                                  {
                                      throw_exception({
                                          type:    "Runtime",
                                          message: "Map::new expects an Array of [key, value] tuples."
                                      });
                                  }

                                  const tuple = item as ArrayValue;
                                  if (tuple.elements.length !== 2)
                                  {
                                      throw_exception({
                                          type:    "Runtime",
                                          message: "Map::new expects tuples of exactly 2 elements [key, value]."
                                      });
                                  }

                                  const key = tuple.elements[0]!;
                                  const value = tuple.elements[1]!;

                                  const idx = find_key_index(elements, key);
                                  if (idx !== -1)
                                  {
                                      elements[idx]!.value = value;
                                  }
                                  else
                                  {
                                      elements.push({key, value});
                                  }
                              }
                          }

                          return {
                              type:     RuntimeValueType.Map,
                              elements: elements
                          } as MapValue;
                      }
            } as NativeFunctionValue
        ],
        [
            "set",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 3, "<map>::set");
                               check_mutability(args[0]!, "<map>::set");
                               const m = args[0] as MapValue;
                               const key = args[1]!;
                               const value = args[2]!;

                               const idx = find_key_index(m.elements, key);
                               if (idx !== -1)
                               {
                                   m.elements[idx]!.value = value;
                               }
                               else
                               {
                                   m.elements.push({key, value});
                               }
                               return m;
                           }
            } as NativeFunctionValue
        ],
        [
            "get",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<map>::get");
                               const m = args[0] as MapValue;
                               const key = args[1]!;
                               const idx = find_key_index(m.elements, key);
                               return idx !== -1 ? m.elements[idx]!.value : {type: RuntimeValueType.Null, value: null};
                           }
            } as NativeFunctionValue
        ],
        [
            "has",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<map>::has");
                               const m = args[0] as MapValue;
                               const key = args[1]!;
                               return {
                                   type:  RuntimeValueType.Boolean,
                                   value: find_key_index(m.elements, key) !== -1
                               } as BooleanValue;
                           }
            } as NativeFunctionValue
        ],
        [
            "remove",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<map>::remove");
                               check_mutability(args[0]!, "<map>::remove");
                               const m = args[0] as MapValue;
                               const key = args[1]!;
                               const idx = find_key_index(m.elements, key);
                               if (idx !== -1)
                               {
                                   m.elements.splice(idx, 1);
                                   return m
                               }
                               return m;
                           }
            } as NativeFunctionValue
        ],
        [
            "length",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<map>::length");
                               const m = args[0] as MapValue;
                               return {type: RuntimeValueType.Number, value: m.elements.length} as NumberValue;
                           }
            } as NativeFunctionValue
        ],
        [
            "keys",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<map>::keys");
                               const m = args[0] as MapValue;
                               return {
                                   type:     RuntimeValueType.Array,
                                   elements: m.elements.map(el => el.key)
                               } as ArrayValue;
                           }
            } as NativeFunctionValue
        ],
        [
            "values",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<map>::values");
                               const m = args[0] as MapValue;
                               return {
                                   type:     RuntimeValueType.Array,
                                   elements: m.elements.map(el => el.value)
                               } as ArrayValue;
                           }
            } as NativeFunctionValue
        ],
        [
            "iterate",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<map>::iterate");
                               const m = args[0] as MapValue;
                               const iterator = m.elements.map(el => ({
                                   type:     RuntimeValueType.Array,
                                   elements: [el.key, el.value]
                               } as ArrayValue));
                               return {
                                   type:     RuntimeValueType.Array,
                                   elements: iterator
                               } as unknown as ArrayValue;
                           }
            } as NativeFunctionValue
        ],
        [
            "clear",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<map>::clear");
                               check_mutability(args[0]!, "<map>::clear");
                               const m = args[0] as MapValue;
                               m.elements.length = 0;
                               return m;
                           }
            } as NativeFunctionValue
        ]
    ])
};