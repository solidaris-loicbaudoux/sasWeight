import { IPersonFirestore } from "../../models/person";

export const PersonsToLoad: IPersonFirestore[] = [
    {
        "id": "1",
        "name": "Saskia",
        "surname": "Smith",
        "listWeight": [
            { "date": "01-01-2026", "weight": 70 },
            { "date": "01-02-2026", "weight": 68 },
            { "date": "01-05-2026", "weight": 65 },
            { "date": "01-09-2026", "weight": 62 },
            { "date": "01-02-2027", "weight": 66 }
        ],
        "chambreNumber": "0001",
        "aileName": "Azurite"
    },
    {
        "id": "2",
        "name": "John",
        "surname": "Doe",
        "listWeight": [
            { "date": "01-01-2026", "weight": 80 }
        ],
        "chambreNumber": "0002",
        "aileName": "Saphire"
    },
    {
        "id": "3",
        "name": "Alice",
        "surname": "Johnson",
        "listWeight": [
            { "date": "01-01-2026", "weight": 60 },
            { "date": "01-02-2026", "weight": 59 },
            { "date": "01-03-2026", "weight": 58 }
        ],
        "chambreNumber": "-1003",
        "aileName": "Emeraude"
    }
]