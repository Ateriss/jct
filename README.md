# ⭐ JIRA Commit Tool CLI (JCT)

**JCT** is a command-line interface tool designed to help developers efficiently manage **Jira issues**, keep their workflow aligned with **Git Flow**, and generate commit messages and branches following **Jira’s official formatting rules**.

JCT automatically formats commit messages and creates branches using Jira issue keys, ensuring seamless integration — Jira will automatically detect and display your commits and branches inside each ticket.

> 🧠 **Tip:** If JCT is not configured, running `jct` for the first time will guide you through the setup.
>
> If already configured, `jct` will display your sprint issues so you can pick one to work on.

⚡ **JCT is optimized for Agile SCRUM workflows.**

---

## 📦 Installation

Install globally with **npm**:

```bash
npm install -g jct-cli
```

---

## 🚀 Startup Banner

When running JCT command, you will see:

```
JCT V<Vesion>
░▀▀█░▀█▀░█▀▄░█▀█░░░█▀▀░█▀█░█▄█░█▄█░▀█▀░▀█▀░░░▀█▀░█▀█░█▀█░█░░
░░░█░░█░░█▀▄░█▀█░░░█░░░█░█░█░█░█░█░░█░░░█░░░░░█░░█░█░█░█░█░░
░▀▀░░▀▀▀░▀░▀░▀░▀░░░▀▀▀░▀▀▀░▀░▀░▀░▀░▀▀▀░░▀░░░░░▀░░▀▀▀░▀▀▀░▀▀▀
                                        by Ateriss

[Project not defined]     [Sprint not defined]

Sprint Goal:
[Not defined]
Ends on: [Not defined]
```

---

## 📘 Available Commands

Below is the complete list of **JCT commands, aliases, options, and examples.**

---

### 🔹 `jct` (main CLI command)

The main command used to create commits.

```bash
jct
```

**Behavior:**

✔ If JCT is not configured, it will automatically start the configuration wizard.  
✔ If JCT is configured, it will:

1. Fetch the current sprint  
2. List all issues assigned/to be worked on  
3. Ask you to choose an issue  
4. Ask for the type of commit (`feat`, `fix`, `docs`, etc.)  
5. Ask for a commit description  
6. Create (if needed) the branch following Jira specs  
7. Generate a properly formatted Jira commit  

**Example generated commit message:**

```
JCT-123 feat: add validation for sprint selection
```

**Example auto-generated branch (Jira standard):**

```
JCT-123
```

---

### 🔹 `version`

Shows the current JCT configuration.

```bash
jct version
```

**Alias:**
```bash
jct v
```

---

### 🔹 `config`

Configure Jira and JCT settings manually.

```bash
jct config
```

**Alias:**
```bash
jct c
```

#### Options

| Option | Description |
| :------ | :----------- |
| `--user`, `-u` | Set your Jira user email |
| `--token`, `-t` | Set your Jira API token |
| `--url`, `-or` | Set your Jira base workspace URL |
| `--project`, `-p` | Set your default Jira project |
| `--sprint`, `-s` | Set the active sprint ID |
| `--issues`, `-i` | Set specific issues to work on |

**Example:**

```bash
jct config --user
# or
jct c -u
```

---

### 🔹 `lan`

Changes the language of the CLI (EN / ES).

```bash
jct lan
```

---

### 🔹 `help`

Shows the help menu and current configuration.

```bash
jct help
```

**Alias:**
```bash
jct h
```

---

## 🌿 Git Flow Commit Types Used by JCT

These commit types follow **Conventional Commits** and **Git Flow** standards:

| Type | Meaning |
| :---- | :------- |
| `feat` | Adds a new feature |
| `fix` | Fixes a bug |
| `docs` | Documentation updates |
| `style` | Code formatting, no logic changes |
| `refactor` | Code restructure without changing behavior |
| `perf` | Performance improvements |
| `test` | New or updated tests |

---

## 🧩 JCT Commit & Branch Format (Jira Standard)

JCT formats commit messages and branches using Jira’s official convention:

### ✔ Commit Format
```
<ISSUE-KEY> <type>: <title>
<description>
```

**Example:**
```
JCT-204 refactor: improve validation utility
manage validations utils
```

---

### ✔ Branch Format
```
<ISSUE-KEY>
```

**Example:**
```
JCT-204
```

> This ensures Jira automatically recognizes and links the branch and commits.

---

## 🛠 Recommended Workflow

Run:

```bash
jct
```

Then:

1. Select your issue and create a commit and branch.  
2. Create a pull request as usual.  


---


💡 **Pro Tip:**  
JCT works best when integrated into your daily workflow — it keeps Jira, Git, and your team perfectly in sync.


