export interface StandsResponse {
  total_count: number;
  results: Stand[];
}

export interface Stand {
  coordonnees: Coordinates;
  dep_code: string;
  dep_nom: string;
  equip_aps_nom: string[];
  equip_douche?: string;
  equip_eclair?: string;
  equip_haut?: number;
  equip_larg?: number;
  equip_long?: number;
  equip_nature: string;
  equip_nom: string;
  equip_numero: string;
  equip_ouv_public_bool: string;
  equip_piste_nb?: number;
  equip_sanit?: string;
  equip_sol: string;
  equip_surf?: number;
  equip_type_famille: string;
  equip_type_name: string;
  inst_acc_handi_bool: string;
  inst_acc_handi_type?: string;
  inst_adresse: string;
  inst_com_nom: string;
  inst_cp: string;
  inst_nom: string;
  inst_numero: string;
  inst_part_bool: string;
  inst_part_type_filter?: string[];
  reg_nom: string;
}

interface Coordinates {
  lon: number;
  lat: number;
}
