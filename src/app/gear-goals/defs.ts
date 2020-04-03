/*
    Various defitions used by the whole module. Consts, Enums, etc
*/

export enum STAT_MAP {
    NO_STAT = 0,
    ATTACK,
    DEFENSE,
    HEALTH,
    SPEED,
    CRITRATE,
    CRITDMG,
    EFFECTIVENESS,
    EFFRES,
    DUALATTACK
}

export enum GEAR_SETS {
    NO_SET = 0,
    ATTACK_SET,
    DEFENSE_SET,
    HEALTH_SET,
    SPEED_SET,
    CRIT_SET,
    HIT_SET,
    DESTRUCTION_SET,
    RESIST_SET,
    COUNTER_SET,
    LIFESTEAL_SET,
    UNITY_SET,
    RAGE_SET,
    IMMUNITY_SET
}

export enum E7DB_API_ENDPOINTS {
    STATUS = 'https://api.epicsevendb.com/status',
    GET_HERO_LIST = "https://api.epicsevendb.com/hero",
    GET_HERO = "https://api.epicsevendb.com/hero/",
    GET_ARTIFACT_LIST = 'https://api.epicsevendb.com/artifact',
    GET_ARTIFACT = 'https://api.epicsevendb.com/artifact/',
    V1_GET_HERO_DATA = 'https://epicsevendb-apiserver.herokuapp.com/api/hero/'
}