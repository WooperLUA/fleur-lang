---
title: TUI Module
description: Reference for the fleur tui module.
---

The `tui` module provides a native, double-buffered Terminal User Interface engine. It allows you to draw text, boxes,
and characters at specific X/Y coordinates with full ANSI color support, completely eliminating screen flickering.

## Initialization

Before drawing anything, you must initialize the terminal. This clears the screen, hides the blinking cursor, and puts
the terminal into "raw mode" to capture individual keypresses without waiting for `Enter`.

```flr
tui::init();
```

When your application exits, you **must** close the TUI to restore the terminal to its normal state.

```flr
tui::close();
```

:::caution[Always Close the TUI]
If your script crashes or exits without calling `tui::close()`, the user's terminal will be left in raw mode (hidden
cursor, no line buffering). It is highly recommended to wrap your main application logic in a `try/catch` block to
ensure `tui::close()` is always called on exit.
:::

## The Render Loop (Double Buffering)

The TUI engine uses a **double-buffer**. This means drawing functions do not write to the screen immediately. Instead,
they write to a hidden "back buffer" in memory.

To push your drawings to the screen, you must call `tui::render()`. This guarantees that the screen only updates once
per frame, preventing the ugly flickering associated with standard terminal printing.

```flr
// 1. Draw to the hidden buffer
tui::text(5, 5, "Hello!");

// 2. Push to screen
tui::render();
```

## Properties (Colors & Styles)

Colors and styles are exposed as static string properties on the `tui` struct. You can pass them as the optional last
argument to any drawing function.

| Foreground Colors | Background Colors | Styles          |
|:------------------|:------------------|:----------------|
| `tui.BLACK`       | `tui.BG_RED`      | `tui.BOLD`      |
| `tui.RED`         | `tui.BG_GREEN`    | `tui.UNDERLINE` |
| `tui.GREEN`       | `tui.BG_YELLOW`   |                 |
| `tui.YELLOW`      | `tui.BG_BLUE`     |                 |
| `tui.BLUE`        |                   |                 |
| `tui.MAGENTA`     |                   |                 |
| `tui.CYAN`        |                   |                 |
| `tui.WHITE`       |                   |                 |
| `tui.GRAY`        |                   |                 |

## Methods

| Member                                    | Return Type | Description                                                                                                                                      |
|:------------------------------------------|:------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| `init()`                                  | `Null`      | Initializes the terminal (clears screen, hides cursor, enables raw mode).                                                                        |
| `close()`                                 | `Null`      | Restores the terminal to its normal state.                                                                                                       |
| `set(x, y, char, color?)`                 | `Null`      | Draws a single character at the specified `x, y` coordinates.                                                                                    |
| `box(x, y, width, height, color?)`        | `Null`      | Draws an empty box using Unicode box-drawing characters (`┌ ─ ┐ │ └ ┘`) at the specified `x, y` coordinates with the specified `width, height`.  |
| `line(x1, y1, x2, y2, char, color?)`      | `Null`      | Draws a line box using the specified `char` *(or `─` if empty)* at the specified X/Y coordinates.                                                |
| `fill(x, y, width, height, char, color?)` | `Null`      | Draws a filled rectangle using the specified `char` *(or `█` if `null`)* at the specified `x, y` coordinates with the specified `width, height`. |
| `text(x, y, string, color?)`              | `Null`      | Draws a `string` of text starting at the specified `x, y` coordinates.                                                                           |
| `progress(x, y, width, percent, color?)`  | `Null`      | Draws a progress bar with the provided value `percent` at the specified `x, y` coordinates with the specified `width`.                           |
| `render()`                                | `Null`      | Flushes the back buffer to the screen (Zero flickering!).                                                                                        |
| `width()`                                 | `Number`    | Returns the current terminal width (columns).                                                                                                    |
| `height()`                                | `Number`    | Returns the current terminal height (rows).                                                                                                      |

## Example: Interactive Game Loop

```flr
try 
{
    tui::init();
    
    var player_x = 10;
    var player_y = 5;
    var running = true;
    
    while running 
    {
        tui::box(0, 0, tui::width(), tui::height(), tui.BLUE);
        tui::text(2, 1, "Fleur TUI Engine - WASD to move, Q to quit", tui.CYAN);
        
        tui::set(player_x, player_y, "@", tui.RED);
        
        tui::render();
        
        const key = io::read_key();
        
        when key 
        {
            "W" => { if player_y > 1 { player_y = player_y - 1; } }
            "S" => { if player_y < tui::height() - 2 { player_y = player_y + 1; } }
            "A" => { if player_x > 1 { player_x = player_x - 1; } }
            "D" => { if player_x < tui::width() - 2 { player_x = player_x + 1; } }
            "Q" => { running = false; }
            "CTRL_C" => { running = false; }
        }
    }
} 
catch err 
{
    // If a crash happens, we still want to be able to see the error
    tui::close();
    io::print("Error: ", err);
}

tui::close();
io::print("Thanks for playing!\n");
```