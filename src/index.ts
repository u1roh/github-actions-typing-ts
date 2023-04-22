import * as jsyaml from "js-yaml"

type OnWorkflowCall = {
  inputs: {
    [key: string]: {
      description: string
      required: boolean
      default?: string
      type: "string" | "boolean" | "number"
    }
  }
  outputs: {
    [key: string]: { description: string, value: string }
  }
  secrets: {
    [key: string]: string
  }
}

type OnWorkflowRun = {
  workflows: string[]
  types?: string[]
  branches?: string[]
  "branches-ignore"?: string[]
}

type OnWorkflowDispatch = {
  inputs: {
    [key: string]: {
      description: string
      required: boolean
      default?: string
      type: "string" | "boolean" | "number" | "environment" | "choice"
      options?: string[]
    }
  }
}

type WorkflowTrigger =
  | "push"
  | "fork"
  | { push: { branches?: string[], "branches-ignore"?: string[], tags?: string[], "tags-ignore"?: string[], paths?: string[], "paths-ignore"?: string[] } }
  | { pull_request: { branches?: string[], "branches-ignore"?: string[], paths?: string[], "paths-ignore"?: string[] } }
  | { label: { types: string[] } }
  | { issues: { types: string[] } }
  | { schedule: { cron: string }[] }
  | { workflow_call: OnWorkflowCall }
  | { workflow_run: OnWorkflowRun }
  | { workflow_dispatch: OnWorkflowDispatch }

type Permission = "none" | "read" | "write"
type Permissions = {
  actions?: Permission
  checks?: Permission
  contents?: Permission
  deployments?: Permission
  "id-token"?: Permission
  issues?: Permission
  discussions?: Permission
  packages?: Permission
  pages?: Permission
  "pull-requests"?: Permission
  "repository-projects"?: Permission
  "security-events"?: Permission
  statuses?: Permission
}

type Step = {
  name?: string
  id?: string
  if?: string
  uses?: string
  with?: { [key: string]: string }
  run?: string
  shell?: "bash" | "sh" | "pwsh" | "cmd" | "powershell" | "python" | string
  env?: { [key: string]: string }
  "continue-on-error"?: boolean
  "timeout-minutes"?: number
}

type Job = {
  name: string
  permissions?: Permissions | "read-all" | "write-all"
  "runs-on": "ubuntu-latest" | "windows-latest" | "macos-latest" | string
  needs?: string | string[]
  if?: string
  environment?: string | { name: string, url: string }
  concurrency?: string | { group: string, "cancel-in-progress": boolean }
  outputs?: { [key: string]: string }
  env?: { [key: string]: string }
  defaults?: {
    run?: {
      shell: string
      "working-directory": string
    }
  }
  steps: Step[]

  "timeout-minutes"?: number
  strategy?: {
    matrix?: { [key: string]: string[] } & { include?: { [key: string]: string }[] }
    "fail-fast"?: boolean
    "max-parallel"?: number
  }
  "continue-on-error"?: boolean
  container?: string | {
    image: string
    env?: { [key: string]: string }
    ports?: string[]
    volumes?: string[]
    options?: string
    credentials?: {
      username: string
      password: string
    }
  }
  services?: {
    [key: string]: {
      image: string
      env?: { [key: string]: string }
      ports?: string[]
      volumes?: string[]
      options?: string
      credentials?: {
        username: string
        password: string
      }
    }
  }
  uses?: string
  with?: { [key: string]: string }
  secrets?: { [key: string]: string } | "inherit"
}

type Workflow = {
  name: string
  "run-name": string
  on: WorkflowTrigger | WorkflowTrigger[]
  permissions?: Permissions | "read-all" | "write-all"
  env?: { [key: string]: string }
  defaults?: {
    run?: {
      shell: string
      "working-directory": string
    }
  }
  concurrency?: string | { group: string, "cancel-in-progress": boolean }
  jobs: { [key: string]: Job }
}

// Example
const exampleWorkflow: Workflow = {
  name: "hello",
  "run-name": "world",
  on: [
    {
      pull_request: {
        branches: ["master"],
      }
    },
    {
      workflow_dispatch: {
        inputs: {
          name: {
            description: "Who to greet",
            required: true,
            type: "string"
          }
        }
      }
    }
  ],
  permissions: {
    actions: "write",
  },
  env: {
    FOO: "bar"
  },
  jobs: {
    hello: {
      name: "Hello world",
      "runs-on": "ubuntu-latest",
      steps: [
        {
          name: "Hello world",
          run: "echo Hello world"
        }
      ]
    }
  }
}

// Output
console.log(jsyaml.dump(exampleWorkflow));
