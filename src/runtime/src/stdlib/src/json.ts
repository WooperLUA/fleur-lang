import {
    type ArrayValue,
    type MapValue,
    type NativeFunctionValue,
    type RangeValue,
    type RuntimeValue,
    RuntimeValueType,
    type SetValue,
    type StringValue,
    type StructValue
} from "@types";
import {check_arg_type, check_args_length, throw_exception} from "@utils";

export const fleur_to_js_value = (val: RuntimeValue): any =>
{
    switch (val.type)
    {
        case RuntimeValueType.Number:
        case RuntimeValueType.String:
        case RuntimeValueType.Boolean:
            return (val as any).value;

        case RuntimeValueType.Null:
            return null;

        case RuntimeValueType.Array:
            return (val as ArrayValue).elements.map(fleur_to_js_value);

        case RuntimeValueType.Set:
            return (val as SetValue).elements.map(fleur_to_js_value);

        case RuntimeValueType.Struct:
        {
            const obj: any = {};
            const struct = val as StructValue;
            for (const [k, v] of struct.properties.entries())
            {
                obj[k] = fleur_to_js_value(v);
            }
            return obj;
        }

        case RuntimeValueType.Map:
        {
            const map = val as MapValue;
            let all_string_keys = true;
            for (const el of map.elements)
            {
                if (el.key.type !== RuntimeValueType.String)
                {
                    all_string_keys = false;
                    break;
                }
            }

            if (all_string_keys)
            {
                const obj: any = {};
                for (const el of map.elements)
                {
                    obj[(el.key as StringValue).value] = fleur_to_js_value(el.value);
                }
                return obj;
            }
            else
            {
                return map.elements.map(el => [
                    fleur_to_js_value(el.key),
                    fleur_to_js_value(el.value)
                ]);
            }
        }

        case RuntimeValueType.Range:
        {
            const range = val as RangeValue;
            return {start: fleur_to_js_value(range.start), end: fleur_to_js_value(range.end)};
        }

        case RuntimeValueType.Error:
            return {error: (val as any).message};

        default:
            return null;
    }
};

export const js_to_fleur_value = (js_val: any): RuntimeValue =>
{
    if (js_val === null || js_val === undefined) return {type: RuntimeValueType.Null, value: null};
    if (typeof js_val === 'number') return {type: RuntimeValueType.Number, value: js_val};
    if (typeof js_val === 'string') return {type: RuntimeValueType.String, value: js_val};
    if (typeof js_val === 'boolean') return {type: RuntimeValueType.Boolean, value: js_val};

    if (Array.isArray(js_val))
    {
        return {type: RuntimeValueType.Array, elements: js_val.map(js_to_fleur_value)} as ArrayValue;
    }

    if (typeof js_val === 'object')
    {
        const elements: { key: RuntimeValue; value: RuntimeValue }[] = [];

        for (const [key, value] of Object.entries(js_val))
        {
            elements.push({
                key:   {type: RuntimeValueType.String, value: key},
                value: js_to_fleur_value(value)
            });
        }

        return {
            type:     RuntimeValueType.Map,
            elements: elements
        } as MapValue;
    }

    return {type: RuntimeValueType.Null, value: null};
};

export const json: StructValue =
    {
        type:       RuntimeValueType.Struct,
        identifier: "json",
        properties: new Map<string, RuntimeValue>(),
        methods:    new Map<string, any>([
            [
                "parse",
                {
                    type: RuntimeValueType.NativeFunction,
                    call: (args: RuntimeValue[]) =>
                          {
                              check_args_length(args, 1, "json::parse")
                              check_arg_type(args[0]!, RuntimeValueType.String, "json::parse")
                              const string = (args[0] as StringValue).value;
                              try
                              {
                                  const json = JSON.parse(string);
                                  return js_to_fleur_value(json);
                              }
                              catch (e: any)
                              {
                                  return throw_exception({
                                      type:     "Runtime",
                                      message:  `Failed to parse JSON`,
                                      metadata: e.message
                                  });
                              }
                          }
                } as NativeFunctionValue
            ],
            [
                "string",
                {
                    type: RuntimeValueType.NativeFunction,
                    call: (args: RuntimeValue[]) =>
                          {
                              check_args_length(args, 1, "json::string");
                              check_arg_type(args[0]!, [RuntimeValueType.Map, RuntimeValueType.Struct], "json::string")
                              const js_obj = fleur_to_js_value(args[0]!);

                              try
                              {
                                  const json_str = JSON.stringify(js_obj, null, 2);
                                  return {type: RuntimeValueType.String, value: json_str} as StringValue;
                              }
                              catch (e: any)
                              {
                                  return throw_exception({
                                      type:     "Runtime",
                                      message:  `Failed to stringify JSON`,
                                      metadata: e.message
                                  });
                              }
                          }
                } as NativeFunctionValue
            ],
        ])
    };