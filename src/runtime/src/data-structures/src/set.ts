import {
    type ArrayValue,
    type BooleanValue,
    type NativeFunctionValue,
    type NumberValue,
    type RangeValue,
    type RuntimeValue,
    RuntimeValueType,
    type SetValue,
    type StringValue,
    type StructValue,
} from "@types";
import {check_arg_type, check_args_length, check_mutability, is_equal, throw_exception,} from "@utils";

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
            "from",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "Set::from");
                          check_arg_type(args[0]!, [RuntimeValueType.Range, RuntimeValueType.Set, RuntimeValueType.Array], "Set::from");

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
                                      const value: RuntimeValue = {type: RuntimeValueType.Number, value: i};
                                      const exists = elements.some((el) => is_equal(el, value));
                                      if (!exists)
                                      {
                                          elements.push(value);
                                      }
                                  }
                                  break
                              }
                              case RuntimeValueType.Array:
                              {
                                  const arr = arg as ArrayValue;
                                  elements = arr.elements.filter((el, i, self) =>
                                      self.findIndex((e) => is_equal(e, el)) === i
                                  );
                                  break
                              }
                              case RuntimeValueType.Set:
                              {
                                  const arr = arg as SetValue;
                                  elements = Array.from(arr.elements);
                              }
                          }

                          return {
                              type:     RuntimeValueType.Set,
                              elements: elements,
                          } as SetValue;
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
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "Set::concat");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "Set::concat");
                               check_arg_type(args[1]!, RuntimeValueType.Set, "Set::concat");

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
        [
            "slice",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<set>::slice");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::slice");
                               check_arg_type(args[1]!, RuntimeValueType.Range, "<set>::slice");
                               check_mutability(args[0]!, "<set>::slice", "Use ::sliced for immutable sets");

                               const set = args[0] as SetValue;
                               const range = args[1] as RangeValue;

                               const startVal = (range.start as NumberValue).value;
                               const endVal = (range.end as NumberValue).value;

                               const len = set.elements.length;

                               let start = startVal < 0 ? len + startVal : startVal;
                               let end = endVal < 0 ? len + endVal : endVal;

                               const elements: RuntimeValue[] = [];
                               const step = start <= end ? 1 : -1;

                               for (let i = start; step > 0 ? i <= end : i >= end; i += step)
                               {
                                   if (i >= 0 && i < len)
                                   {
                                       elements.push(set.elements[i]!);
                                   }
                               }

                               set.elements = elements;

                               return set;
                           },
            } as NativeFunctionValue,
        ],
        [
            "sliced",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<set>::sliced");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::sliced");
                               check_arg_type(args[1]!, RuntimeValueType.Range, "<set>::sliced");

                               const set = args[0] as SetValue;
                               const range = args[1] as RangeValue;

                               const startVal = (range.start as NumberValue).value;
                               const endVal = (range.end as NumberValue).value;

                               const len = set.elements.length;

                               let start = startVal < 0 ? len + startVal : startVal;
                               let end = endVal < 0 ? len + endVal : endVal;

                               const elements: RuntimeValue[] = [];
                               const step = start <= end ? 1 : -1;

                               for (let i = start; step > 0 ? i <= end : i >= end; i += step)
                               {
                                   if (i >= 0 && i < len)
                                   {
                                       elements.push(set.elements[i]!);
                                   }
                               }

                               return {
                                   type:     RuntimeValueType.Set,
                                   elements: elements,
                               } as SetValue;
                           },
            } as NativeFunctionValue,
        ],
        [
            "reverse",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<set>::reverse");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::reverse");
                               check_mutability(args[0]!, "<set>::reverse", "Use ::reversed for immutable sets");

                               const set = (args[0] as SetValue);
                               set.elements.reverse();

                               return set;
                           },
            } as NativeFunctionValue,
        ],
        [
            "reversed",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<set>::reversed");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::reversed");

                               const set = (args[0] as SetValue);

                               return {
                                   type:     RuntimeValueType.Set,
                                   elements: [...set.elements].reverse(),
                               } as SetValue;
                           },
            } as NativeFunctionValue,
        ],
        [
            "sort",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<set>::sort");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::sort");
                               check_mutability(args[0]!, "<set>::sort", "Use ::sorted for immutable sets");

                               const set = args[0] as SetValue;
                               let set_type = null
                               for (const el of set.elements)
                               {
                                   if (set_type != null && set_type != el.type) return throw_exception({
                                       type:    "Runtime",
                                       message: "Set must have only one type of values to be sorted"
                                   })
                                   set_type = el.type
                               }

                               switch (set_type)
                               {
                                   case RuntimeValueType.Number:
                                   {
                                       const set_alt = set.elements as NumberValue[];
                                       set.elements = set_alt.sort((a, b) => a.value - b.value);
                                       break;
                                   }
                                   case RuntimeValueType.String:
                                   {
                                       const set_alt = set.elements as StringValue[];
                                       set.elements = set_alt.sort((a, b) => a.value.localeCompare(b.value));
                                       break;
                                   }
                                   case RuntimeValueType.Boolean:
                                   {
                                       const set_alt = set.elements as BooleanValue[];
                                       // @ts-ignore ts bullshit i dont want to have to deal with
                                       set.elements = set_alt.sort((a, b) => a.value - b.value);
                                       break;
                                   }
                                   case RuntimeValueType.Range:
                                   {
                                       const set_alt = set.elements as RangeValue[];
                                       set.elements = set_alt.sort((a, b) =>
                                       {
                                           const a_start = (a.start as NumberValue).value;
                                           const b_start = (b.start as NumberValue).value;
                                           const a_end = (a.end as NumberValue).value;
                                           const b_end = (b.end as NumberValue).value;

                                           if (a_start !== b_start)
                                           {
                                               return a_start - b_start;
                                           }

                                           return a_end - b_end;
                                       });
                                       break;
                                   }
                                   default:
                                   {
                                       return throw_exception({
                                           type:    "Runtime",
                                           message: "You can only sort Sets by Number, String, Booleans or Ranges"
                                       })
                                   }
                               }

                               return set
                           },
            } as NativeFunctionValue,
        ],
        [
            "sorted",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<set>::sorted");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::sorted");

                               const set = args[0] as SetValue;
                               let new_set = [];
                               let set_type = null
                               for (const el of set.elements)
                               {
                                   if (set_type != null && set_type != el.type) return throw_exception({
                                       type:    "Runtime",
                                       message: "Set must have only one type of values to be sorted"
                                   })
                                   set_type = el.type
                               }

                               switch (set_type)
                               {
                                   case RuntimeValueType.Number:
                                   {
                                       const set_alt = [...set.elements as NumberValue[]];
                                       new_set = set_alt.sort((a, b) => a.value - b.value);
                                       break;
                                   }
                                   case RuntimeValueType.String:
                                   {
                                       const set_alt = [...set.elements as StringValue[]];
                                       new_set = set_alt.sort((a, b) => a.value.localeCompare(b.value));
                                       break;
                                   }
                                   case RuntimeValueType.Boolean:
                                   {
                                       const set_alt = [...set.elements as BooleanValue[]];
                                       // @ts-ignore ts bullshit i dont want to have to deal with
                                       new_set = set_alt.sort((a, b) => a.value - b.value);
                                       break;
                                   }
                                   case RuntimeValueType.Range:
                                   {
                                       const set_alt = [...set.elements as RangeValue[]];
                                       new_set = set_alt.sort((a, b) =>
                                       {
                                           const a_start = (a.start as NumberValue).value;
                                           const b_start = (b.start as NumberValue).value;
                                           const a_end = (a.end as NumberValue).value;
                                           const b_end = (b.end as NumberValue).value;

                                           if (a_start !== b_start)
                                           {
                                               return a_start - b_start;
                                           }

                                           return a_end - b_end;
                                       });
                                       break;
                                   }
                                   default:
                                   {
                                       return throw_exception({
                                           type:    "Runtime",
                                           message: "You can only sort Sets by Number, String, Booleans or Ranges"
                                       })
                                   }
                               }

                               return {
                                   type : RuntimeValueType.Set,
                                   elements : new_set
                               } as SetValue;
                           },
            } as NativeFunctionValue,
        ],
        [
            "group",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<set>::group");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::group");
                               check_arg_type(args[1]!, RuntimeValueType.Number, "<set>::group");
                               check_mutability(args[0]!, "<set>::group");

                               const set = (args[0] as SetValue);
                               const group_size = (args[1] as NumberValue).value;

                               if (group_size <= 0)
                               {
                                   return throw_exception({
                                       type : "Runtime",
                                       message : "Group size must be greater than 0"
                                   });
                               }

                               const grouped_set: RuntimeValue[] = [];
                               let group_buffer: Array<RuntimeValue> = [];

                               for (const el of set.elements)
                               {
                                   if (group_buffer.length === group_size)
                                   {
                                       grouped_set.push({
                                           type:     RuntimeValueType.Set,
                                           elements: group_buffer,
                                       } as SetValue);
                                       group_buffer = [];
                                   }
                                   group_buffer.push(el);
                               }

                               if (group_buffer.length > 0)
                               {
                                   grouped_set.push({
                                       type:     RuntimeValueType.Set,
                                       elements: group_buffer,
                                   } as SetValue);
                               }

                               set.elements = grouped_set;

                               return set;
                           },
            } as NativeFunctionValue,
        ],
        [
            "grouped",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<set>::grouped");
                               check_arg_type(args[0]!, RuntimeValueType.Set, "<set>::grouped");
                               check_arg_type(args[1]!, RuntimeValueType.Number, "<set>::grouped");

                               const set = (args[0] as SetValue);
                               const group_size = (args[1] as NumberValue).value;

                               if (group_size <= 0)
                               {
                                   return throw_exception({
                                       type : "Runtime",
                                       message : "Group size must be greater than 0"
                                   });
                               }

                               const grouped_set: RuntimeValue[] = [];
                               let group_buffer: Array<RuntimeValue> = [];

                               for (const el of set.elements)
                               {
                                   if (group_buffer.length === group_size)
                                   {
                                       grouped_set.push({
                                           type:     RuntimeValueType.Set,
                                           elements: group_buffer,
                                       } as SetValue);
                                       group_buffer = [];
                                   }
                                   group_buffer.push(el);
                               }

                               if (group_buffer.length > 0)
                               {
                                   grouped_set.push({
                                       type:     RuntimeValueType.Set,
                                       elements: group_buffer,
                                   } as SetValue);
                               }

                               return {
                                   type :     RuntimeValueType.Set,
                                   elements: grouped_set,
                               } as SetValue;
                           },
            } as NativeFunctionValue,
        ]
    ]),
};