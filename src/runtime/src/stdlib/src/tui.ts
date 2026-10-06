import {RuntimeValueType, type StringValue, type NumberValue} from "@types";
import {check_args_length} from "@utils";
import type {RuntimeValue, NativeFunctionValue, StructValue} from "@types";

const ANSI_COLORS: Record<string, string> = {
    "BLACK": "\x1b[30m",
    "RED": "\x1b[31m",
    "GREEN": "\x1b[32m",
    "YELLOW": "\x1b[33m",
    "BLUE": "\x1b[34m",
    "MAGENTA": "\x1b[35m",
    "CYAN": "\x1b[36m",
    "WHITE": "\x1b[37m",
    "GRAY": "\x1b[90m",
    "BG_RED": "\x1b[41m",
    "BG_GREEN": "\x1b[42m",
    "BG_YELLOW": "\x1b[43m",
    "BG_BLUE": "\x1b[44m",
    "BOLD": "\x1b[1m",
    "UNDERLINE": "\x1b[4m",
};

const get_colored_char = (char: string, color: string | null): string =>
{
    if (!color) return char;

    // Allow passing raw ANSI codes directly, or look up by name (e.g., "RED")
    const code = color.startsWith('\x1b[') ? color : ANSI_COLORS[color.toUpperCase()];

    if (code)
    {
        return `${code}${char}\x1b[0m`; // \x1b[0m resets the color to prevent bleeding
    }
    return char;
};

const tui_properties = new Map<string, RuntimeValue>();
for (const [name, code] of Object.entries(ANSI_COLORS))
{
    tui_properties.set(name, {type: RuntimeValueType.String, value: code});
}

const width = process.stdout.columns || 80;
const height = process.stdout.rows || 24;
let front_buffer: string[][] = createEmptyBuffer();
let back_buffer: string[][] = createEmptyBuffer();
let is_initialized = false;

function createEmptyBuffer(): string[][]
{
    const buf: string[][] = [];
    for (let y = 0; y < height; y++)
    {
        buf.push(new Array(width).fill(" "));
    }
    return buf;
}

const ESC = "\x1b[";
const HIDE_CURSOR = `${ESC}?25l`;
const SHOW_CURSOR = `${ESC}?25h`;
const CLEAR_SCREEN = `${ESC}2J${ESC}H`;

export const tui: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "tui",
    properties: tui_properties,
    methods:    new Map<string, any>([
        [
            "init",
            {
                type: RuntimeValueType.NativeFunction,
                call: () =>
                      {
                          process.stdout.write(CLEAR_SCREEN + HIDE_CURSOR);
                          process.stdin.setRawMode(true);
                          process.stdin.resume();
                          is_initialized = true;
                          return {type: RuntimeValueType.Null, value: null};
                      }
            } as NativeFunctionValue
        ],
        [
            "close",
            {
                type: RuntimeValueType.NativeFunction,
                call: () =>
                      {
                          process.stdout.write(SHOW_CURSOR + CLEAR_SCREEN);
                          process.stdin.setRawMode(false);
                          process.stdin.pause();
                          is_initialized = false;
                          return {type: RuntimeValueType.Null, value: null};
                      }
            } as NativeFunctionValue
        ],
        [
            "set",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, [3, 4], "tui::set");
                          const x = (args[0] as NumberValue).value;
                          const y = (args[1] as NumberValue).value;
                          const char = (args[2] as StringValue).value.charAt(0) || " ";
                          const color = args[3] ? (args[3] as StringValue).value : null;

                          if (x >= 0 && x < width && y >= 0 && y < height)
                          {
                              back_buffer[y]![x] = get_colored_char(char, color);
                          }
                          return {type: RuntimeValueType.Null, value: null};
                      }
            } as NativeFunctionValue
        ],
        [
            "box",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, [4, 5], "tui::box");
                          const x = (args[0] as NumberValue).value;
                          const y = (args[1] as NumberValue).value;
                          const w = (args[2] as NumberValue).value;
                          const h = (args[3] as NumberValue).value;
                          const color = args[4] ? (args[4] as StringValue).value : null;

                          const c = (ch: string) => get_colored_char(ch, color);

                          for (let i = 0; i < w; i++)
                          {
                              if (x + i < width)
                              {
                                  if (y < height) back_buffer[y]![x + i] = c("─");
                                  if (y + h - 1 < height) back_buffer[y + h - 1]![x + i] = c("─");
                              }
                          }
                          for (let i = 0; i < h; i++)
                          {
                              if (y + i < height)
                              {
                                  if (x < width) back_buffer[y + i]![x] = c("│");
                                  if (x + w - 1 < width) back_buffer[y + i]![x + w - 1] = c("│");
                              }
                          }
                          if (x < width && y < height) back_buffer[y]![x] = c("┌");
                          if (x + w - 1 < width && y < height) back_buffer[y]![x + w - 1] = c("┐");
                          if (x < width && y + h - 1 < height) back_buffer[y + h - 1]![x] = c("└");
                          if (x + w - 1 < width && y + h - 1 < height) back_buffer[y + h - 1]![x + w - 1] = c("┘");

                          return {type: RuntimeValueType.Null, value: null};
                      }
            } as NativeFunctionValue
        ],
        [
            "text",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, [3, 4], "tui::text");
                          const x = (args[0] as NumberValue).value;
                          const y = (args[1] as NumberValue).value;
                          const text = (args[2] as StringValue).value;
                          const color = args[3] ? (args[3] as StringValue).value : null;

                          for (let i = 0; i < text.length; i++)
                          {
                              if (x + i < width && y < height && x + i >= 0 && y >= 0)
                              {
                                  back_buffer[y]![x + i] = get_colored_char(text[i]!, color);
                              }
                          }
                          return {type: RuntimeValueType.Null, value: null};
                      }
            } as NativeFunctionValue
        ],
        [
            "render",
            {
                type: RuntimeValueType.NativeFunction,
                call: () =>
                      {
                          // Move cursor to top-left without clearing (faster than CLEAR_SCREEN)
                          let output = `${ESC}H`;
                          for (let y = 0; y < height; y++)
                          {
                              output += back_buffer[y]!.join("") + (y < height - 1 ? "\n" : "");
                          }
                          process.stdout.write(output);

                          // Swap buffers
                          front_buffer = back_buffer;
                          back_buffer = createEmptyBuffer(); // Clear back buffer for next frame
                          return {type: RuntimeValueType.Null, value: null};
                      }
            } as NativeFunctionValue
        ],
        [
            "width",
            {
                type: RuntimeValueType.NativeFunction,
                call: () => ({type: RuntimeValueType.Number, value: width})
            } as NativeFunctionValue
        ],
        [
            "height",
            {
                type: RuntimeValueType.NativeFunction,
                call: () => ({type: RuntimeValueType.Number, value: height})
            } as NativeFunctionValue
        ]
    ])
};