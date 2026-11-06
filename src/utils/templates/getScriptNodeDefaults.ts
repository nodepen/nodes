import type * as NodePen from '@/types'

const CSHARP_SOURCE = `// Grasshopper Script Instance
#region Usings
using System;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;

using Rhino;
using Rhino.Geometry;

using Grasshopper;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Data;
using Grasshopper.Kernel.Types;
#endregion

public class Script_Instance : GH_ScriptInstance
{
    #region Notes
    /*
      Members:
        RhinoDoc RhinoDocument
        GH_Document GrasshopperDocument
        IGH_Component Component
        int Iteration

      Methods (Virtual & overridable):
        Print(string text)
        Print(string format, params object[] args)
        Reflect(object obj)
        Reflect(object obj, string method_name)
    */
    #endregion

    private void RunScript(object x, object y, ref object a)
    {
        // Write your logic here
        a = null;
    }
}`

const PYTHON_3_SOURCE = `"""Grasshopper Script"""
a = "Hello Python 3 in Grasshopper!"
print(a)`

export type ScriptNodeDefaults = {
    configuration: NodePen.ScriptNodeConfig
    inputs: string[]
    // stdout is first if enabled
    outputs: string[]
}

/** What a newly placed script component starts with. */
export const getScriptNodeDefaults = (language: NodePen.ScriptNodeLanguage): ScriptNodeDefaults => {
    return {
        configuration: {
            source: language === 'csharp' ? CSHARP_SOURCE : PYTHON_3_SOURCE,
            standardOutput: true,
        },
        inputs: ['x', 'y'],
        outputs: ['out', 'a'],
    }
}
