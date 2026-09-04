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
import {check_args_length, check_mutability, is_equal} from "@utils";

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
                call: (_: RuntimeValue[]) =>
                      {
                          return {
                              type:     RuntimeValueType.Map,
                              elements: []
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