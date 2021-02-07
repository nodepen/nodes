import { Grasshopper, Glasshopper } from 'glib'

export type GraphAction =
  | { type: 'demo' }
  | { type: 'session/load-components'; components: Grasshopper.Component[] }
  | { type: 'session/restore-session'; elements: string }
  | { type: 'session/expire-solution' }
  | { type: 'session/set-ready' }
  | { type: 'graph/register-camera'; ref: React.MutableRefObject<HTMLDivElement> }
  | { type: 'graph/register-element'; ref: React.MutableRefObject<HTMLDivElement | HTMLButtonElement>; id: string }
  | { type: 'graph/register-element-anchor'; elementId: string; anchorKey: string; position: [number, number] }
  | { type: 'graph/add-component'; position: [number, number]; component: Grasshopper.Component }
  | { type: 'graph/add-parameter'; position: [number, number]; component: Grasshopper.Component }
  | { type: 'graph/add-panel'; position: [number, number] }
  | { type: 'graph/selection-region'; from: [number, number]; to: [number, number]; partial: boolean }
  | { type: 'graph/selection-add'; id: string }
  | { type: 'graph/selection-remove'; id: string }
  | { type: 'graph/selection-toggle'; id: string }
  | { type: 'graph/selection-clear' }
  | {
      type: 'graph/wire/start-live-wire'
      from: [number, number]
      to: [number, number]
      owner: { element: string; parameter: string }
    }
  | { type: 'graph/wire/update-live-wire'; to: [number, number] }
  | { type: 'graph/wire/stop-live-wire' }
  | { type: 'graph/wire/capture-live-wire'; targetElement: string; targetParameter: string }
  | { type: 'graph/wire/release-live-wire'; targetElement: string; targetParameter: string }
  | { type: 'graph/values/expire-solution'; newSolutionId: string }
  | { type: 'graph/values/prepare-solution'; status: Glasshopper.Payload.SolutionReady }
  | { type: 'graph/values/request-solution-values'; requests: Glasshopper.Payload.SolutionValueRequest[] }
  | { type: 'graph/values/consume-solution-values'; values: Glasshopper.Payload.SolutionValue[] }
  | { type: 'graph/values/set-one-value'; targetElement: string; targetParameter: string; value: string }
  | {
      type: 'graph/values/set-parameter-values'
      solutionId: string
      targetElement: string
      targetParameter: string
      values: Glasshopper.Data.DataTree
    }
  | { type: 'graph/clear' }
  | { type: 'camera/reset' }
  | { type: 'camera/pan'; dx: number; dy: number }
