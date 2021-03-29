export const ANIMALS = "animals";
export const DOGS = "dogs";
export const CATS = "cats";
export const OTHER = "other";
export const USER = "user";
export const SHELTER = "shelter";
export const MALE = "male";
export const FEMALE = "female";


export const SIZE_BIG = "size_big";
export const SIZE_MEDIUM = "size_medium";
export const SIZE_SMALL = "size_small";
export const SIZE_UNKNOWN = "size_unknown";


export const LIKE_ANIMALS = "like_animals";
export const LIKE_KIDS = "like_kids";
export const FRIENDLY = "friendly";
export const ACTIVE = "active";
export const WATCHDOG = "watchdog";

export const WRONG_IC = "Neplatné IČ.";
export const EMPTY_FIELD = "Toto pole nesmí být prázdné.";
export const PASSWORD_MISMATCH = "Hesla se neshodují.";
export const FIREBASE_EMAIL_FORMAT_ERROR = "Zadaná adresa není ve správném formátu.";
export const FIREBASE_EMAIL_EXISTS = "Uživatel s touto e-mailovou adresou již existuje.";
export const FIREBASE_WEAK_PASSWORD = "Heslo musí mít alespoň 6 znaků.";

export const DOG_BEHAVIOR = [
    LIKE_ANIMALS,
    LIKE_KIDS,
    FRIENDLY,
    ACTIVE,
    WATCHDOG
]

export const CAT_BEHAVIOR = [
    LIKE_ANIMALS,
    LIKE_KIDS,
    FRIENDLY,
    ACTIVE
]

export const OTHER_BEHAVIOR = [
    LIKE_ANIMALS,
    LIKE_KIDS,
    FRIENDLY
]

export const BEHAVIOR_MAP = new Map ([
    [DOGS, DOG_BEHAVIOR],
    [CATS, CAT_BEHAVIOR],
    [OTHER, OTHER_BEHAVIOR]
])

export const UPLOADING = "uploading";
export const SAVE = "Uložit";
export const WAIT_INTERVAL = 500;


