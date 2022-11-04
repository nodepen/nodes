
using System;
using System.Collections.Generic;
using Speckle.Core.Models;
using Objects.Geometry;

namespace Rhino.Compute
{

    public class TestModel : Base
    {
        [DetachProperty]
        public List<Polyline> displayValue { get; private set; }

        public Box bbox { get; private set; }
        public int random { get; private set; }

        public TestModel()
        {
            displayValue = new List<Polyline>() {
                new Polyline(
                    new List<double>() {
                        0,
                        0,
                        0,
                        1,
                        2,
                        3
                    }
                )
            };

            bbox = displayValue[0].bbox;
            random = new Random().Next();
        }
    }
}