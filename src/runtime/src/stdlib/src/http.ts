import type {MapValue, NativeFunctionValue} from "@types";
import {type RuntimeValue, RuntimeValueType, type StringValue, type StructValue,} from "@types";
import {check_arg_type, check_args_length, throw_exception} from "@utils";
import {execSync} from "node:child_process";

const build_response_struct = (status: number, body: string, url: string): MapValue =>
{
    const properties: { key: RuntimeValue, value: RuntimeValue }[] = [];
    properties.push({
        key:   {type: RuntimeValueType.String, value: 'status'},
        value: {type: RuntimeValueType.Number, value: status}
    });
    properties.push({
        key:   {type: RuntimeValueType.String, value: 'body'},
        value: {type: RuntimeValueType.String, value: body}
    });
    properties.push({
        key:   {type: RuntimeValueType.String, value: 'url'},
        value: {type: RuntimeValueType.String, value: url}
    });
    properties.push({
        key:   {type: RuntimeValueType.String, value: 'ok'},
        value: {type: RuntimeValueType.Boolean, value: status >= 200 && status < 300}
    });

    return {
        type:     RuntimeValueType.Map,
        elements: properties,
    };
};

export const http: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "http",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "request",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "http::request");
                          check_arg_type(args[0]!, RuntimeValueType.Map, "http::request");
                          const config = args[0]!;
                          6
                          const get_val = (key: string): RuntimeValue | undefined =>
                          {
                              const el = (config as any).elements.find((e: any) => (e.key as StringValue).value === key);
                              return el ? el.value : undefined;
                          };

                          const url_val = get_val("url");
                          if (!url_val || url_val.type !== RuntimeValueType.String)
                          {
                              throw_exception({
                                  type:    "Runtime",
                                  message: "http::request config must contain a string 'url'."
                              });
                          }
                          const url = (url_val as StringValue).value;

                          const method_val = get_val("method");
                          const method = method_val?.type === RuntimeValueType.String ? (method_val as StringValue).value.toUpperCase() : "GET";

                          const body_val = get_val("body");
                          const has_body = body_val && body_val.type === RuntimeValueType.String;

                          const headers_val = get_val("headers");

                          try
                          {
                              const curl_args = ["curl", "-s", "-w", "\\n%{http_code}", "-X", method];

                              if (has_body)
                              {
                                  curl_args.push("-H", "Content-Type: application/json", "-d", "@-");
                              }

                              if (headers_val && headers_val.type === RuntimeValueType.Map)
                              {
                                  const header_entries = (headers_val as any).elements;

                                  for (const entry of header_entries)
                                  {
                                      const h_key = (entry.key as StringValue).value;
                                      const h_val = entry.value;

                                      if (h_val.type === RuntimeValueType.String)
                                      {
                                          curl_args.push("-H", `${h_key}: ${h_val.value}`);
                                      }
                                  }
                              }

                              curl_args.push(url);

                              const raw_output = has_body
                                  ? execSync(curl_args.join(" "), {input: (body_val as StringValue).value}).toString()
                                  : execSync(curl_args.join(" ")).toString();

                              const lines = raw_output.split("\n");
                              const status_str = lines.pop()!.trim();
                              const body = lines.join("\n");
                              const status = parseInt(status_str, 10);

                              return build_response_struct(status, body, url);
                          }
                          catch (e: any)
                          {
                              throw_exception({
                                  type:    "Runtime",
                                  message: `HTTP request failed => ${(e.message as String).split('-X')[1]!.trimStart()}`
                              });
                              return {type: RuntimeValueType.Null, value: null};
                          }
                      }
            } as NativeFunctionValue
        ]
    ])
};