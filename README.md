# JIRA Commit Tool CLI (JCT)

## Description
JIRA Commit Tool CLI (JCT) is a command-line interface tool designed to help you manage your JIRA issues and commits efficiently.

JCT utilizes Git Flow and formats commits to seamlessly integrate with Jira. This allows Jira to automatically detect and display commits within your project. Additionally, JCT will create the corresponding issue branch if needed, ensuring adherence to Git Flow best practices. Currently, this functionality is optimized for agile SCRUM projects.

## Installation
Install the package globally using npm:
```sh
npm install -g jct-cli
```

## Usage
To use the JCT CLI, run the following command:
```sh
jct
```

## Commands
- `version`: Displays the current version of the tool.

- `config`: Configures the JCT settings.
    ## Configuration Options
    - `--user`: Set your JIRA username
    - `--token`: Set your JIRA token
    - `--url`: Set your JIRA host URL
    - `--project`: Set your JIRA project
    - `--sprint`: Set your JIRA sprint

- `lan`: Sets the language for the tool.

- `me`: Display the current configuration.



## Example
```sh
# Make a commit
jct

# Display the version
jct version

# Configure JCT settings
jct config --user 
jct config --token 
jct config --url 
jct config --project 
jct config --sprint 

# Set the language
jct lan

# Display the configuration
jct me
```