import { Grasshopper } from 'glib'
import { installed } from './installed'

const getAllowedIds = (): string[] => {
  return Object.values(allowedComponents).reduce(
    (allowedIds, subcategories) => {
      return [
        ...allowedIds,
        ...Object.values(subcategories).reduce(
          (categoryIds, subcategoryIds) => {
            return [...categoryIds, ...subcategoryIds]
          },
          [] as string[]
        ),
      ]
    },
    [] as string[]
  )
}

const allowedComponents = {
  params: {
    input: [
      '57da07bd-ecab-415d-9d86-af36d7073abc', // Number Slider
      '59e0b89a-e487-49f8-bab8-b5bab16be14c', // Panel
    ],
    /* eslint-disable-next-line */
    // @ts-ignore
    primitive: [
      // 'cb95db89-6165-43b6-9c41-5702bc5bf137', // Boolean (Bool)
      // '15b7afe5-d0d0-43e1-b894-34fcfe3be384', // Domain (Domain)
      // '2e3ab970-8545-46bb-836c-1c11e5610bce', // Integer (Int)
      // '3e8ca6be-fda8-4aaf-b5c0-3c54c8bb7312', // Number (Num)
      // '3ede854e-c753-40eb-84cb-b48008f14fd4', // Text (Txt)
    ],
  },
  maths: {
    domain: [
      'f44b92b0-3b5b-493a-86f4-fd7408c3daf3', // Bounds (Bnd)
      'd1a28e95-cf96-4936-bf34-8bf142d731bf', // Construct Domain (Dom)
      '825ea536-aebb-41e9-af32-8baeb2ecb590', // Deconstruct Domain (DeDomain)
      '2fcc2743-8339-4cdf-a046-a1f17439191d', // Remap Numbers (ReMap)
    ],
    operators: [
      'a0d62394-a118-422d-abb3-6af115c75b25', // Addition (A+B)
      '9c85271f-89fa-4e9f-9f4a-d75802120ccc', // Division (A/B)
      'ce46b74e-00c9-43c4-805a-193b69ea4a11', // Multiplication (A×B)
      'a3371040-e552-4bc8-b0ff-10a840258e88', // Negative (Neg)
      '78fed580-851b-46fe-af2f-6519a9d378e0', // Power (Pow)
      '9c007a04-d0d9-48e4-9da3-9ba142bc4d46', // Subtraction (A-B)
    ],
    trig: [
      'd2d2a900-780c-4d58-9a35-1f9d8d35df6f', // Cosine (Cos)
      '0d77c51e-584f-44e8-aed2-c2ddf4803888', // Degrees (Deg)
      'a4cd2751-414d-42ec-8916-476ebf62d7fe', // Radians (Rad)
      '7663efbb-d9b8-4c6a-a0da-c3750a7bbe77', // Sine (Sin)
      '0f31784f-7177-4104-8500-1f4f4a306df4', // Tangent (Tan)
    ],
  },
  sets: {
    list: [
      '59daf374-bc21-4a5e-8282-5504fb7ae9ae', // List Item (Item)
      '1817fd29-20ae-4503-b542-f0fb651e67d7', // List Length (Lng)
      '6ec97ea8-c559-47a2-8d0f-ce80c794d1f4', // Reverse List (Rev)
      '6f93d366-919f-4dda-a35e-ba03dd62799b', // Sort List (Sort)
      '9ab93e1a-ebdf-4090-9296-b000cff7b202', // Split List (Split)
    ],
    sequence: [
      '01640871-69ea-40ac-9380-4660d6d28bd2', // Char Sequence (CharSeq)
      'fe99f302-3d0d-4389-8494-bd53f7935a02', // Fibonacci (Fib)
      '2ab17f9a-d852-4405-80e1-938c5e57e78d', // Random (Random)
      'e64c5fb1-845c-4ab1-8911-5f338516ba67', // Series (Series)
    ],
    tree: [
      '41aa4112-9c9b-42f4-847e-503b9d90e4c7', // Flip Matrix (Flip)
      // 'f80cfe18-9510-4b89-8301-8e58faf423bb', // Flatten Tree (Flatten)
      '87e1d9ef-088b-4d30-9dda-8a7448a17329', // Graft Tree (Graft)
    ],
  },
  vector: {
    grid: [
      '125dc122-8544-4617-945e-bb9a0c101c50', // Hexagonal (HexGrid)
      'e2d958e8-9f08-44f7-bf47-a684882d0b2a', // Populate 2D (Pop2D)
      '66eedc35-187d-4dab-b49b-408491b1255f', // Radial (RadGrid)
      '1a25aae0-0b56-497a-85b2-cc5bf7e4b96b', // Rectangular (RecGrid)
      '717a1e25-a075-4530-bc80-d43ecc2500d9', // Square (SqGrid)
      '86a9944b-dea5-4126-9433-9e95ff07927a', // Triangular (TriGrid)
    ],
    plane: [
      'bc3e379e-7206-4e7b-b63a-ff61f4b38a3e', // Construct Plane (Pl)
      '3cd2949b-4ea8-4ffb-a70c-5c380f9f46ea', // Deconstruct Plane (DePlane)
      '17b7152b-d30d-4d50-b9ef-c9fe25576fc2', // XY Plane (XY)
      '8cc3a196-f6a0-49ea-9ed9-0cb343a3ae64', // XZ Plane (XZ)
      'fad344bc-09b1-4855-a2e6-437ef5715fe3', // YZ Plane (YZ)
    ],
    point: [
      '3581f42a-9592-4549-bd6b-1c0fc39d067b', // Construct Point (Pt)
      '9abae6b7-fa1d-448c-9209-4a8155345841', // Deconstruct (pDecon)
      '93b8e93d-f932-402c-b435-84be04d87666', // Distance (Dist)
      '0ae07da9-951b-4b9b-98ca-d312c252374d', // Numbers to Points (Num2Pt)
      'd24169cc-9922-4923-92bc-b9222efc413f', // Points to Numbers (Pt2Num)
    ],
    vector: [
      '6ec39468-dae7-4ffa-a766-f2ab22a2c62e', // Amplitude (Amp)
      'b464fccb-50e7-41bd-9789-8438db9bea9f', // Angle (Angle)
      '2a5cfb31-028a-4b34-b4e1-9b20ae15312e', // Cross Product (XProd)
      'a50fcd4a-cf42-4c3f-8616-022761e6cc93', // Deconstruct Vector (DeVec)
      '43b9ea8f-f772-40f2-9880-011a9c3cbbb0', // Dot Product (DProd)
      'd5788074-d75d-4021-b1a3-0bf992928584', // Reverse (Rev)
      'b6d7ba20-cf74-4191-a756-2216a36e30a7', // Rotate (VRot)
      'd2da1306-259a-4994-85a4-672d8a4c7805', // Unit Vector (Unit)
      '79f9fbb3-8f1d-4d9a-88a9-f7961b1012cd', // Unit X (X)
      'd3d195ea-2d59-4ffa-90b1-8b7ff3369f69', // Unit Y (Y)
      '9103c240-a6a9-4223-9b42-dbd19bf38e2b', // Unit Z (Z)
      '934ede4a-924a-4973-bb05-0dc4b36fae75', // Vector 2pt (Vec2Pt)
      '675e31bf-1775-48d7-bb8d-76b77786dd53', // Vector Length
      '56b92eab-d121-43f7-94d3-6cd8f0ddead8', // Vector XYZ (Vec)
    ],
  },
  curve: {
    analysis: [
      'ccc7b468-e743-4049-891f-299432545898', // Curve Middle (MidPt)
      'ccfd6ba8-ecb1-44df-a47e-08126a653c51', // Curve Domain (CrvDom)
      '11bbd48b-bb0a-4f1b-8167-fa297590390d', // End Points (End)
      'fc6979e4-7e91-4508-8e05-37c680779751', // Evaluate Curve (Eval)
      'c75b62fa-0a33-4da7-a5bd-03fd0068fd93', // Length (Len)
    ],
    division: [
      '2162e72e-72fc-4bf8-9459-d4d82fa8aa14', // Divide Curve (Divide)
      '1e531c08-9c80-46d6-8850-1b50d1dae69f', // Divide Distance (DivDist)
      'fdc466a9-d3b8-4056-852a-09dba0f74aca', // Divide Length (DivLength)
    ],
    primitive: [
      '807b86e3-be8d-4970-92b5-f8cdcb45b06b', // Circle (Cir)
      'd114323a-e6ee-4164-946b-e4ca0ce15efa', // Circle CNR (Circle)
      '4c4e56eb-2f04-43f9-95a3-cc46a14f495a', // Line (Ln)
      '4c619bc9-39fd-4717-82a6-1e07ea237bbe', // Line SDL (Line)
      '845527a6-5cea-4ae9-a667-96ae1667a4e8', // Polygon (Polygon)
      'd93100b6-d50b-40b2-831a-814659dc38e3', // Rectangle (Rectangle)
      '575660b1-8c79-4b8d-9222-7ab4a6ddb359', // Rectangle 2Pt (Rec 2Pt)
      '9bc98a1d-2ecc-407e-948a-09a09ed3e69d', // Rectangle 2Pt
    ],
    spline: [
      '2b2a4145-3dff-41d4-a8de-1ea9d29eef33', // Interpolate (IntCrv)
      '71b5b089-500a-4ea6-81c5-2f960441a0e8', // PolyLine (PLine)
    ],
  },
  mesh: {
    triangulation: [
      'a4011be0-1c91-45bd-8280-17dd3a9f46f1', // Voronoi (Voronoi)
    ],
  },
  intersect: {
    physical: [
      '84627490-0fb2-4498-8138-ad134ee4cb36', // Curve | Curve (CCX)
      '0991ac99-6a0b-47a9-b07d-dd510ca57f0f', // Curve | Self (CX)
    ],
    shape: [
      'f72c480b-7ee6-42ef-9821-c371e9203b44', // Region Difference (RDiff)
      '477c2e7b-c5e5-421e-b8b2-ba60cdf5398b', // Region Intersection (RInt)
      '1222394f-0d33-4f31-9101-7281bde89fe5', // Region Union (RUnion)
    ],
  },
  transform: {
    affine: [
      '4d2a06bd-4b0f-4c65-9ee0-4220e4c01703', // Scale (Scale)
      '290f418a-65ee-406a-a9d0-35699815b512', // Scale NU (Scale NU)
    ],
    array: [
      'c6f23658-617f-4ac8-916d-d0d9e7241b25', // Curve Array (ArrCurve)
      'e87db220-a0a0-4d67-a405-f97fd14b2d7a', // Linear Array (ArrLinear)
      'fca5ad7e-ecac-401d-a357-edda0a251cbc', // Polar Array (ArrPolar)
      'e521f7c8-92f4-481c-888b-eea109e3d6e9', // Rectangular Array (ArrRec)
    ],
    euclidean: [
      'f12daa2f-4fd5-48c1-8ac3-5dea476912ca', // Mirror (Mirror)
      'e9eb1dcf-92f6-4d4d-84ae-96222d60f56b', // Move (Move)
      'dd9f597a-4db0-42b1-9cb2-5607ec97db09', // Move Away From (MoveAway)
      '4fe87ef8-49e4-4605-9859-87940d62e1de', // Move To Plane (MoveToPlane)
      '378d0690-9da0-4dd1-ab16-1d15246e7c22', // Orient (Orient)
      'b7798b74-037e-4f0c-8ac7-dc1043d093e0', // Rotate (Rotate)
      '3dfb9a77-6e05-4016-9f20-94f78607d672', // Rotate 3D (Rot3D)
      '3ac8e589-37f5-477d-aa61-6699702c5728', // Rotate Axis (RotAx)
      '5edaea74-32cb-4586-bd72-66694eb73160', // Rotate Direction (Rotate)
    ],
  },
}

const getAllowed = (): Grasshopper.Component[] => {
  const allowedIds = getAllowedIds()

  return installed.filter((component) => allowedIds.includes(component.guid))
}

export const allowed = getAllowed()
