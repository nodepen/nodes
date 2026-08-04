import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { NodesApp, type Document as NodePenDocument } from "../dist/index.mjs"
import "../dist/styles.css";

const rootEl = document.getElementById("root")!
const root = createRoot(rootEl)

const doc: NodePenDocument = {
    id: 'voronoi',
    version: 1 as const,
    nodes: {},
    meta: {
        name: 'My Document',
    },
    controls: {
        inputs: [],
        outputs: []
    }
}

const templates = [
    {
        "guid": "2e3ab970-8545-46bb-836c-1c11e5610bce",
        "name": "Integer",
        "nickName": "Int",
        "description": "Contains a collection of integer numbers",
        "keywords": [],
        "icon": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOdSURBVEhL1VU5SGNRFI2KQSTuu3E37rvRuOGCCwhRAioOphPsbKxEUIIgDFiksbXQRsRCgjbaaBGwESdgZWWlMDPIDCl0Js5MOHPPS/7H0bhMNcyFS15+fs4995z73jP8q7BERUV9k0/8Rb6TfFvExcV9WF9fx8nJCbxeL46OjnBwcIDd3V1sbm5idXUVMzMzsNvt6OrqQllZGYTQR/mrMYTwQsTExDjkjz83NjbQ1tam0mazoaWlBc3NzWhoaEBtbS0qKysVcHFxMaqrq2EymW6jo6MXwzDPhjEpKenL9vY2xsfHFTtmZ2enKsQiTU1NqKurU6Dl5eUoLS1VWVJSAilwJxjmEFSEiI2NfT89Pf1reXkZ3d3d2Nrawktxfn6uwIuKilQnQu5epPKE4Z6EJTs7O7C2toaBgQH09vbi4uIiDBU5VlZWYLFYVIH8/Hzk5eXRC3ZhDUE+CNHeOzY2hqmpKSXL6OgogsEgfD4f9vf3sbe3B4/Ho4y+vr5Wv1E2rQDBc3JykJKSEpQivjCsHvb09PTvk5OT6k/UfH5+HktLS6oTysVnNLu1tRU3Nzc4Pj5GRUWFLhELiAIoKCiATOGtYDpD0GKssP/U3t4OJo3UikQyeXZ2VskzNzenm1xYWAiz2YysrCxVhAWli6+CbTKI8660tLTvBOcIchQJRLYEZT4c08PDQ/j9fjQ2NupjSv1zc3ORmZmJ1NRUVVTW3Khug1TyV1VVqdlmsghH0Wq1/pF8xm4CgQB2dnZ09g/1z8jIoAeqUH19PXe3nwXcMl53nG2tENcsRJZMrvnM5XIpeZxOpzL3IXvKI0ogOTlZ4cjzUAfUiXrxZe5OJjdRTU2N3hXXfHZ6eoqrqysdnIZSe+pO9pSHnVBS8TXkQTicRqPxlm1TV35yQrSCXPf19Sn23CcauCYNJdHY0zP5zr2gT5EKzi5f5JantkwyZXLtdrtVAY4tZSHzx+B8V8Y4KHBP9gHDxrOEpkXKy8tLnJ2dKdbUnLJo4DSW8gwNDSExMZHaP93JDOnCIy/ekzGBtBwZGVHsFxYWFGsaSs015gKqRlgm54fAPHsWMczsgh5QBrLUkqBkrAGTsUwfEhIS1O+8G8THl0/TcCxKy3ecHDk+9NRAKYfGWu4AxMfHo7+/nz4R/NX7gGEUqT5zLDs6OtDT06MAqO/w8LBi6nA4wINxYmICPL8GBwfffqOFg/fr4zv3tXz7nfwfhcHwG4jlh0fOcQdLAAAAAElFTkSuQmCC",
        "libraryName": "Grasshopper",
        "category": "Params",
        "subcategory": "Primitive",
        "isObsolete": false,
        "inputs": [],
        "outputs": []
    },
    {
        "guid": "3e8ca6be-fda8-4aaf-b5c0-3c54c8bb7312",
        "name": "Number",
        "nickName": "Num",
        "description": "Contains a collection of floating point numbers",
        "keywords": [],
        "icon": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQiSURBVEhL1VVbKLVpFN7ITnI+s5HDdj6fz5QoUeSQiUgOF27dqb+GXIyo/0a4kUMhKfqLnENEOYWEFLlkxAwKGzN65n1ee+9+Y/7/N1fTrFrtr/1977PWetaz1qv4r0xtYGDwKH7xL/wn4R8zExOT7a6uLqyurmJ5eRnz8/OYmprC6Ogo+vr60NLSgpqaGuTk5CApKQk+Pj4QCZ2Lo8pXhO+YkZFRnjj4R29vL+Li4qTHxsYiOjoakZGRCAsLQ3BwMPz9/SWwp6cnAgMDYW5ufmdoaPhJC/NNU1paWv42NDSEwsJCmR09MTFRBmKQiIgIhISESFBfX194e3tL9/LygghwLzBUr1D/YMbGxr9UVlb+2djYiJSUFKSlpUnnM4OwkqioKFlFUFAQ/Pz8kJ6ejoaGBlmJSO5JUPVFC/fO1E5OTo9tbW3Izs5Ge3s7BgcHMTIyguHhYfkfq2CA8PBw5Obmor+/H6enp1hbW4ObmxtcXV3ZC1YR9Qr5lQnulwsKClBaWoqBgQFsbm4iIyMDWVlZuLy8xP7+PpKTk2WAmJgYVFdXo6enB+fn59jb25Pgzs7OsLa2fhFBtrWwesuxs7PTFBcXQ1AkM1pcXNRTdHBwAI1Gg9bW1jcUVVVV4erqCkdHRzKAYADu7u4QKrwTmKWv0KKxIvtf4+PjQW9ubsb29rYMoGsyAzw9PWFjY+NNkxng+voaJycnUKlUcHR0lEE8PDxI1e8C20whOv+zra2thuDMjLzu7u5iZmZGL1PS8/z8jIuLizcyJU03NzcygIuLCxwcHGBjYyNVJZ4fRIDPChHpJiAgQB6is6k7OzuYnp6WdNB1AR4fH+U3/J4SJZ26AOTf3t6ePZCBQkNDOd03DPBZyOueZfNgd3e3bPDExIRUC51NJDgr4DeUp1qtRkVFhaTo+PhY0iOYgJWVlfxGqIoVtApXmJEv6phl19fXY2VlBWNjY/qqWNHDwwOWlpZk5gTn92VlZVJhh4eHMnvSw0o4L6Kvrz3QWqlSqbzjYeqd4OPj4zIgfWtrC7e3t3KgyC/BqZaSkhKcnZ3JBHTZs2eCIs6CXkXSqF3x4oXZNTU1yeVGcMqRHDMIn7n8FhYWpGrYA75bX1+X4DwrZuRFwL2bA1osdwklxkrq6urQ0dEhe9LZ2SnlyWmdnZ3F5OQkamtr5XalpOfm5lBeXo78/HxYWFiQ+/eTTBNVfBE8PpEGDs7XzowpRXLMhpJzHS0CVG5aoZxnAfPNXURTsQpWwGw5NDonKOWnA2ZDhfq4puV73g2ij9/fplr7JLR8T77F+tC7DpQ612VtZmYGU1NTuVFF1QT/4X1AUwqqLrgKEhISkJqaKgEyMzPl4mOmeXl54GIsKioC9xeXojjzsRtNa7xf/37n/sg/fif/j0yh+AuVqtAmN2lbmQAAAABJRU5ErkJggg==",
        "libraryName": "Grasshopper",
        "category": "Params",
        "subcategory": "Primitive",
        "isObsolete": false,
        "inputs": [],
        "outputs": []
    },
    {
        "guid": "3ede854e-c753-40eb-84cb-b48008f14fd4",
        "name": "Text",
        "nickName": "Txt",
        "description": "Contains a collection of text fragments",
        "keywords": [],
        "icon": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAO8SURBVEhL1VVLLJxhFB3ERMT7zXgb71e8X/GId2IhQZTuJGwktjaNxqpYNAQbsWBHiDRsbNgIC4lWYiUs7LSVtLqY6UNNTu+58/9Caaurpie5md/85px7z733+yz/CnYPD4/P8om/iCcSj4OPj8/r+fl57O3tYWdnB9vb29jc3MTa2hoWFxcxMTGB/v5+tLW1oaqqCqmpqZCE3spPrW6G38DLy6tdfvh9YWEBZWVlGqWlpSguLkZhYSHy8/ORk5ODjIwMJU5KSkJWVhb8/Pwcnp6ezwyaX8IaGBj4YWlpCZ2dnZodo7KyEu3t7TBxcnKipGlpaUhJSdFITk6GCDiFw+amegDe3t4v+vr6rkdHR1FdXY3a2loNPs/NzcHlchkSQHNzM9LT05U8MTFRK5HkvolVrwy6e7BHRUV9nZ6eRkNDgxLX19dr8Pns7AwrKysGPTA5Oak22e12FYiLi0NsbCx7wSqK3JS3IN7vdHR0oLe3V225LTAwMIDj4+M7Nh0dHd0RIHl0dDSCg4NdIvLGoL1BW1hY2Jfu7m5tKj2/bdHy8jKmpqa02aenp4YEUFdXd2MRBcQBxMfHQ6bQIZxP3dTSWMn+XXl5ORicFlOElVDo4uICLS0t+m52dtagB8bGxlQgISEBNpsNkZGRKkJBqeKjcPtZpPPPQ0NDv5CcI8hRJBGzpdDQ0JDugjmmXV1dBj1wcHCgzaX/MTExiIiIQEhIiIrKMxf1pUWUPmVmZupsMyhSUFCAoqIijY2NDQwPD+t35g6cn58bEtBKTf/Dw8PZAxXKy8vjdn+iwEsZL2dubi5MIT6TjBU4HA6D6mGMjIxo9rRHnEBQUJDySFXuCugT/WKpnAoGlyg7O1szX11d1Wd+x3dcrp6eHoMe2N/fV9+ZPe1hJbRX+urugYGnVqvVwR9z/fnJJTo8PMTg4KA+m+/oL0fz8vJSBa6vr7VaM3tWLRZxF26mSMHZpXdceZKMj48rAQX4N4NVmku1u7ur74mZmRklp3BJSYlL6O7tAVHKs4QEXCITTqdTjwmOIonZo/X1dVxdXRn/4cbW1haampoQEBBA7+9vMiFVvBIfvzFbTsbt4JyzmfSYDaXnpi1CqiMsk3MlNL88iwgbq6DfzJbNM4OktNAkZkNl+uDv76/veTdIH39/mhp4JrPs5OTI8XETJinn3Mxa7gD4+vrqeSVVk/yP9wFhFavecywrKipQU1OjBPS3tbVVM+Whx4ORW83zq7Gx8fE3mgHerz/fuX+Kx9/J/xEslh9QdsIn89F0TQAAAABJRU5ErkJggg==",
        "libraryName": "Grasshopper",
        "category": "Params",
        "subcategory": "Primitive",
        "isObsolete": false,
        "inputs": [],
        "outputs": []
    },
    {
        "guid": "cb95db89-6165-43b6-9c41-5702bc5bf137",
        "name": "Boolean",
        "nickName": "Bool",
        "description": "Contains a collection of boolean values",
        "keywords": [],
        "icon": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOsSURBVEhL1VU5S1xhFB0VB5Fx3x0Vl3Hf9w0VXEARVFQM2gmCgvgLBqIWBg0IoqWFdlaS0spGsIwiLmjhgoImRYKFZjSJnNxz5z0Rxy1VyIHLvHnLufeee77vs/wrOLy8vH7IL/4i3km8DX5+fp/n5+exvr6OtbU1rK6uYmVlBcvLy1hcXMTU1BQGBgbQ2tqK6upqpKamQgq6kE+tboYX4OPj0y4f/lpYWEB5eblGWVkZSkpKUFRUhPz8fOTk5CAjI0OJk5KSkJWVBZvNduXt7e00aJ6FNSgo6NvS0hK6urq0OkZVVZUmYpLCwkLk5uYqaVpaGlJSUjSSk5MhCa6Fw+6megK+vr4f+vv7f4+NjaGmpgZ1dXUavGYSdlJcXKxdZGdnIz09XckTExO1EynuVqT6ZNB5wBEdHX0zOzuLhoYGJa6vr0dLSwvm5uawu7sLE9vb25icnERBQQEcDocmiI+PR1xcHGfBLordlA8g2q91dnait7dXZWGCnp4eHB0dGbSeODg40HeZgOQxMTEICQm5kyQbBu09WsPDw10kpNaUg9UfHh4aVJ5wuVz6u7+/r8NmAlEACQkJEBdeCWefm1oGK9V/qaioAIODZJKZmRkleArn5+fo6OjA2dmZ/h8fH4fdbkdUVJQmYUfSxXfhtllk8u/DwsJcJOfwaEUmYftP4eLiAk1NTWrTkZERvbezs4PY2FhERkYiNDRUBy/XXKjTFsl0mZmZqd5mMAmteHNzox8/hEnO92lRDpmgXNQ/IiKCM9BEeXl5XN2XTDAt9rqmt81EvH6cgLKY5LQn3UMSggkojyiB4OBgfUdcxQ4+Slhs1Is+ZtsMLqKHtiQ5rctnrJzkfH9oaEifb21tafWUh51wvchc3TMw0Ge1Wq/4MR3B34mJCf2YnbS1tek9PqO+JGf1p6en+o7T6byvngYRibgW7l2koHepHZc8SVgtLUicnJxgeHhYW+f9wcFBHB8f67O9vT2tmuTsrLS09E7oPNYBUca9hBYzg84ykzwFknNmHCzl4YwCAwOpvedKJqSLT/LiLTvgwmFQjtHRUWxubhq0wMbGhspC77NyIVV7i2w/hebZvYiwswvqzb2Fi8YMuoQScpjUmxWL+xAQEKDPeTbIHF/eTQ04peVr7payfdyHSUo5zKrlDIC/v79uK9I1yV89DwirSPWVVq2srERtba0SUN/m5mattL29HdwYu7u7dUNsbGx8+4lmgOfr4zP3tXj7mfwfwWL5Ayn3+7H9F88PAAAAAElFTkSuQmCC",
        "libraryName": "Grasshopper",
        "category": "Params",
        "subcategory": "Primitive",
        "isObsolete": false,
        "inputs": [],
        "outputs": []
    },
    {
        "guid": "57da07bd-ecab-415d-9d86-af36d7073abc",
        "name": "Number Slider",
        "nickName": "",
        "description": "Numeric slider for single values",
        "keywords": [],
        "icon": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARHSURBVEhLrVZZKKV9HD52yhJRlCXuZMqFciFSLtyQC0UpuZkyERFjJzvZiWxj3/d93/fs29gbiSGyXJGdZ97f//O+4xDfxfedejpH3vM8v/X5HRH3kuRevtLS0mfcZ/wfkJGROeP4/LjPksTu9vXr17vr62s8Pz8zPD094fHxkeHh4YHh/v6e4e7ujuH29lbAzc2NAOI5PT2Fk5PTLScSIOLUjq6urvDr1y/Mzc0xzM/PY2FhgWFxcRFLS0tYXl7GysoKVldX8fPnT6ytrWF9fR0bGxvY3NzE1tYWtre3sbOzg4ODA/z+/RuysrJnIgkJiSeKuq+vj6G/vx+Dg4MYGhrC8PAwRkZGMDo6ivHxcUxMTGBychJTU1OYnp7GzMwMZmdnhaBeB3N+fs6XTMRKUFdXh/r6ejQ2NqKpqQktLS1obW1Fe3s7Ojo60NXVhe7ubvT29rJABgYGWCB8EGNjYywIPoDj4+O/AlTbHz9+oLCwEMXFxSgtLUVZWRkqKipQVVWF6upq1NbWCgE0Nze/E+/p6REqQNlTiQQBak5KSgrS0tKQkZGBrKwsZGdnIzc3F/n5+SgoKICtra0YPhPt7OzE7u7uX4HLy0tEREQgKioKsbGxiI+PR0JCApKTk5GamspETUxMxPA6Wz7T14LUcEHg4uIC3KjC1dUVbm5u8PDwgJeXF3x8fODn54fAwED+YQEURGJiIss8PT0dmZmZLOu8vDyWMTX85VkRm9tv377B3d0dnp6e8Pb2FiMPCQkRIyckJSWx7N6SU2YlJSVsml6eFeHk5ESM3NfXF/7+/ggKCkJoaCjCw8PFyAl86ahfOTk5rFc8eXl5uXgGR0dHn5JTb3hiHp+RUz/EBA4PDz8kp4bypG9hbm7+jpyfLrES7e/v4/v37wgICEBwcDDCwsKEqSLo6OiIERP09fVZ9G/JaWFpimibX54VYW9v7x15dHQ04uLi2LhSJkpKSgK5srIyG+GioiJhTF+TkwuICdBSfERORLSAVD7OHRno2c/IadnEBMhJPyPnx9DZ2RkuLi4fktMm89ZBzisIkMVGRkbC0dGRNe7Lly+sxpqamlBVVYWioiLk5OQgJSXFvkTv8vLyrGzq6uqsR4aGhjAzM4O9vT0bErJ1QYC8PCYmho4ELC0tYWxsDAMDA2hpaUFNTY0RKSgo0KVi5PROf1MvNDQ0oKenByMjI1hYWMDBwYFVg26GIEAHg199a2trYTu1tbWF1acsyGErKysZOXkO2ToFQWUhK7eysmIWTvZNB0kQoKvE+4qdnZ1Qc8qCH0MqFS1QTU0NVFRUGDnVXFdXl1k12bSNjQ07TnSYBAE6a3Q0KLJ/205aoIaGBmbNbW1tzJZ5croBPDldOfof16czER1mU1PTa7pQ1BjqPoHG7DPwz/E3mkA3miKnknE9ueaCD6ASSdJPDHag/6nZfwZFzvFxP1tEkn8Am4lkKqvpHb8AAAAASUVORK5CYII=",
        "libraryName": "Grasshopper",
        "category": "Params",
        "subcategory": "Input",
        "isObsolete": false,
        "inputs": [],
        "outputs": []
    },
    {
        "guid": "e64c5fb1-845c-4ab1-8911-5f338516ba67",
        "name": "Series",
        "nickName": "Series",
        "description": "Create a series of numbers.",
        "keywords": [],
        "icon": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFtSURBVEhLzZQ9boQwEIVpkNgqRYQETYpUEVKK1HsGepA4Hh0SDUfYlpKeozjzRjvW4Kx/2KTIk55sY3ifdwY2+8/KE/yc2rY1MdNtL+SnIDkC1nX1+g54IwNyWhYwjqPpuo4DMWKtAB/kV34iQbquFwH0fW+WZeE5RqwV4JMcBzRNY2JG6DRNZhiG04AcAfu+e439eZ759Bj/BKCvYa7Dfw3A2gXo8BhAN5Mb6gIkVM8RKA4BcDFoH0Cf3gfAaU1I2PcB9C8Q0/2H78AC8LGUZcmBdV1zfSGsfQDau5K/yDg1jPDDl2wBRVGYbdt4frvdTFVVPMe+BIoVAOHv5IqMU8OH/yILkFGkr8upte8AnBrhFzKyxFZJAH16bdqTeh9CtZIAZLfWbr3jANQctYfcHpAf1fpHvR/JAvDW4O3B2n2LyL5aB8MhC/AJ+2QAgrX2iQEJjjbTJzyAOqJZCNFNFCc1MySB6Oa5PhmeZd81OYA7SLU5jgAAAABJRU5ErkJggg==",
        "libraryName": "Math Components",
        "category": "Sets",
        "subcategory": "Sequence",
        "isObsolete": false,
        "inputs": [
            {
                "__order": 0,
                "__direction": "input",
                "name": "Start",
                "nickName": "S",
                "description": "First number in the series",
                "typeName": "number",
                "keywords": [],
                "isOptional": false
            },
            {
                "__order": 1,
                "__direction": "input",
                "name": "Step",
                "nickName": "N",
                "description": "Step size for each successive number",
                "typeName": "number",
                "keywords": [],
                "isOptional": false
            },
            {
                "__order": 2,
                "__direction": "input",
                "name": "Count",
                "nickName": "C",
                "description": "Number of values in the series",
                "typeName": "integer",
                "keywords": [],
                "isOptional": false
            }
        ],
        "outputs": [
            {
                "__order": 0,
                "__direction": "output",
                "name": "Series",
                "nickName": "S",
                "description": "Series of numbers",
                "typeName": "number",
                "keywords": [],
                "isOptional": false
            }
        ]
    },
]

const solution = {
    solutionModelUrl: null,
    solutionStatusMessages: {
        document: {
            status: 'ok' as const,
            message: 'Ok message here.'
        },
        model: {
            status: 'error' as const,
            message: 'Failed to do something!'
        }
    },
    documentRuntimeData: {
        durationMs: 100,
        exceptionMessages: []
    },
    nodeSolutionData: {}
}

const assets = {
    models: {}
}

let presence = {
    sessions: {
        ['demo-id']: {
            userId: 'fake-id',
            color: '#79D3F6',
            name: 'John Grasshopper'
        }
    },
    cursors: {
        ['demo-id']: {
            x: 100,
            y: 100
        }
    },
    cameras: {}
}

root.render(<StrictMode>
    <div style={{ width: '100vw', height: '100vh' }}>
        <NodesApp document={doc} templates={templates as any} solution={solution} assets={assets} presence={presence} />
    </div>
</StrictMode>)