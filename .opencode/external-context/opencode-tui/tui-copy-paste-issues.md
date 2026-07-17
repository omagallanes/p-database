---
source: GitHub Issues + Official Docs
library: opencode / Crush
package: opencode-tui
topic: TUI copy/paste issues (Windows/Codespaces)
fetched: 2026-07-16T15:39:00Z
official_docs: https://github.com/charmbracelet/crush
---

# OpenCode/Crush TUI Copy/Paste Issues

## Important Context: Project Renamed

The `opencode-ai/opencode` project was **archived on Sep 18, 2025** and has continued under the name **`charmbracelet/crush`** (26.6k stars, actively maintained, latest release v0.85.0 as of Jul 16, 2026). Any issues you experience in the current opencode CLI should be tracked in the Crush repo.

- **Archived opencode repo**: https://github.com/opencode-ai/opencode
- **Current Crush repo**: https://github.com/charmbracelet/crush

---

## Root Cause

Both opencode and Crush use **Bubble Tea** (a Go TUI framework by Charm). When a Bubble Tea app enables mouse capture via `tea.WithMouseCellMotion()`, it intercepts all mouse events — including text selection — which **prevents the terminal's native copy/paste selection behavior**.

The fix was to **remove `tea.WithMouseCellMotion()`** and replace it with selective mouse handling (using `bubblezone`) so users can still click on UI elements but retain the ability to select text with the mouse.

### The Fix (OpenCode PR #127)

Commit `61d9dc9` — "fix: allow text selection" (merged Apr 30, 2025):
- **Removed**: `tea.WithMouseCellMotion()` from the program options
- **Added**: `bubblezone` for targeted mouse zone handling
- **Effect**: Users can now select text with the mouse in the TUI

---

## Known Issues

### OpenCode (Archived Repo)

| Issue | Status | Description |
|-------|--------|-------------|
| [#263 - "I can't copy messages"](https://github.com/opencode-ai/opencode/issues/263) | **Open** | User cannot copy messages from a session; no copy method found in docs |
| [#124 - "Able to mark text and copy"](https://github.com/opencode-ai/opencode/issues/124) | Closed (Fixed in PR #127) | User on Ghostty terminal couldn't copy text out of prompts; fixed by removing mouse cell motion |

### Crush (Current Repo) — Windows-Specific

| Issue | Status | Description |
|-------|--------|-------------|
| [#3092 - "Clipboard copy reports success but text is not copied when selecting output over SSH in Xshell on Windows"](https://github.com/charmbracelet/crush/issues/3092) | **Open** | **Most directly relevant to you.** Over SSH from Windows (Xshell), selecting text claims to copy but clipboard is not updated. Selection is intercepted/cleared by Crush. xclip/xsel installed on remote but don't help because OSC 52 / terminal-native selection is needed. |
| [#695 - "Cannot copy text from Crush CLI output in Windows Terminal (WSL2 on Windows 11)"](https://github.com/charmbracelet/crush/issues/695) | Closed (Fixed in PR #1575) | WSL2 on Windows 11 — text could not be selected/copied from Crush output |
| [#2000 - "unable to copy/paste in windows build"](https://github.com/charmbracelet/crush/issues/2000) | **Closed as not planned** | Windows build: user forced to type 160-char API key by hand because paste doesn't work |
| [#832 - "Right-click pasting API key causes app freeze and error in Windows 11"](https://github.com/charmbracelet/crush/issues/832) | Closed (Fixed) | Right-click paste in Windows 11 PowerShell caused app freeze |
| [#502 - "Problem pasting multiline logs/text using PowerShell on Windows"](https://github.com/charmbracelet/crush/issues/502) | Closed (Fixed) | Multiline paste issues in PowerShell on Windows |
| [#513 - "Copy, Paste, and the Mouse"](https://github.com/charmbracelet/crush/issues/513) | Closed (Migrated) | General copy/paste issues in SSH sessions |

### Codespaces-Specific Concerns

Codespaces uses a **web-based terminal** with SSH under the hood. This means:

1. **Selection is intercepted by the TUI** — When the TUI captures mouse events, selecting text in the Codespaces terminal doesn't work because Crush "eats" the mouse events before the terminal/browser can handle them.
2. **Clipboard access requires OSC 52** — For clipboard operations to work over SSH, the terminal must support the **OSC 52 escape sequence** (clipboard access protocol). Codespaces' web terminal may or may not forward this properly.
3. **The fix in PR #127 helps** — If you're on a version of opencode/Crush that does NOT use `WithMouseCellMotion()`, text selection should work, but **clipboard syncing over SSH/Codespaces is a separate issue**.

---

## Official Documentation on Clipboard

From the [Crush README Q&A](https://github.com/charmbracelet/crush):

> **Why is clipboard copy and paste not working?**
> Installing an extra tool might be needed on Unix-like environments.
>
> | Environment | Tool |
> |-------------|------|
> | Windows | Native support |
> | macOS | Native support |
> | Linux/BSD + Wayland | `wl-copy` and `wl-paste` |
> | Linux/BSD + X11 | `xclip` or `xsel` |

Note: "Native support" for Windows means **running Crush directly on Windows**, not over SSH. Over SSH/ Codespaces, clipboard tools on the remote Linux server (xclip, xsel) may not help because there's no X11/Wayland display to copy from.

---

## Workarounds

### 1. Use the Non-Interactive Mode (Best Workaround)

Instead of trying to copy from the TUI, use opencode/Crush in **non-interactive prompt mode** to get output to stdout where it can be copied:

```bash
# In opencode
opencode -p "your prompt here" > output.txt

# In Crush
crush -p "your prompt here" > output.txt
```

Then read `output.txt` and copy from there.

### 2. Use with `--output-format json` (opencode only)

```bash
opencode -p "your prompt" -f json > output.json
```

### 3. OSC 52 Clipboard Support

Ensure your terminal emulator supports **OSC 52** (Operating System Command 52 — clipboard access). If you're in Codespaces, the browser-based terminal relies on this protocol for clipboard operations over SSH. Check if your browser/environment allows clipboard access via the Permissions API.

### 4. Enable `yank` in Tmux (if using Tmux over SSH)

If you're using tmux inside Codespaces:
```tmux
set -g mouse on
```
Then hold Shift while selecting text to bypass tmux's mouse capture and use the terminal's native selection.

### 5. Hold Shift While Selecting (Terminal-Specific)

In many terminals (Windows Terminal, VS Code terminal, Codespaces web terminal), **holding Shift while clicking/dragging** bypasses the application's mouse capture and uses the terminal's native selection. Try:
- Hold `Shift` + click and drag to select text
- Use `Ctrl+Shift+C` to copy (standard in many terminals)

### 6. Pipe Output to a File

```bash
crush -p "generate a migration script" > migration.txt && cat migration.txt
```

### 7. Use a Terminal That Supports OSC 52

If you're on Windows and connecting via SSH (not Codespaces), use a terminal emulator that supports OSC 52:
- **Windows Terminal** (has partial OSC 52 support)
- **Kitty** (excellent OSC 52 support)
- **WezTerm** (good OSC 52 support)

---

## Summary

| Question | Answer |
|----------|--------|
| **Correct way to copy?** | Mouse selection should work in current versions (post-PR #127 fix). Try holding Shift while selecting. There is no dedicated "copy text" keyboard shortcut. |
| **Known issues?** | Yes. #3092 (Windows SSH/Xshell clipboard failure) and #263 (no message copy method) are open issues. |
| **Workarounds?** | Use `-p` non-interactive mode, pipe to file, hold Shift to bypass mouse capture, use OSC 52-compatible terminal. |
| **Is this known?** | Yes — this is a well-known limitation of TUI apps that capture mouse events. Multiple issues have been filed. The fix (removing mouse capture) was applied but has tradeoffs. |

## Relevant Links

- **Crush issue #3092 (Windows SSH clipboard)**: https://github.com/charmbracelet/crush/issues/3092
- **OpenCode issue #263 (can't copy messages)**: https://github.com/opencode-ai/opencode/issues/263
- **PR #127 fix (text selection)**: https://github.com/opencode-ai/opencode/pull/127
- **Crush README (clipboard Q&A)**: https://github.com/charmbracelet/crush
- **OpenCode README (keyboard shortcuts)**: https://github.com/opencode-ai/opencode
