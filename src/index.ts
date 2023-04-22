import * as jsyaml from "js-yaml"

type OnWorkflowCall = {
  inputs: { [key: string]: { description: string, required: boolean, default: string } }
  outputs: { [key: string]: { description: string, value: string } }
  secrets: { [key: string]: string }
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

type Workflow = {
  name: string
  "run-name": string
  on: WorkflowTrigger | WorkflowTrigger[]
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
    { push: { branches: ["master"] }}
  ]
}

// Output
console.log(jsyaml.dump(exampleWorkflow));
